import { Plugin } from "obsidian";
import { SettingTab } from "./SettingTab";
import { MapImporterModal } from "./MapImporterModal";

interface AzgaarFMGImporterPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: AzgaarFMGImporterPluginSettings = {
  mySetting: "default",
};

export class AzgaarFMGImporterPlugin extends Plugin {
  settings: AzgaarFMGImporterPluginSettings;

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: "azgaar-fmg-importer-plugin-importer",
      name: "Import Map",
      callback: () => new MapImporterModal(this.app).open(),
    });

    this.addSettingTab(new SettingTab(this.app, this));
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
