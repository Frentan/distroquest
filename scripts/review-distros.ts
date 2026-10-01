import { capabilityKeys } from '../src/domain/distro.ts';
import { getDistros, distroProfiles } from '../src/data/index.ts';
import { validateDataset } from '../src/data/validate.ts';
import { distroContentEn } from '../src/i18n/en/distros.ts';

const errors = validateDataset(distroProfiles, distroContentEn);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
const distros = getDistros(distroContentEn);
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(distros, null, 2));
} else {
  console.log(
    'BF beginnerFriendly · LM lowMaintenance · ST stability · FR freshness · CU customization · SC systemControl · GA gaming · DX developerExperience · OH oldHardware · DP desktopPolish · BR breadth',
  );
  console.log(
    '\n| Distro | BF | LM | ST | FR | CU | SC | GA | DX | OH | DP | BR |',
  );
  console.log(
    '| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
  );
  for (const distro of distros) {
    const values = capabilityKeys.map((key) => distro.capabilities[key]);
    console.log(
      `| ${distro.name} | ${values.join(' | ')} | ${distro.recommendation.breadth} |`,
    );
  }
}
