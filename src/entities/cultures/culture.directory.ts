import { App } from "obsidian";
import { FMG } from "azgaar-fmg-parser";
import { ENTITY_DIRECTORIES } from "src/consts";
import { generateMarkdown } from "./culture.markdown";

type GenerateProps = {
  app: App;
  fmg: FMG;
};

export const generate = async ({ app, fmg }: GenerateProps) => {
  await app.vault.createFolder(ENTITY_DIRECTORIES.CULTURE);

  await Promise.all(
    Object.values(fmg.cultures).map((culture) =>
      app.vault.create(
        `${ENTITY_DIRECTORIES.CULTURE}/${culture.name}.md`,
        generateMarkdown({ fmg, culture }),
      ),
    ),
  );
};
