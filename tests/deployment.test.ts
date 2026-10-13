import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdtempSync,
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import {
  deploymentSite,
  validateDeployment,
} from '../scripts/check-deployment.ts';
import { publishedLocales } from '../src/i18n/locales.ts';
import { pagePath } from '../src/routing.ts';

const origin = 'https://distroquest.com';
const root = fileURLToPath(new URL('../', import.meta.url));
const homeFile = (locale: (typeof publishedLocales)[number]) =>
  `dist/client/${pagePath('home', locale).slice(1)}index.html`;

function fixture(
  run: (directory: string, write: (file: string, text: string) => void) => void,
) {
  const directory = mkdtempSync(join(tmpdir(), 'distroquest-deployment-'));
  function write(file: string, text: string) {
    const path = join(directory, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  }
  write(
    '.wrangler/deploy/config.json',
    JSON.stringify({ configPath: '../../dist/client/wrangler.json' }),
  );
  write(
    'dist/client/wrangler.json',
    JSON.stringify({ assets: { directory: '.' } }),
  );
  for (const locale of publishedLocales) {
    write(
      homeFile(locale),
      `<html><head><link href='${origin}${pagePath('home', locale)}' rel='canonical'>${publishedLocales.map((alternate) => `<link hreflang="${alternate}" href="${origin}${pagePath('home', alternate)}" rel="alternate">`).join('')}</head><body></body></html>`,
    );
  }
  write(
    'dist/client/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publishedLocales.map((locale) => `<url><loc>${origin}${pagePath('home', locale)}</loc></url>`).join('')}</urlset>`,
  );
  write(
    'dist/client/robots.txt',
    `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
  );
  try {
    run(directory, write);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('deployment origin accepts public HTTPS origins and normalizes the trailing slash', () => {
  for (const value of [origin, `${origin}/`, 'https://DISTROQUEST.com:443'])
    assert.equal(deploymentSite(value).href, `${origin}/`);
});

test('deployment origin rejects missing, malformed, local and non-origin URLs', () => {
  for (const value of [
    undefined,
    '',
    'not a URL',
    'https:distroquest.com',
    'https:////distroquest.com',
    'https://distro\nquest.com',
    'https://distroquest.com/.',
    'http://distroquest.com',
    'https://localhost',
    'https://host.local',
    'https://host.internal',
    'https://host.test',
    'https://host.invalid',
    'https://host.example',
    'https://host.home.arpa',
    'https://127.0.0.1',
    'https://192.168.1.1',
    'https://[::1]',
    'https://host',
    'https://-bad.com',
    'https://bad_.com',
    'https://user:password@distroquest.com',
    'https://@distroquest.com',
    'https://distroquest.com/path/',
    'https://distroquest.com?query',
    'https://distroquest.com#fragment',
    'https://distroquest.com?',
    'https://distroquest.com:8443',
    ` ${origin}`,
    `${origin} `,
    'https://distroquest.com\\path',
  ]) {
    assert.throws(
      () => deploymentSite(value),
      /Deployment requires SITE_URL/,
      value ?? 'undefined',
    );
  }
});

test('deployment CLI rejects invalid origins before attempting a build, independently of NODE_ENV', () => {
  for (const mode of [[], ['--build']])
    for (const value of [undefined, 'http://distroquest.com']) {
      const env: NodeJS.ProcessEnv = {
        ...process.env,
        NODE_ENV: 'development',
      };
      delete env.NODE_TEST_CONTEXT;
      delete env.SITE_URL;
      if (value !== undefined) env.SITE_URL = value;
      const result = spawnSync(
        process.execPath,
        ['--experimental-strip-types', 'scripts/check-deployment.ts', ...mode],
        { cwd: root, env, encoding: 'utf8' },
      );
      assert.equal(result.status, 1, result.stderr);
      assert.match(result.stderr, /Deployment requires SITE_URL/);
      assert.equal(result.stdout, '');
    }
});

test('deployment validates every published homepage through the generated Wrangler assets pointer', () => {
  fixture((directory) =>
    assert.doesNotThrow(() => validateDeployment(directory, origin)),
  );
  fixture((directory, write) => {
    write(
      'dist/client/wrangler.json',
      JSON.stringify({ assets: { directory: '../wrong-directory' } }),
    );
    assert.throws(
      () => validateDeployment(directory, origin),
      /missing or unreadable artifact/,
    );
  });
});

test('deployment CLI passes valid artifacts and exits unsuccessfully after metadata corruption', () => {
  fixture((directory, write) => {
    mkdirSync(join(directory, 'scripts'));
    copyFileSync(
      join(root, 'scripts/check-deployment.ts'),
      join(directory, 'scripts/check-deployment.ts'),
    );
    symlinkSync(join(root, 'src'), join(directory, 'src'), 'dir');
    const env: NodeJS.ProcessEnv = { ...process.env, SITE_URL: origin };
    delete env.NODE_TEST_CONTEXT;
    const run = () =>
      spawnSync(
        process.execPath,
        ['--experimental-strip-types', 'scripts/check-deployment.ts'],
        { cwd: directory, env, encoding: 'utf8' },
      );
    const valid = run();
    assert.equal(valid.status, 0, valid.stderr);
    assert.match(valid.stdout, /Deployment metadata validation passed/);
    write('dist/client/robots.txt', 'User-agent: *\nAllow: /\n');
    const invalid = run();
    assert.equal(invalid.status, 1);
    assert.match(invalid.stderr, /robots.txt: incorrect sitemap reference/);
  });
});

test('deployment rejects missing, relative, wrong-origin, wrong-page and duplicate canonicals', () => {
  for (const locale of publishedLocales)
    for (const canonical of [
      '',
      '/',
      'https://wrong.com/',
      `${origin}/quiz/`,
      `${origin}${pagePath('home', locale)}?query`,
    ]) {
      fixture((directory, write) => {
        const path = homeFile(locale);
        write(
          path,
          readFileSync(join(directory, path), 'utf8').replace(
            /<link href='[^']*' rel='canonical'>/,
            canonical ? `<link rel="canonical" href="${canonical}">` : '',
          ),
        );
        assert.throws(
          () => validateDeployment(directory, origin),
          /incorrect self-canonical/,
        );
      });
    }
  fixture((directory, write) => {
    const path = homeFile('en');
    write(
      path,
      readFileSync(join(directory, path), 'utf8').replace(
        '</head>',
        `<link rel="canonical" href="${origin}/"></head>`,
      ),
    );
    assert.throws(
      () => validateDeployment(directory, origin),
      /incorrect self-canonical/,
    );
  });
});

test('deployment rejects incomplete, incorrect, duplicate and unpublished hreflang entries', () => {
  for (const change of [
    (html: string) => html.replace(/<link hreflang="it"[^>]*>/, ''),
    (html: string) => html.replace(`${origin}/pt/`, `${origin}/pt/quiz/`),
    (html: string) => html.replace('hreflang="it"', 'hreflang="fr"'),
    (html: string) =>
      html.replace(
        '</head>',
        `<link rel="alternate" hreflang="en" href="${origin}/"></head>`,
      ),
  ])
    fixture((directory, write) => {
      const path = homeFile('es');
      write(path, change(readFileSync(join(directory, path), 'utf8')));
      assert.throws(
        () => validateDeployment(directory, origin),
        /incorrect reciprocal hreflang/,
      );
    });
});

test('commented, scripted, body-only and malformed metadata cannot satisfy the gate', () => {
  for (const wrap of [
    (head: string) => `<!--${head}-->`,
    (head: string) => `<script>${JSON.stringify(head)}</script>`,
    (head: string) => `</head><body>${head}</body><head>`,
    (head: string) =>
      head.replace(
        "rel='canonical'",
        "rel='canonical' href='https://wrong.com/'",
      ),
  ])
    fixture((directory, write) => {
      const path = homeFile('en');
      write(
        path,
        readFileSync(join(directory, path), 'utf8').replace(
          /<head>([\s\S]*)<\/head>/,
          (_, head: string) => `<head>${wrap(head)}</head>`,
        ),
      );
      assert.throws(
        () => validateDeployment(directory, origin),
        /Deployment metadata validation failed/,
      );
    });
});

test('deployment rejects an accidentally noindexed homepage or missing artifacts/configuration', () => {
  fixture((directory, write) => {
    const path = homeFile('pt');
    write(
      path,
      readFileSync(join(directory, path), 'utf8').replace(
        '</head>',
        '<meta name="robots" content="noindex, follow"></head>',
      ),
    );
    assert.throws(
      () => validateDeployment(directory, origin),
      /homepage is noindex/,
    );
  });
  fixture((directory) => {
    rmSync(join(directory, homeFile('it')));
    assert.throws(
      () => validateDeployment(directory, origin),
      /missing or unreadable artifact/,
    );
    rmSync(join(directory, '.wrangler/deploy/config.json'));
    assert.throws(() => validateDeployment(directory, origin), /ENOENT/);
  });
});

test('deployment rejects missing, extra, duplicate, wrong-origin and malformed sitemap URLs', () => {
  for (const transform of [
    (xml: string) => xml.replace(/<url><loc>[^<]+\/it\/<\/loc><\/url>/, ''),
    (xml: string) =>
      xml.replace(
        '</urlset>',
        `<url><loc>${origin}/quiz/</loc></url></urlset>`,
      ),
    (xml: string) =>
      xml.replace('</urlset>', `<url><loc>${origin}/</loc></url></urlset>`),
    (xml: string) => xml.replaceAll(origin, 'https://wrong.com'),
    (xml: string) => xml.replace('</urlset>', ''),
    (xml: string) => xml.replace('<url>', '<broken>'),
    () => '',
  ])
    fixture((directory, write) => {
      const path = 'dist/client/sitemap.xml';
      write(path, transform(readFileSync(join(directory, path), 'utf8')));
      assert.throws(
        () => validateDeployment(directory, origin),
        /sitemap.xml: malformed or incorrect/,
      );
    });
});

test('deployment requires exactly one correct absolute sitemap reference in robots.txt', () => {
  for (const text of [
    '',
    'Sitemap: /sitemap.xml',
    'Sitemap: https://wrong.com/sitemap.xml',
    `Sitemap:\n${origin}/sitemap.xml`,
    `Sitemap: ${origin}/sitemap.xml\nSitemap: ${origin}/sitemap.xml`,
  ])
    fixture((directory, write) => {
      write('dist/client/robots.txt', text);
      assert.throws(
        () => validateDeployment(directory, origin),
        /robots.txt: incorrect sitemap reference/,
      );
    });
});
