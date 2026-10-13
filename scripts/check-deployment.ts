import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { isIP } from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { publishedLocales } from '../src/i18n/locales.ts';
import { pagePath, sitemapUrls } from '../src/routing.ts';

/** Validate an origin without relying on NODE_ENV or making DNS requests. */
export function deploymentSite(value: string | undefined): URL {
  const fail = () => {
    throw new Error(
      'Deployment requires SITE_URL to be a public HTTPS origin (no credentials, path, query, fragment, or custom port).',
    );
  };
  if (
    !value ||
    value !== value.trim() ||
    !/^https:\/\/[^/\\?#\s]+\/?$/i.test(value)
  )
    return fail();
  let site: URL;
  try {
    site = new URL(value);
  } catch {
    return fail();
  }
  const host = site.hostname;
  if (
    site.protocol !== 'https:' ||
    site.username ||
    site.password ||
    value.includes('@') ||
    site.port ||
    site.pathname !== '/' ||
    isIP(host) ||
    host.length > 253 ||
    !host
      .split('.')
      .every((label) =>
        /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label),
      ) ||
    !/\.(?:[a-z]{2,}|xn--[a-z0-9-]+)$/i.test(host) ||
    /(?:^|\.)(?:localhost|local|internal|test|invalid|example|onion)$|(?:^|\.)home\.arpa$/i.test(
      host,
    )
  )
    return fail();
  return new URL(site.origin);
}

// Read only the generated head's link/meta tags; comments and raw-text elements
// cannot stand in for real metadata. No browser or new parser dependency needed.
function metadataTags(html: string) {
  const markup = html.replace(
    /<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
    '',
  );
  const heads = [...markup.matchAll(/<head\b[^>]*>([\s\S]*?)<\/head\s*>/gi)];
  if (heads.length !== 1) throw new Error('Expected exactly one HTML head');
  return [
    ...heads[0][1].matchAll(/<(link|meta)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi),
  ].map((tag): Record<string, string> => {
    const attributes: Record<string, string> = {};
    const body = tag[2].replace(/\/$/, '');
    const attribute =
      /\s+([^\s=/'"<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s'"=<>`]+)))?/g;
    let end = 0;
    for (const match of body.matchAll(attribute)) {
      if (body.slice(end, match.index).trim())
        throw new Error('Malformed metadata attributes');
      const name = match[1].toLowerCase();
      if (Object.hasOwn(attributes, name))
        throw new Error('Duplicate metadata attribute');
      attributes[name] = match[2] ?? match[3] ?? match[4] ?? '';
      end = match.index + match[0].length;
    }
    if (body.slice(end).trim())
      throw new Error('Malformed metadata attributes');
    return { tag: tag[1].toLowerCase(), ...attributes };
  });
}

function sameValues(actual: readonly string[], expected: readonly string[]) {
  return (
    JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort())
  );
}

/** Inspect the assets selected by Astro's generated Wrangler deployment pointer. */
export function validateDeployment(
  root: string,
  value: string | undefined,
): void {
  const site = deploymentSite(value);
  const pointerPath = resolve(root, '.wrangler/deploy/config.json');
  const pointer = JSON.parse(readFileSync(pointerPath, 'utf8'));
  if (typeof pointer.configPath !== 'string')
    throw new Error('Missing generated Wrangler configPath');
  const configPath = resolve(dirname(pointerPath), pointer.configPath);
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  if (typeof config.assets?.directory !== 'string')
    throw new Error('Missing generated Wrangler assets directory');
  const assets = resolve(dirname(configPath), config.assets.directory);
  const issues: string[] = [];
  const read = (path: string) => {
    try {
      return readFileSync(resolve(assets, path), 'utf8');
    } catch {
      issues.push(`${path}: missing or unreadable artifact`);
      return '';
    }
  };
  const expectedAlternates = publishedLocales.map(
    (locale) => `${locale}=${new URL(pagePath('home', locale), site).href}`,
  );
  for (const locale of publishedLocales) {
    const path = `${pagePath('home', locale).slice(1)}index.html`;
    try {
      const tags = metadataTags(read(path));
      const links = tags.filter((tag) => tag.tag === 'link');
      const rel = (tag: Record<string, string>, name: string) =>
        tag.rel?.toLowerCase().split(/\s+/).includes(name);
      const canonical = links
        .filter((tag) => rel(tag, 'canonical'))
        .map((tag) => tag.href);
      if (
        !sameValues(canonical, [new URL(pagePath('home', locale), site).href])
      )
        issues.push(`${path}: incorrect self-canonical`);
      const alternates = links
        .filter((tag) => rel(tag, 'alternate') && 'hreflang' in tag)
        .map((tag) => `${tag.hreflang}=${tag.href}`);
      if (!sameValues(alternates, expectedAlternates))
        issues.push(`${path}: incorrect reciprocal hreflang`);
      if (
        tags.some(
          (tag) =>
            tag.tag === 'meta' &&
            tag.name?.toLowerCase() === 'robots' &&
            /\bnoindex\b/i.test(tag.content),
        )
      )
        issues.push(`${path}: published homepage is noindex`);
    } catch (error) {
      issues.push(`${path}: ${(error as Error).message}`);
    }
  }
  // The existing sitemap contract is a namespace-qualified urlset of loc entries.
  const sitemap = read('sitemap.xml').trim();
  const body =
    /^(?:<\?xml\s+[^?]*\?>\s*)?<urlset\s+xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']\s*>([\s\S]*)<\/urlset>$/.exec(
      sitemap,
    )?.[1];
  const entry = /<url>\s*<loc>([^<>]*)<\/loc>\s*<\/url>/g;
  const urls =
    body === undefined
      ? []
      : [...body.matchAll(entry)].map((match) => match[1]);
  if (
    body === undefined ||
    body.replace(entry, '').trim() ||
    !sameValues(urls, sitemapUrls(site))
  )
    issues.push('sitemap.xml: malformed or incorrect published homepage URLs');
  const robotsSitemaps = [
    ...read('robots.txt').matchAll(/^[ \t]*Sitemap:[ \t]*(\S+)[ \t]*\r?$/gim),
  ].map((match) => match[1]);
  if (!sameValues(robotsSitemaps, [new URL('/sitemap.xml', site).href]))
    issues.push('robots.txt: incorrect sitemap reference');
  if (issues.length)
    throw new Error(
      `Deployment metadata validation failed:\n${issues.join('\n')}`,
    );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    const args = process.argv.slice(2);
    if (args.length && (args.length !== 1 || args[0] !== '--build'))
      throw new Error('Usage: check-deployment.ts [--build]');
    const site = deploymentSite(process.env.SITE_URL);
    const root = fileURLToPath(new URL('../', import.meta.url));
    if (args[0] === '--build') {
      const build = spawnSync(
        process.execPath,
        [resolve(root, 'node_modules/astro/bin/astro.mjs'), 'build'],
        {
          cwd: root,
          stdio: 'inherit',
          env: { ...process.env, SITE_URL: site.origin },
        },
      );
      if (build.error) throw build.error;
      if (build.status !== 0)
        throw new Error(
          `Deployment build failed (${build.signal ?? build.status})`,
        );
    }
    validateDeployment(root, process.env.SITE_URL);
    console.log('Deployment metadata validation passed.');
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
