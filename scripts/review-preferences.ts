import { readFileSync } from 'node:fs';
import { capabilityKeys } from '../src/domain/distro.ts';
import { questions } from '../src/data/questions.ts';
import { questionContentEn } from '../src/i18n/en/questions.ts';
import { buildPreferenceProfile } from '../src/preferences/profile.ts';
import { preferenceExamples } from './preference-examples.ts';

// Internal review text is not application UI copy.
try {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const fileIndex = args.indexOf('--answers');
  const allowed =
    fileIndex < 0 ? ['--json'] : ['--json', '--answers', args[fileIndex + 1]];
  if (
    args.some((arg) => !allowed.includes(arg)) ||
    args.filter((arg) => arg === '--answers').length > 1 ||
    (fileIndex >= 0 &&
      (!args[fileIndex + 1] || args[fileIndex + 1].startsWith('--')))
  )
    throw new Error(
      'Usage: npm run preferences:review -- [--json] [--answers path.json]',
    );
  if (fileIndex >= 0) {
    const answers: unknown = JSON.parse(
      readFileSync(args[fileIndex + 1], 'utf8'),
    );
    console.log(JSON.stringify(buildPreferenceProfile(answers), null, 2));
  } else if (json) {
    console.log(
      JSON.stringify(
        {
          questions: questions.map((question) => {
            const content = questionContentEn[question.id];
            return {
              ...question,
              prompt: content.prompt,
              helper: content.helper,
              options: question.options.map((option) => ({
                ...option,
                ...content.options[option.id],
              })),
            };
          }),
          examples: Object.fromEntries(
            Object.entries(preferenceExamples).map(([name, answers]) => [
              name,
              { answers, profile: buildPreferenceProfile(answers) },
            ]),
          ),
        },
        null,
        2,
      ),
    );
  } else {
    console.log(`Questionnaire: ${questions.length} questions\n`);
    for (const [index, question] of questions.entries()) {
      const content = questionContentEn[question.id];
      console.log(`${index + 1}. [${question.section}] ${content.prompt}`);
      if (content.helper) console.log(`   ${content.helper}`);
      for (const option of question.options) {
        const copy = content.options[option.id];
        console.log(
          `   ${option.emoji} ${copy.label}${copy.description ? ` ${copy.description}` : ''}`,
        );
      }
    }
    console.log('\nExample profiles (continuous targets, 0–5):');
    console.log(`| Example | ${capabilityKeys.join(' | ')} |`);
    console.log(`| :--- | ${capabilityKeys.map(() => '---:').join(' | ')} |`);
    for (const [name, answers] of Object.entries(preferenceExamples)) {
      const profile = buildPreferenceProfile(answers);
      console.log(
        `| ${name} | ${capabilityKeys.map((key) => profile.targets[key].toFixed(2)).join(' | ')} |`,
      );
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
