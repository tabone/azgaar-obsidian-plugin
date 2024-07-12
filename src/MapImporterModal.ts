import { App, Modal, Notice } from "obsidian";
import { FMG } from "azgaar-fmg-parser";
import {
  generateCultures,
  generateProvinces,
  generateReligions,
} from "./entities";

export class MapImporterModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: "Choose Map File" });
    const fileEl = contentEl.createEl("input", { type: "file" });
    const buttonEl = contentEl.createEl("button", { text: "Import" });

    buttonEl.addEventListener("click", async () => {
      const file = fileEl.files?.[0];

      if (!file) return;

      fileEl.disabled = true;
      buttonEl.disabled = true;

      const content = await file.text();

      const { fmg, info } = FMG.parse({ data: content });

      console.log(info, fmg);

      ["burgs", "states", "cultures", "provinces", "religions"].forEach(
        (entity) => {
          new Notice(
            `Parsed ${info[entity].stored} from ${info[entity].total} ${entity}`,
          );
        },
      );

      await Promise.all([
        generateCultures({
          fmg,
          app: this.app,
        }),

        generateProvinces({
          fmg,
          app: this.app,
        }),

        generateReligions({
          fmg,
          app: this.app,
        }),
      ]);

      this.close();
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
