import { Plugin } from "obsidian";
import { MapImporterModal } from "src/MapImporterModal";
import { SettingTab } from "./SettingTab";

interface AzgaarObsidianPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: AzgaarObsidianPluginSettings = {
	mySetting: "default",
};

export class AzgaarObsidianPlugin extends Plugin {
	settings: AzgaarObsidianPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "azgaar-obsidian-plugin-map-importer",
			name: "Import Map",
			callback: () => new MapImporterModal(this.app).open(),
		});

		this.addSettingTab(new SettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
