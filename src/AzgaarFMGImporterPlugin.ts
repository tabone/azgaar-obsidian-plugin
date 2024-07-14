import { Plugin } from "obsidian";
import { MapImporterModal } from "./MapImporterModal";

export class AzgaarFMGImporterPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "azgaar-fmg-importer-plugin-importer",
      name: "Import Map",
      callback: () => new MapImporterModal(this.app).open(),
    });
  }

  onunload() {}
}
