import { Plugin } from "obsidian";
import { MapImporterModal } from "./MapImporterModal";

export class AzgaarFMGImporterPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "map-importer",
      name: "Import map",
      callback: () => new MapImporterModal(this.app).open(),
    });
  }

  onunload() {}
}
