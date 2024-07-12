import { FMG } from "azgaar-fmg-parser";
import { App, Modal } from "obsidian";
import {
  generateCultureMD,
  generateProvinceMD,
  generateReligionMD,
} from "./templates";

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

      console.log(info);

      await Promise.all([
        // this.app.vault.createFolder("./Burgs"),
        // this.app.vault.createFolder("./States"),
        this.app.vault.createFolder("./Cultures"),
        this.app.vault.createFolder("./Provinces"),
        this.app.vault.createFolder("./Religions"),
      ]);

      // await Promise.all(
      // 	Object.values(fmg.burgs).map((burg) =>
      // 		this.app.vault.create(
      // 			`./Burgs/${burg.name}.md`,
      // 			generateBurgMD(burg),
      // 		),
      // 	),
      // );

      // await Promise.all(
      // 	Object.values(fmg.states).map((state) =>
      // 		this.app.vault.create(
      // 			`./States/${state.name}.md`,
      // 			state.name,
      // 		),
      // 	),
      // );

      await Promise.all(
        Object.values(fmg.cultures).map((culture) =>
          this.app.vault.create(
            `./Cultures/${culture.name}.md`,
            generateCultureMD({
              fmg,
              culture,
            }),
          ),
        ),
      );

      console.log(fmg);

      await Promise.all(
        Object.values(fmg.provinces).map((province) =>
          this.app.vault.create(
            `./Provinces/${province.name}.md`,
            generateProvinceMD({ fmg, province }),
          ),
        ),
      );

      await Promise.all(
        Object.values(fmg.religions).map((religion) =>
          this.app.vault.create(
            `./Religions/${religion.name}.md`,
            generateReligionMD({
              fmg,
              religion,
            }),
          ),
        ),
      );

      this.close();
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
