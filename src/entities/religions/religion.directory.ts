import { App } from "obsidian";
import { FMG } from "azgaar-fmg-parser";
import { ENTITY_DIRECTORIES } from "src/consts";
import { generateMarkdown } from "./religion.markdown";

type GenerateProps = {
  app: App;
  fmg: FMG;
};

export const generate = async ({ app, fmg }: GenerateProps) => {
  await app.vault.createFolder(ENTITY_DIRECTORIES.RELIGION);

  await Promise.all(
    Object.values(fmg.religions).map((religion) =>
      app.vault.create(
        `${ENTITY_DIRECTORIES.RELIGION}/${religion.name}.md`,
        generateMarkdown({ fmg, religion }),
      ),
    ),
  );
};
