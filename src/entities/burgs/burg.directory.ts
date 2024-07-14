import { App } from "obsidian";
import { FMG } from "azgaar-fmg-parser";
import { ENTITY_DIRECTORIES } from "src/consts";
import { generateMarkdown } from "./burg.markdown";

type GenerateProps = {
  app: App;
  fmg: FMG;
};

export const generate = async ({ app, fmg }: GenerateProps) => {
  await app.vault.createFolder(ENTITY_DIRECTORIES.BURG);

  const burgsProvince = Object.values(fmg.provinces).reduce<
    Parameters<typeof generateMarkdown>[0]["burgsProvince"]
  >((burgsProvince, province) => {
    province.burgs?.forEach((burgID) => {
      burgsProvince[burgID] = province.i;
    });
    return burgsProvince;
  }, {});

  await Promise.all(
    Object.values(fmg.burgs).map((burg) =>
      app.vault.create(
        `${ENTITY_DIRECTORIES.BURG}/${burg.name}.md`,
        generateMarkdown({ fmg, burg, burgsProvince }),
      ),
    ),
  );
};
