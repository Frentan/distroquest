import { questions } from '../data/questions.ts';
import { getDistros } from '../data/index.ts';
import { en } from '../i18n/en.ts';
import {
  quizCopy as copy,
  explainReason,
  explainCaution,
  capabilityLabels,
  preparationCopy,
} from '../i18n/en/quiz.ts';
import type { PlatformCandidate } from '../domain/platform.ts';
import { platformCopy, platformQuestions } from '../i18n/en/platforms.ts';
import { platformSources } from '../data/platforms.ts';
import { getPlatformFollowup } from '../platforms/compatibility.ts';
import {
  startQuiz,
  hasValidAnswer,
  selectAnswer,
  goToQuestion,
  nextQuestion,
  previousQuestion,
  getQuizProgress,
} from './state.ts';
import {
  percentMatch,
  preparationTopics,
  strongestReasons,
} from './presentation.ts';
import { platformShortlist } from './platform-presentation.ts';

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function button(text: string, action: () => void, primary = false) {
  const node = element(
    'button',
    text,
    `button${primary ? ' button-primary' : ''}`,
  );
  node.type = 'button';
  node.addEventListener('click', action);
  return node;
}
export function mountQuiz(root: HTMLElement) {
  let state = startQuiz();
  const distros = getDistros(en.distros);
  const panel = element('div', undefined, 'quiz-panel');
  const restartDialog = element('dialog', undefined, 'restart-dialog');
  restartDialog.setAttribute('aria-labelledby', 'restart-title');
  restartDialog.append(element('h2', copy.restartPrompt));
  restartDialog.firstElementChild!.id = 'restart-title';
  const dialogActions = element('div', undefined, 'quiz-actions');
  const cancel = button(copy.cancel, () => restartDialog.close());
  dialogActions.append(
    cancel,
    button(
      copy.confirmRestart,
      () => {
        restartDialog.close();
        state = startQuiz();
        render();
      },
      true,
    ),
  );
  restartDialog.append(dialogActions);
  root.replaceChildren(panel, restartDialog);
  function restart() {
    restartDialog.showModal();
    cancel.focus();
  }
  function advance() {
    state = nextQuestion(state);
    render();
  }
  function navigate(index: number) {
    state = goToQuestion(state, index);
    render();
  }
  function title(text: string) {
    const heading = element('h1', text, 'quiz-title');
    heading.id = 'quest-heading';
    heading.tabIndex = -1;
    return heading;
  }
  function recommendationCard(candidate: PlatformCandidate, primary: boolean) {
    const row = candidate.recommendation;
    const platformResult = state.platformResult!;
    const isVariant =
      candidate.variant && candidate.support === 'supported-with-special-path';
    const preferenceOnly = platformResult.practical.length === 0;
    const distro = distros.find((d) => d.id === row.distroId)!;
    const card = element(
      'article',
      undefined,
      primary ? 'primary-result' : 'alternative-result',
    );
    card.dataset.distro = distro.id;
    card.append(
      element(
        primary ? 'h1' : 'h3',
        isVariant
          ? platformCopy.asahiName(candidate.variant!.edition)
          : distro.name,
      ),
      element('p', distro.archetype.name, 'eyebrow'),
      element('p', isVariant ? platformCopy.asahiSummary : distro.summary),
    );
    if (primary) {
      const heading = card.querySelector('h1')!;
      heading.id = 'quest-heading';
      heading.tabIndex = -1;
      card.prepend(
        element(
          'p',
          preferenceOnly ? platformCopy.preferencePath : copy.path,
          'eyebrow',
        ),
      );
      card.append(element('p', copy.match(percentMatch(row)), 'fit-label'));
      card.append(platformNotice(candidate));
    }
    if (!primary) {
      card.append(element('p', copy.match(percentMatch(row)), 'fit-label'));
      card.append(
        element('p', platformCopy.statuses[candidate.support], 'quiz-helper'),
      );
      if (
        candidate.url &&
        (candidate.support === 'native' ||
          candidate.support === 'supported-with-special-path')
      ) {
        card.append(
          element(
            'p',
            candidate.variant
              ? platformCopy.asahiInstall
              : platformCopy.effort[candidate.installation],
            'quiz-helper',
          ),
          supportLink(candidate.url, platformCopy.install),
        );
      }
    }
    const stats = element('section', undefined, 'capability-stats');
    const statsTitle = element(primary ? 'h2' : 'h4', copy.stats);
    statsTitle.id = `stats-${distro.id}`;
    stats.setAttribute('aria-labelledby', statsTitle.id);
    const bars = element('div', undefined, 'capability-grid');
    for (const match of row.capabilityMatches) {
      const stat = element('div', undefined, 'capability-stat');
      const label = element('span', capabilityLabels[match.capability]);
      label.id = `stat-${distro.id}-${match.capability}`;
      const value = element('span', `${match.actual}/5`, 'capability-value');
      value.setAttribute('aria-hidden', 'true');
      const meter = element('div', undefined, 'capability-bar');
      meter.setAttribute('role', 'meter');
      meter.setAttribute('aria-labelledby', label.id);
      meter.setAttribute('aria-valuemin', '0');
      meter.setAttribute('aria-valuemax', '5');
      meter.setAttribute('aria-valuenow', String(match.actual));
      meter.setAttribute('aria-valuetext', copy.statValue(match.actual));
      for (let segment = 0; segment < 10; segment++) {
        const block = element('span');
        block.className = segment < match.actual * 2 ? 'filled' : '';
        block.setAttribute('aria-hidden', 'true');
        meter.append(block);
      }
      stat.append(label, value, meter);
      bars.append(stat);
    }
    stats.append(statsTitle);
    if (candidate.variant)
      stats.append(element('p', copy.variantStatsNote, 'result-note'));
    stats.append(bars);
    if (primary) card.append(stats, element('h2', copy.why));
    else {
      const details = element('details', undefined, 'alternative-details');
      details.append(element('summary', copy.stats), stats);
      card.append(details);
    }
    const reasons = strongestReasons(row)
      .map(explainReason)
      .filter((text): text is string => !!text);
    const list = element('ul', undefined, 'result-reasons');
    for (const reason of reasons.slice(0, primary ? 5 : 2))
      list.append(element('li', reason));
    if (reasons.length) card.append(list);
    else card.append(element('p', copy.resultFallback));
    // Keep every translated engine caution, including device-specific warnings.
    const warnings = [
      ...new Set([
        ...row.cautions
          .map(explainCaution)
          .filter((text): text is string => !!text),
        ...distro.cautions.slice(0, primary ? 2 : 1),
      ]),
    ];
    const cautionList = element('ul', undefined, 'result-cautions');
    warnings.forEach((warning) => cautionList.append(element('li', warning)));
    const details = element('details', undefined, 'alternative-details');
    details.append(
      element('summary', primary ? copy.tradeoffs : copy.alternativeDetails),
      cautionList,
    );
    card.append(details);
    return card;
  }
  function supportLink(url: string, text: string) {
    const link = element('a', text, 'support-link');
    link.href = url;
    return link;
  }
  function platformNotice(candidate: PlatformCandidate) {
    const result = state.platformResult!;
    const notice = element('aside', undefined, 'platform-notice');
    notice.setAttribute('aria-label', platformCopy.title);
    notice.append(
      element('p', platformCopy.title, 'eyebrow'),
      element('p', platformCopy.statuses[candidate.support]),
      element('p', platformCopy.notes[result.platform]),
    );
    const original = distros.find(
      (d) => d.id === result.preferenceWinner.distroId,
    )!;
    if (
      result.practical.length &&
      candidate.recommendation.distroId !== original.id
    ) {
      notice.append(
        element(
          'p',
          result.platform === 'intel-mac-t2'
            ? platformCopy.originalFit(original.name)
            : platformCopy.originalWinner(original.name),
        ),
      );
    }
    if (
      candidate.variant &&
      candidate.support === 'supported-with-special-path'
    ) {
      const base = distros.find(
        (d) => d.id === candidate.variant!.baseDistroId,
      )!;
      notice.append(
        element('p', platformCopy.asahiIntro),
        element('p', platformCopy.baseMatch(base.name), 'quiz-helper'),
      );
    }
    if (candidate.url)
      notice.append(
        supportLink(
          candidate.url,
          result.platform === 'intel-mac-unknown-t2'
            ? platformCopy.identifyT2
            : candidate.installation === 'guided' ||
                candidate.installation === 'manual'
              ? platformCopy.install
              : platformCopy.supportGuide,
        ),
      );
    else if (result.platform.startsWith('apple-silicon')) {
      const url =
        result.platform === 'apple-silicon-m3'
          ? platformSources.m3
          : result.platform === 'apple-silicon-m4-plus'
            ? platformSources.m4
            : platformSources.appleChip;
      notice.append(
        supportLink(
          url,
          result.platform === 'apple-silicon-unknown'
            ? platformCopy.identifyChip
            : platformCopy.supportGuide,
        ),
      );
    }
    return notice;
  }
  function renderResults() {
    const result = state.platformResult!;
    const { primary, sameEdition, alternatives, comparisons, preferenceOnly } =
      platformShortlist(result);
    panel.append(recommendationCard(primary, true));
    const actions = element('div', undefined, 'quiz-actions');
    actions.append(
      button(copy.revise, () => navigate(0), true),
      button(copy.retake, restart),
    );
    panel.append(actions);
    panel.append(element('p', copy.matchNote, 'result-note'));
    const topics = preparationTopics(state.result!);
    if (topics.length) {
      const preparation = element('section', undefined, 'result-preparation');
      preparation.append(element('h2', copy.preparation));
      const list = element('ul', undefined, 'result-reasons');
      for (const topic of topics)
        list.append(element('li', preparationCopy[topic]));
      preparation.append(list);
      panel.append(preparation);
    }
    if (sameEdition) {
      const editions = element('section', undefined, 'result-section');
      editions.append(
        element(
          'h2',
          primary.variant && !preferenceOnly
            ? platformCopy.edition
            : copy.edition,
        ),
        recommendationCard(sameEdition, false),
      );
      panel.append(editions);
    }
    function alternativeSection(
      rows: readonly PlatformCandidate[],
      comparison: boolean,
    ) {
      if (!rows.length) return;
      const section = element('section', undefined, 'result-section');
      section.append(
        element(
          'h2',
          comparison || preferenceOnly
            ? platformCopy.preferenceAlternatives
            : result.platform === 'intel-mac-t2'
              ? platformCopy.alternatives
              : copy.alternatives,
        ),
      );
      if (
        comparison ||
        (preferenceOnly && result.platform.startsWith('apple-silicon'))
      )
        section.append(
          element('p', platformCopy.preferenceOnly, 'quiz-helper'),
        );
      const cards = element('div', undefined, 'alternative-grid');
      for (const alternative of rows) {
        const card = recommendationCard(alternative, false);
        if (alternative.recommendation.family === primary.recommendation.family)
          card.append(element('p', copy.sameFamily, 'quiz-helper'));
        cards.append(card);
      }
      section.append(cards);
      panel.append(section);
    }
    alternativeSection(alternatives, false);
    alternativeSection(comparisons, true);
    if (import.meta.env.DEV)
      console.debug('DistroQuest ranking', state.result, result);
  }
  function renderQuestion() {
    const baseQuestion = questions[state.current];
    const followup = state.followup
      ? getPlatformFollowup(state.answers)
      : undefined;
    const question = followup
      ? { ...followup, selection: 'single' as const, maxSelections: 1 }
      : baseQuestion;
    const content = followup
      ? platformQuestions[followup.id]
      : en.questions[baseQuestion.id];
    const position = getQuizProgress(state);
    const progressText = copy.progress(position.current, position.total);
    const progress = element('progress');
    progress.max = position.total;
    progress.value = position.current;
    progress.setAttribute('aria-label', copy.progressLabel);
    progress.setAttribute('aria-valuetext', progressText);
    const progressLabel = element('p', progressText, 'eyebrow');
    panel.append(progressLabel, progress, title(content.prompt));
    function updateProgress() {
      const nextPosition = getQuizProgress(state);
      const text = copy.progress(nextPosition.current, nextPosition.total);
      progress.max = nextPosition.total;
      progress.value = nextPosition.current;
      progress.setAttribute('aria-valuetext', text);
      progressLabel.textContent = text;
    }
    if (content.helper)
      panel.append(element('p', content.helper, 'quiz-helper'));
    if (followup)
      panel.append(
        supportLink(
          followup.id === 'intel-t2'
            ? platformSources.t2Chip
            : platformSources.appleChip,
          followup.id === 'intel-t2'
            ? platformCopy.identifyT2
            : platformCopy.identifyChip,
        ),
      );
    const hint = element(
      'p',
      question.selection === 'multiple'
        ? copy.multipleHint(question.maxSelections)
        : state.current === questions.length - 1
          ? copy.finalHint
          : copy.singleHint,
      'quiz-helper quiz-hint',
    );
    hint.id = 'question-hint';
    panel.append(hint);
    const options = element('div', undefined, 'quiz-options');
    options.setAttribute('role', 'group');
    options.setAttribute('aria-labelledby', 'quest-heading');
    options.setAttribute('aria-describedby', hint.id);
    const selected = followup
      ? state.platformAnswer
        ? [state.platformAnswer]
        : []
      : (state.answers[baseQuestion.id] ?? []);
    const next = button(
      state.error
        ? copy.retry
        : state.current === questions.length - 1
          ? copy.finish
          : copy.next,
      advance,
      true,
    );
    next.disabled = !hasValidAnswer(state);
    for (const option of question.options) {
      const optionCopy = content.options[option.id];
      const labelContent = element('span', undefined, 'answer-content');
      labelContent.append(element('span', optionCopy.label, 'answer-label'));
      if (optionCopy.description)
        labelContent.append(
          element('span', optionCopy.description, 'answer-description'),
        );
      const emoji = element('span', option.emoji, 'answer-emoji');
      emoji.setAttribute('aria-hidden', 'true');
      if (question.selection === 'single') {
        const choice = button('', () => {
          state = selectAnswer(state, option.id);
          updateProgress();
          for (const other of options.querySelectorAll<HTMLButtonElement>(
            '.answer-choice',
          )) {
            const active = other.dataset.option === option.id;
            other.setAttribute('aria-pressed', String(active));
            other.querySelector('.answer-mark')!.textContent = active
              ? '✓'
              : '○';
          }
          next.disabled = !hasValidAnswer(state);
        });
        choice.className = 'answer-choice';
        choice.dataset.option = option.id;
        choice.setAttribute(
          'aria-pressed',
          String(selected.includes(option.id)),
        );
        const mark = element(
          'span',
          selected.includes(option.id) ? '✓' : '○',
          'answer-mark',
        );
        mark.setAttribute('aria-hidden', 'true');
        choice.append(emoji, labelContent, mark);
        options.append(choice);
      } else {
        const label = element('label', undefined, 'answer-choice');
        const checkbox = element('input');
        checkbox.type = 'checkbox';
        checkbox.value = option.id;
        checkbox.checked = selected.includes(option.id);
        label.append(checkbox, emoji, labelContent);
        checkbox.addEventListener('change', () => {
          state = selectAnswer(state, option.id);
          updateChecks();
          next.disabled = !hasValidAnswer(state);
        });
        options.append(label);
      }
    }
    function updateChecks() {
      const checked = state.answers[baseQuestion.id] ?? [];
      for (const input of options.querySelectorAll<HTMLInputElement>('input')) {
        input.checked = checked.includes(input.value);
        input.disabled =
          !input.checked && checked.length >= question.maxSelections;
      }
    }
    updateChecks();
    panel.append(options);
    const actions = element('div', undefined, 'quiz-actions');
    if (state.current > 0)
      actions.append(
        button(copy.back, () => {
          state = previousQuestion(state);
          render();
        }),
      );
    actions.append(next);
    actions.append(button(copy.restart, restart));
    panel.append(actions);
    if (state.error) {
      const error = element('p', copy.error, 'quiz-error');
      error.setAttribute('role', 'alert');
      panel.append(error);
    }
  }
  function render(focus = true) {
    panel.replaceChildren();
    if (import.meta.env.DEV) {
      Object.assign(window, {
        distroquestDebug: {
          answers: state.answers,
          platformAnswer: state.platformAnswer,
          result: state.result,
          platformResult: state.platformResult,
        },
      });
    }
    if (state.completed) renderResults();
    else renderQuestion();
    if (focus) panel.querySelector<HTMLElement>('#quest-heading')?.focus();
  }
  render(false);
}
