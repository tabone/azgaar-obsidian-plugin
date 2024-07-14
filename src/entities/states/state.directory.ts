import { App } from "obsidian";
import { FMG } from "azgaar-fmg-parser";
import { ENTITY_DIRECTORIES } from "src/consts";
import { generateMarkdown } from "./state.markdown";

type GenerateProps = {
  app: App;
  fmg: FMG;
};

export const generate = async ({ app, fmg }: GenerateProps) => {
  await app.vault.createFolder(ENTITY_DIRECTORIES.STATE);

  await Promise.all(
    Object.values(fmg.states).map((state) =>
      app.vault.create(
        `${ENTITY_DIRECTORIES.STATE}/${state.name}.md`,
        generateMarkdown({ fmg, state }),
      ),
    ),
  );
};
