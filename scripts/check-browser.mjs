// Optional local Chromium regression check. Requires a production build; no npm
// browser dependency or user-started server. Reports/screenshots stay under /tmp.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdtemp } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { recommendationPersonas } from './recommendation-personas.ts';
import { questions } from '../src/data/questions.ts';
import { publishedLocales, getMessages } from '../src/i18n/index.ts';
import { startQuiz, selectAnswer, nextQuestion } from '../src/quiz/state.ts';
import { platformShortlist } from '../src/quiz/platform-presentation.ts';
const root = fileURLToPath(new URL('../dist/client/', import.meta.url));
const artifacts = await mkdtemp('/tmp/distroquest-m8-browser-');
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};
const server = createServer(async (req, res) => {
  try {
    let pathname = new URL(req.url, 'http://localhost').pathname;
    if (pathname.endsWith('/')) pathname += 'index.html';
    const path = resolve(root, `.${pathname}`);
    if (!path.startsWith(root)) throw Error('Invalid path');
    const data = await readFile(path);
    res.writeHead(200, {
      'Content-Type': mime[extname(path)] ?? 'application/octet-stream',
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = spawn(
  process.env.CHROME_PATH ?? '/usr/bin/chromium-browser',
  [
    '--headless',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--remote-debugging-port=0',
    `--user-data-dir=${artifacts}/profile`,
    'about:blank',
  ],
  { stdio: ['ignore', 'ignore', 'pipe'] },
);
let ws;
const errors = [],
  summary = { artifacts, layouts: 0, quizFlows: 0, lighthouse: [], errors };
try {
  const endpoint = await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(
      () => reject(Error('Chromium startup timed out')),
      20000,
    );
    browser.stderr.on('data', (data) => {
      output += data;
      const m = output.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) {
        clearTimeout(timer);
        resolve(m[1]);
      }
    });
    browser.on('error', reject);
    browser.on('exit', (code) => {
      clearTimeout(timer);
      reject(Error(`Chromium exited: ${code}`));
    });
  });
  const port = new URL(endpoint).port;
  const targets = await (
    await fetch(`http://127.0.0.1:${port}/json/list`)
  ).json();
  ws = new WebSocket(
    targets.find((target) => target.type === 'page').webSocketDebuggerUrl,
  );
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', reject);
  });
  let seq = 0;
  const pending = new Map();
  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const task = pending.get(message.id);
      if (!task) return;
      pending.delete(message.id);
      message.error
        ? task.reject(Error(JSON.stringify(message.error)))
        : task.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown')
      errors.push(
        message.params.exceptionDetails.exception?.description ??
          message.params.exceptionDetails.text,
      );
  });
  const cdp = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++seq;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(Error(`CDP timed out: ${method}`));
      }, 15000);
      pending.set(id, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  await cdp('Page.enable');
  await cdp('Runtime.enable');
  const evaluate = async (expression) => {
    const r = await cdp('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (r.exceptionDetails)
      throw Error(
        r.exceptionDetails.exception?.description ?? r.exceptionDetails.text,
      );
    return r.result.value;
  };
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const waitFor = async (expression) => {
    for (let i = 0; i < 150; i++) {
      try {
        if (await evaluate(expression)) return;
      } catch {}
      await delay(40);
    }
    throw Error(`Timed out: ${expression}`);
  };
  const navigate = async (path, quiz = false) => {
    await cdp('Page.navigate', { url: origin + path });
    await waitFor(
      `location.pathname===${JSON.stringify(path)}&&document.readyState==='complete'&&${quiz ? "!!document.querySelector('#quiz-root input')" : "!!document.querySelector('main')"}`,
    );
  };
  const checkLinkHover = async (selector) => {
    await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
    const read = () =>
      evaluate(
        `(()=>{const a=document.querySelector(${JSON.stringify(selector)}),text=a.querySelector('.link-text'),icon=a.querySelector('[aria-hidden="true"]');return{anchor:getComputedStyle(a).textDecorationLine,text:getComputedStyle(text).textDecorationLine,icon:icon?getComputedStyle(icon).textDecorationLine:null,rect:a.getBoundingClientRect().toJSON()};})()`,
      );
    const before = await read();
    assert.equal(before.anchor, 'none');
    assert.equal(before.text, 'none');
    await cdp('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: before.rect.x + before.rect.width / 2,
      y: before.rect.y + before.rect.height / 2,
    });
    const after = await read();
    assert.equal(after.anchor, 'none');
    assert.equal(after.text, 'underline');
    if (after.icon) assert.equal(after.icon, 'none');
    await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
  };
  const checkLayout = async () => {
    const result = await evaluate(
      `(()=>{const small=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const node=walker.currentNode,e=node.parentElement;if(!node.textContent.trim()||!e||e.closest('script,style,svg,[aria-hidden="true"]'))continue;const s=getComputedStyle(e),r=e.getBoundingClientRect();if(s.visibility==='hidden'||s.display==='none'||!r.width||!r.height)continue;if(parseFloat(s.fontSize)<14)small.push(node.textContent.trim());}return{overflow:document.documentElement.scrollWidth>innerWidth,small};})()`,
    );
    assert.equal(result.overflow, false, 'horizontal overflow');
    assert.deepEqual(result.small, [], 'undersized text');
    summary.layouts++;
  };
  for (const locale of publishedLocales)
    for (const width of [320, 390, 760, 1440])
      for (const theme of ['light', 'dark']) {
        const prefix = locale === 'en' ? '' : `/${locale}`;
        await cdp('Emulation.setDeviceMetricsOverride', {
          width,
          height: 900,
          deviceScaleFactor: 1,
          mobile: width < 700,
        });
        await cdp('Emulation.setEmulatedMedia', {
          features: [
            { name: 'prefers-color-scheme', value: theme },
            { name: 'prefers-reduced-motion', value: 'reduce' },
          ],
        });
        for (const path of [
          `${prefix}/`,
          `${prefix}/distros/`,
          `${prefix}/distros/linux-mint/`,
          `${prefix}/distros/vanilla-os/`,
        ]) {
          await navigate(path);
          await checkLayout();
          assert.equal(await evaluate('document.documentElement.lang'), locale);
          if (path === `${prefix}/`) {
            const buttonType = await evaluate(
              `(()=>{const a=document.querySelector('.hero .button');return{button:getComputedStyle(a).fontSize,label:getComputedStyle(a.querySelector('.link-text')).fontSize,arrow:getComputedStyle(a.querySelector('[aria-hidden="true"]')).fontSize};})()`,
            );
            assert.equal(buttonType.button, '16px');
            assert.equal(buttonType.label, buttonType.button);
            assert.equal(buttonType.arrow, '23px');
          }
          if (path.endsWith('/distros/')) {
            const directoryLink = await evaluate(
              `(()=>{const a=document.querySelector('.distro-directory h2 a');return{decoration:getComputedStyle(a).textDecorationLine,color:getComputedStyle(a).color,heading:getComputedStyle(a.parentElement).color,rect:a.getBoundingClientRect().toJSON()};})()`,
            );
            assert.equal(directoryLink.decoration, 'underline');
            assert.equal(directoryLink.color, directoryLink.heading);
            if (width === 1440) {
              await cdp('Input.dispatchMouseEvent', {
                type: 'mouseMoved',
                x: directoryLink.rect.x + 2,
                y: directoryLink.rect.y + 2,
              });
              assert.equal(
                await evaluate(
                  `getComputedStyle(document.querySelector('.distro-directory h2 a')).color`,
                ),
                directoryLink.color,
              );
              await cdp('Input.dispatchMouseEvent', {
                type: 'mouseMoved',
                x: 0,
                y: 0,
              });
            }
          }
          const headerLinks = await evaluate(
            `({supportInHeader:!!document.querySelector('header.site-header .project-support-link'),supportUnderlined:getComputedStyle(document.querySelector('.project-support-link')).textDecorationLine,githubInFooter:!!document.querySelector('footer > .footer-github')})`,
          );
          assert.equal(headerLinks.supportInHeader, true);
          assert.equal(headerLinks.supportUnderlined, 'none');
          assert.equal(headerLinks.githubInFooter, true);
          assert.equal(
            await evaluate(
              `getComputedStyle(document.querySelector('.project-support-link')).color === getComputedStyle(document.querySelector('.about-link')).color`,
            ),
            true,
          );
          if (width === 1440) {
            await checkLinkHover('.about-link');
            await checkLinkHover('.project-support-link');
            if (path === `${prefix}/`) {
              await evaluate(
                `document.querySelector('.directory-entry a').scrollIntoView({block:'center'})`,
              );
              await checkLinkHover('.directory-entry a');
              await evaluate('scrollTo(0,0)');
            }
          }
          if (path.includes('/distros/') && !path.endsWith('/distros/')) {
            const profileStyle = await evaluate(
              `(()=>{const art=document.querySelector('.distro-character'),title=document.querySelector('h1'),name=document.querySelector('.result-archetype'),desc=document.querySelector('.result-archetype-description'),summary=document.querySelector('.result-summary'),fill=document.querySelector('.result-artwork-fill');return{art:art.getBoundingClientRect().toJSON(),title:title.getBoundingClientRect().toJSON(),font:getComputedStyle(name).fontFamily,italic:getComputedStyle(name).fontStyle,fill:getComputedStyle(fill).floodColor,accent:getComputedStyle(name).color,opacity:Number(getComputedStyle(fill).floodOpacity),descriptionFirst:!!(desc.compareDocumentPosition(summary)&Node.DOCUMENT_POSITION_FOLLOWING),meters:document.querySelectorAll('[role="meter"]').length};})()`,
            );
            assert.match(profileStyle.font, /Georgia/);
            assert.equal(profileStyle.italic, 'italic');
            assert.equal(profileStyle.fill, profileStyle.accent);
            assert(profileStyle.opacity > 0 && profileStyle.opacity < 0.1);
            assert.equal(profileStyle.descriptionFirst, true);
            assert.equal(profileStyle.meters, 10);
            if (width <= 760) {
              assert(profileStyle.art.left > profileStyle.title.left);
              assert(
                Math.abs(profileStyle.art.top - profileStyle.title.top) < 1,
              );
              assert.equal(profileStyle.art.width, width <= 360 ? 112 : 144);
            }
          }
          await waitFor(
            `!!document.querySelector('.theme-toggle:not([hidden])')`,
          );
          const before = await evaluate(
            'document.documentElement.dataset.theme',
          );
          await evaluate(`document.querySelector('.theme-toggle').click()`);
          assert.notEqual(
            await evaluate('document.documentElement.dataset.theme'),
            before,
          );
          await evaluate(`localStorage.removeItem('distroquest-theme')`);
          if (path.endsWith('/distros/')) {
            assert.equal(
              await evaluate(
                `!!document.querySelector('main a.button.button-primary')`,
              ),
              true,
            );
          }
          await evaluate(
            `document.querySelector('.language-control summary').focus(); document.querySelector('.language-control summary').click()`,
          );
          await checkLayout();
          const links = await evaluate(
            `[...document.querySelectorAll('[data-language-link]')].map(a=>({href:a.getAttribute('href'),height:a.getBoundingClientRect().height}))`,
          );
          assert.equal(links.length, 4);
          assert(links.every((link) => link.height >= 44));
          await cdp('Input.dispatchKeyEvent', {
            type: 'keyDown',
            key: 'Escape',
            code: 'Escape',
            windowsVirtualKeyCode: 27,
          });
          await cdp('Input.dispatchKeyEvent', {
            type: 'keyUp',
            key: 'Escape',
            code: 'Escape',
            windowsVirtualKeyCode: 27,
          });
          assert.equal(
            await evaluate(`document.querySelector('.language-control').open`),
            false,
          );
          if (
            locale === 'en' &&
            [390, 1440].includes(width) &&
            theme === 'light'
          ) {
            const screenshot = await cdp('Page.captureScreenshot', {
              format: 'png',
              captureBeyondViewport: true,
            });
            await writeFile(
              join(artifacts, `${path.replaceAll('/', '_')}-${width}.png`),
              Buffer.from(screenshot.data, 'base64'),
            );
          }
        }
      }
  for (const locale of publishedLocales)
    for (const gpu of ['open-source', 'apple-silicon']) {
      const prefix = locale === 'en' ? '' : `/${locale}`;
      const answers =
        gpu === 'open-source'
          ? recommendationPersonas.beginner
          : { ...recommendationPersonas.beginner, gpu: ['apple-silicon'] };
      let expected = startQuiz();
      for (const question of questions) {
        for (const option of answers[question.id])
          expected = selectAnswer(expected, option);
        expected = nextQuestion(expected);
        if (expected.followup)
          expected = nextQuestion(selectAnswer(expected, 'm1-m2'));
      }
      const shortlist = platformShortlist(expected.platformResult);
      await navigate(`${prefix}/quiz/`, true);
      const cards = await evaluate(
        `(()=>{const answers=${JSON.stringify(answers)};let steps=0;while(!document.querySelector('.primary-result')&&steps++<20){const inputs=[...document.querySelectorAll('#quiz-root input')],name=inputs[0]?.name;for(const value of name==='apple-generation'?['m1-m2']:answers[name]){const input=inputs.find(i=>i.value===value);if(!input)throw Error('Missing option '+name+'/'+value);input.click();}document.querySelector('.question-actions .button-primary').click();}return[...document.querySelectorAll('[data-distro]')].map(card=>({id:card.dataset.distro,href:card.querySelector('.result-profile-link')?.getAttribute('href'),text:card.querySelector('.result-profile-link')?.textContent}));})()`,
      );
      assert.equal(cards[0].id, shortlist.primary.recommendation.distroId);
      const profileLinkStyle = await evaluate(
        `(()=>{const link=document.querySelector('.result-profile-link'),retake=document.querySelector('.quiz-actions .button-tertiary');return{color:getComputedStyle(link).color,retake:getComputedStyle(retake).color,underline:getComputedStyle(link).textDecorationLine};})()`,
      );
      assert.equal(profileLinkStyle.color, profileLinkStyle.retake);
      assert.equal(profileLinkStyle.underline, 'underline');
      await evaluate(
        `document.querySelector('.result-profile-link').scrollIntoView({block:'center'})`,
      );
      const profileLinkBox = await evaluate(
        `document.querySelector('.result-profile-link').getBoundingClientRect().toJSON()`,
      );
      await cdp('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: profileLinkBox.x + 2,
        y: profileLinkBox.y + 2,
      });
      assert.equal(
        await evaluate(
          `getComputedStyle(document.querySelector('.result-profile-link')).color === getComputedStyle(document.querySelector('#quiz-root')).color`,
        ),
        true,
      );
      await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
      await evaluate('scrollTo(0,0)');
      assert.equal(
        await evaluate(
          `getComputedStyle(document.querySelector('.project-support-link')).color === getComputedStyle(document.querySelector('.about-link')).color`,
        ),
        true,
      );
      for (const card of cards) {
        assert.equal(card.href, `${prefix}/distros/${card.id}/`);
        assert.equal(
          card.text,
          getMessages(locale).discovery.profileLink(
            getMessages(locale).distros[card.id].name,
          ),
        );
      }
      await checkLayout();
      summary.quizFlows++;
      await evaluate(
        `document.querySelector('[data-language-link]:not([aria-current])').click()`,
      );
      assert.equal(
        await evaluate(`document.querySelector('dialog').open`),
        true,
      );
      await cdp('Input.dispatchKeyEvent', {
        type: 'keyDown',
        key: 'Escape',
        code: 'Escape',
        windowsVirtualKeyCode: 27,
      });
      await cdp('Input.dispatchKeyEvent', {
        type: 'keyUp',
        key: 'Escape',
        code: 'Escape',
        windowsVirtualKeyCode: 27,
      });
      assert.equal(
        await evaluate(`document.querySelector('dialog').open`),
        false,
      );
      assert.equal(
        await evaluate(
          `document.querySelector('.primary-result').dataset.distro`,
        ),
        cards[0].id,
      );
    }
  // Saved theme must survive navigation to the directory, even against OS preference.
  await cdp('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-color-scheme', value: 'dark' }],
  });
  await navigate('/');
  await evaluate(`localStorage.setItem('distroquest-theme','light')`);
  await navigate('/distros/');
  assert.equal(
    await evaluate('document.documentElement.dataset.theme'),
    'light',
  );
  await evaluate(`document.querySelector('.theme-toggle').click()`);
  assert.equal(
    await evaluate('document.documentElement.dataset.theme'),
    'dark',
  );
  await navigate('/');
  assert.equal(
    await evaluate('document.documentElement.dataset.theme'),
    'dark',
  );
  await evaluate(`localStorage.removeItem('distroquest-theme')`);
  // Verify keyboard skip navigation on a representative informational page.
  await navigate('/distros/linux-mint/');
  await cdp('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Tab',
    code: 'Tab',
    windowsVirtualKeyCode: 9,
  });
  await cdp('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Tab',
    code: 'Tab',
    windowsVirtualKeyCode: 9,
  });
  assert.equal(await evaluate(`document.activeElement.className`), 'skip-link');
  assert.deepEqual(errors, []);
  console.log(
    `Browser checks passed: ${summary.layouts} layout checks, ${summary.quizFlows} quiz flows. Artifacts: ${artifacts}`,
  );
  if (process.argv.includes('--lighthouse')) {
    for (const device of ['mobile', 'desktop'])
      for (const path of ['/', '/distros/', '/distros/linux-mint/']) {
        const report = join(
          artifacts,
          `lighthouse-${device}-${path.replaceAll('/', '_')}.json`,
        );
        const args = [
          'exec',
          '--yes',
          '--cache',
          '/tmp/dq-m8-npm-cache',
          '--package=lighthouse',
          '--',
          'lighthouse',
          origin + path,
          `--port=${port}`,
          '--hostname=127.0.0.1',
          '--only-categories=performance,accessibility,best-practices,seo',
          '--output=json',
          `--output-path=${report}`,
          '--quiet',
          ...(device === 'desktop' ? ['--preset=desktop'] : []),
        ];
        const result = await new Promise((resolve, reject) => {
          const process = spawn('npm', args, {
            stdio: ['ignore', 'ignore', 'pipe'],
          });
          let error = '';
          process.stderr.on('data', (data) => (error += data));
          process.on('error', reject);
          process.on('exit', (code) => resolve({ code, error }));
        });
        if (result.code !== 0) throw Error(result.error);
        const data = JSON.parse(await readFile(report, 'utf8'));
        const findings = Object.values(data.audits)
          .filter(
            (a) =>
              a.score !== null &&
              a.score < 1 &&
              a.scoreDisplayMode !== 'notApplicable',
          )
          .map((a) => ({
            id: a.id,
            title: a.title,
            displayValue: a.displayValue,
            details: a.details,
          }));
        const item = {
          device,
          path,
          scores: Object.fromEntries(
            Object.entries(data.categories).map(([key, value]) => [
              key,
              Math.round(value.score * 100),
            ]),
          ),
          lcp: data.audits['largest-contentful-paint'].numericValue,
          cls: data.audits['cumulative-layout-shift'].numericValue,
          findings,
          report,
        };
        summary.lighthouse.push(item);
        console.log(
          JSON.stringify({ ...item, findings: findings.map((a) => a.id) }),
        );
      }
  }
  await writeFile(
    join(artifacts, 'summary.json'),
    JSON.stringify(summary, null, 2),
  );
} finally {
  ws?.close();
  browser.kill();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
