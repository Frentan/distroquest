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
import type {
  Recommendation,
  CapabilityMatch,
} from '../domain/recommendations.ts';
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
import { questionJourney, arrivalJourney } from './journey.ts';

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
  const submitted = new Set<string>();
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
        submitted.clear();
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
    if (!hasValidAnswer(state)) return;
    submitted.add(
      state.followup ? 'mac-followup' : questions[state.current].id,
    );
    state = nextQuestion(
      state,
      undefined,
      import.meta.env.DEV
        ? (error) => console.error('DistroQuest computation failed', error)
        : undefined,
    );
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
  function capabilityStats(
    candidate: PlatformCandidate,
    matches: readonly CapabilityMatch[],
    relevant = false,
  ) {
    const id = `${candidate.recommendation.distroId}-${relevant ? 'priorities' : 'full'}`;
    const stats = element('section', undefined, 'capability-stats');
    if (!relevant) stats.setAttribute('aria-label', copy.stats);
    const bars = element('div', undefined, 'capability-grid');
    for (const match of matches) {
      const stat = element('div', undefined, 'capability-stat');
      const label = element('span', capabilityLabels[match.capability]);
      label.id = `stat-${id}-${match.capability}`;
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
        const block = element(
          'span',
          undefined,
          segment < match.actual * 2 ? 'filled' : undefined,
        );
        block.setAttribute('aria-hidden', 'true');
        meter.append(block);
      }
      stat.append(label, value, meter);
      bars.append(stat);
    }
    if (relevant) {
      const heading = element('h2', copy.relevantStats);
      heading.id = `stats-${id}`;
      stats.setAttribute('aria-labelledby', heading.id);
      stats.append(
        heading,
        element(
          'p',
          candidate.variant ? copy.variantStatsNote : copy.statsNote,
          'result-note',
        ),
      );
    }
    stats.append(bars);
    return stats;
  }
  function recommendationCard(
    candidate: PlatformCandidate,
    primary: boolean,
    main?: Recommendation,
    showFit = true,
  ) {
    const row = candidate.recommendation;
    const isVariant =
      candidate.variant && candidate.support === 'supported-with-special-path';
    const distro = distros.find((d) => d.id === row.distroId)!;
    const card = element(
      'article',
      undefined,
      primary ? 'primary-result' : 'alternative-result',
    );
    card.dataset.distro = distro.id;
    const identity = element('div', undefined, 'result-identity');
    const heading = element(
      primary ? 'h1' : 'h3',
      isVariant
        ? platformCopy.asahiName(candidate.variant!.edition)
        : distro.name,
    );
    if (primary) {
      heading.id = 'quest-heading';
      heading.tabIndex = -1;
      identity.append(
        element(
          'p',
          state.platformResult!.practical.length
            ? copy.path
            : platformCopy.preferencePath,
          'eyebrow',
        ),
      );
    }
    const flavor = element('p', undefined, 'result-archetype-description');
    flavor.append(element('em', distro.archetype.description));
    identity.append(
      heading,
      element('p', distro.archetype.name, 'result-archetype'),
      flavor,
      element(
        'p',
        isVariant ? platformCopy.asahiSummary : distro.summary,
        'result-summary',
      ),
    );
    if (showFit)
      identity.append(element('p', copy.match(percentMatch(row)), 'fit-label'));
    if (distro.editionNote)
      identity.append(element('p', distro.editionNote, 'result-note'));
    const intro = element('div', undefined, 'result-intro');
    intro.append(identity);
    if (primary) {
      // Replace this single slot with supplied artwork; :empty collapses it safely.
      const artwork = element('div', copy.artPlaceholder, 'result-artwork');
      artwork.dataset.artwork = distro.id;
      intro.append(artwork);
    }
    card.append(intro);
    if (primary || candidate.variant)
      card.append(
        element(
          'p',
          candidate.variant
            ? platformCopy.baseMatch(distro.name)
            : copy.matchNote,
          'result-note',
        ),
      );
    const criticalPlatform =
      candidate.support !== 'native' ||
      state.platformResult!.platform !== 'x86-standard';
    const supportedPath =
      candidate.support === 'native' ||
      candidate.support === 'supported-with-special-path';
    if (primary && criticalPlatform)
      card.append(platformNotice(candidate, supportedPath ? 'brief' : 'full'));
    const deviceWarnings = row.cautions
      .filter(
        (code) => code.startsWith('nvidia.') || code.startsWith('handheld.'),
      )
      .map(explainCaution)
      .filter((text): text is string => !!text);
    if (deviceWarnings.length) {
      const warnings = element('ul', undefined, 'compatibility-warnings');
      deviceWarnings.forEach((warning) =>
        warnings.append(element('li', warning)),
      );
      card.append(warnings);
    }
    if (primary) card.append(element('h2', copy.why));
    const reasonTopic = (code: string) =>
      code.startsWith('capability.')
        ? code.split('.').slice(0, 2).join('.')
        : code;
    const primaryReasons = new Set(
      main ? strongestReasons(main).map(reasonTopic) : [],
    );
    const reasons = strongestReasons(row)
      .filter((code) => primary || !primaryReasons.has(reasonTopic(code)))
      .map(explainReason)
      .filter((text): text is string => !!text);
    if (reasons.length) {
      const list = element('ul', undefined, 'result-reasons');
      for (const reason of reasons.slice(0, primary ? 4 : 2))
        list.append(element('li', reason));
      card.append(list);
    } else if (primary) card.append(element('p', copy.resultFallback));
    if (!primary && main) {
      const mainDistro = distros.find((d) => d.id === main.distroId)!;
      const traits = element(
        'p',
        `${copy.workflow[row.workflow]} · ${copy.release[distro.traits.release]}`,
        'result-traits',
      );
      card.append(traits);
      const differences = [...row.capabilityMatches]
        .filter(
          (match) =>
            match.weight > 0 &&
            match.actual !==
              main.capabilityMatches.find(
                (m) => m.capability === match.capability,
              )!.actual,
        )
        .sort((a, b) => {
          const delta = (match: CapabilityMatch) =>
            Math.abs(
              match.actual -
                main.capabilityMatches.find(
                  (m) => m.capability === match.capability,
                )!.actual,
            ) * match.weight;
          return delta(b) - delta(a);
        })
        .slice(0, 2);
      if (differences.length) {
        const comparison = element('div', undefined, 'result-comparison');
        comparison.append(
          element('p', copy.comparedWith(mainDistro.name), 'quiz-helper'),
        );
        const list = element('ul', undefined, 'result-reasons');
        differences.forEach((match) =>
          list.append(
            element(
              'li',
              copy.capabilityComparison(
                capabilityLabels[match.capability],
                match.actual,
                main.capabilityMatches.find(
                  (m) => m.capability === match.capability,
                )!.actual,
                mainDistro.name,
              ),
            ),
          ),
        );
        comparison.append(list);
        card.append(comparison);
      }
    }
    const warnings = [
      ...new Set([
        ...row.cautions
          .map(explainCaution)
          .filter((text): text is string => !!text),
        ...distro.cautions.slice(0, primary ? 2 : 1),
      ]),
    ].filter((warning) => !deviceWarnings.includes(warning));
    // Visible device warnings and the alternative preview have one home.
    const preview = !primary
      ? (warnings.find((warning) => warning === distro.cautions[0]) ??
        warnings[0])
      : undefined;
    if (preview) card.append(element('p', preview, 'result-note'));
    const additionalWarnings = warnings.filter(
      (warning) => warning !== preview,
    );
    if (additionalWarnings.length) {
      const cautionList = element('ul', undefined, 'result-cautions');
      additionalWarnings.forEach((warning) =>
        cautionList.append(element('li', warning)),
      );
      const details = element(
        'details',
        undefined,
        primary
          ? 'alternative-details result-tradeoffs'
          : 'alternative-details',
      );
      details.append(
        element('summary', primary ? copy.tradeoffs : copy.alternativeDetails),
        cautionList,
      );
      card.append(details);
    }
    if (primary && criticalPlatform && supportedPath) {
      const guidance = element('details', undefined, 'alternative-details');
      guidance.append(
        element('summary', copy.installationGuidance),
        platformNotice(candidate, 'guidance'),
      );
      card.append(guidance);
    }
    if (primary && !criticalPlatform) {
      const hardware = element('details', undefined, 'alternative-details');
      hardware.append(
        element('summary', platformCopy.standardInstallation),
        platformNotice(candidate),
      );
      card.append(hardware);
    } else if (!primary) {
      if (
        candidate.url &&
        (candidate.support === 'native' ||
          candidate.support === 'supported-with-special-path')
      )
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
    if (primary) {
      const priorities = [...row.capabilityMatches]
        .filter((match) => match.weight > 0 && match.target > 0)
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 4);
      if (priorities.length)
        card.append(capabilityStats(candidate, priorities, true));
    }
    const stats = element(
      'details',
      undefined,
      'alternative-details full-profile',
    );
    stats.append(
      element('summary', copy.stats),
      capabilityStats(candidate, row.capabilityMatches),
    );
    card.append(stats);
    return card;
  }
  function supportLink(url: string, text: string) {
    const link = element('a', text, 'support-link');
    link.href = url;
    return link;
  }
  function platformNotice(
    candidate: PlatformCandidate,
    mode: 'full' | 'brief' | 'guidance' = 'full',
  ) {
    const result = state.platformResult!;
    const notice = element('aside', undefined, 'platform-notice');
    notice.setAttribute('aria-label', platformCopy.title);
    if (mode !== 'guidance')
      notice.append(
        element('p', platformCopy.title, 'eyebrow'),
        element('p', platformCopy.notes[result.platform]),
      );
    const original = distros.find(
      (d) => d.id === result.preferenceWinner.distroId,
    )!;
    if (
      mode !== 'guidance' &&
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
    if (mode === 'brief') return notice;
    if (
      candidate.variant &&
      candidate.support === 'supported-with-special-path'
    ) {
      notice.append(element('p', platformCopy.asahiIntro));
    } else if (mode === 'guidance')
      notice.append(element('p', platformCopy.effort[candidate.installation]));
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
    panel.append(arrivalJourney(), recommendationCard(primary, true));
    const actions = element('div', undefined, 'quiz-actions');
    actions.append(
      button(copy.revise, () => navigate(0), true),
      Object.assign(button(copy.retake, restart), {
        className: 'button button-tertiary',
      }),
    );
    panel.append(actions);
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
      );
      const edition = element('details', undefined, 'edition-details');
      const name =
        sameEdition.variant && !preferenceOnly
          ? platformCopy.asahiName(sameEdition.variant.edition)
          : distros.find((d) => d.id === sameEdition.recommendation.distroId)!
              .name;
      edition.append(
        element(
          'summary',
          `${name} · ${copy.match(percentMatch(sameEdition.recommendation))}`,
        ),
        recommendationCard(sameEdition, false, primary.recommendation, false),
      );
      editions.append(edition);
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
        const card = recommendationCard(
          alternative,
          false,
          primary.recommendation,
        );
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
    panel.append(
      questionJourney(
        position.current,
        position.total,
        submitted.size,
        !state.followup && state.current === questions.length - 1,
      ),
    );
    const progressHeader = element('div', undefined, 'quest-progress');
    const progressInfo = element('div', undefined, 'progress-info');
    const progressLabel = element(
      'p',
      copy.progress(position.current, position.total),
      'eyebrow',
    );
    const progressCount = element('p', undefined, 'progress-count');
    const progress = element('progress');
    progress.setAttribute('aria-label', copy.progressLabel);
    progressInfo.append(progressLabel, progressCount, progress);
    progressHeader.append(progressInfo);
    panel.append(progressHeader);
    const branchNote = element('p', copy.macStep, 'result-note');
    panel.append(branchNote);
    function updateProgress() {
      const pos = getQuizProgress(state);
      const count = submitted.size;
      progress.max = pos.total;
      progress.value = count;
      progress.setAttribute('aria-valuetext', copy.submitted(count, pos.total));
      progressCount.textContent = copy.submitted(count, pos.total);
      progressLabel.textContent = copy.progress(pos.current, pos.total);
      branchNote.hidden = pos.total === questions.length;
    }
    updateProgress();
    panel.append(title(content.prompt));
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
      const label = element('label', undefined, 'answer-choice');
      label.dataset.option = option.id;
      const input = element('input');
      input.type = question.selection === 'single' ? 'radio' : 'checkbox';
      input.name = question.id;
      input.value = option.id;
      input.checked = selected.includes(option.id);
      label.append(input, emoji, labelContent);
      input.addEventListener('change', () => {
        submitted.delete(state.followup ? 'mac-followup' : baseQuestion.id);
        if (baseQuestion.id === 'gpu' && !state.followup)
          submitted.delete('mac-followup');
        state = selectAnswer(state, option.id);
        updateChecks();
        updateProgress();
        next.disabled = !hasValidAnswer(state);
      });
      options.append(label);
    }
    const selectionStatus = element('p', undefined, 'selection-status');
    selectionStatus.id = 'selection-status';
    selectionStatus.setAttribute('role', 'status');
    selectionStatus.setAttribute('aria-live', 'polite');
    selectionStatus.setAttribute('aria-atomic', 'true');
    if (question.selection === 'multiple') {
      panel.append(selectionStatus);
      options.setAttribute(
        'aria-describedby',
        `${hint.id} ${selectionStatus.id}`,
      );
    }
    function updateChecks() {
      const checked = state.followup
        ? state.platformAnswer
          ? [state.platformAnswer]
          : []
        : (state.answers[baseQuestion.id] ?? []);
      const limit =
        question.selection === 'multiple' &&
        checked.length >= question.maxSelections;
      selectionStatus.textContent = `${copy.selectionCount(checked.length, question.maxSelections)}${limit ? `. ${copy.selectionLimit}` : ''}`;
      selectionStatus.classList.toggle('at-limit', limit);
      for (const input of options.querySelectorAll<HTMLInputElement>('input')) {
        input.checked = checked.includes(input.value);
        input.disabled = limit && !input.checked;
      }
    }
    updateChecks();
    panel.append(options);
    const actions = element('div', undefined, 'quiz-actions question-actions');
    if (state.current > 0)
      actions.append(
        button(copy.back, () => {
          state = previousQuestion(state);
          render();
        }),
      );
    actions.append(next);
    const restartButton = button(copy.restart, restart);
    restartButton.classList.add('button-tertiary');
    actions.append(restartButton);
    panel.append(actions);
    if (state.error) {
      const error = element('p', copy.error, 'quiz-error');
      error.setAttribute('role', 'alert');
      panel.append(error);
    }
  }
  function render(focus = true) {
    panel.replaceChildren();
    panel.classList.toggle('showing-results', state.completed);
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
    if (focus) {
      panel
        .querySelector<HTMLElement>('#quest-heading')
        ?.focus({ preventScroll: true });
      root.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const target = state.completed
        ? panel.querySelector('.result-intro')
        : panel.querySelector('.quiz-title');
      target?.animate(
        [
          { opacity: 0, transform: `translateY(${state.completed ? 8 : 4}px)` },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: state.completed ? 240 : 140, easing: 'ease-out' },
      );
    }
  }
  render(false);
}
