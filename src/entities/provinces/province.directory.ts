import { App } from "obsidian";
import { FMG } from "azgaar-fmg-parser";
import { ENTITY_DIRECTORIES } from "src/consts";
import { generateMarkdown } from "./province.markdown";

type GenerateProps = {
  app: App;
  fmg: FMG;
};

export const generate = async ({ app, fmg }: GenerateProps) => {
  await app.vault.createFolder(ENTITY_DIRECTORIES.PROVINCE);

  await Promise.all(
    Object.values(fmg.provinces).map((province) =>
      app.vault.create(
        `${ENTITY_DIRECTORIES.PROVINCE}/${province.name}.md`,
        generateMarkdown({ fmg, province }),
      ),
    ),
  );
};
