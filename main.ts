import { FMG } from "azgaar-fmg-parser";
import { App, Modal, Plugin, PluginSettingTab, Setting } from "obsidian";

interface AzgaarObsidianPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: AzgaarObsidianPluginSettings = {
	mySetting: "default",
};

export default class AzgaarObsidianPlugin extends Plugin {
	settings: AzgaarObsidianPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "azgaar-obsidian-plugin-map-importer",
			name: "Import Map",
			callback: () => new MapImporterModal(this.app).open(),
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000),
		);
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

class MapImporterModal extends Modal {
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

			const fmg = FMG.parse({ data: content });

			await Promise.all([
				this.app.vault.createFolder("./Burgs"),
				this.app.vault.createFolder("./States"),
				this.app.vault.createFolder("./Cultures"),
				this.app.vault.createFolder("./Provinces"),
				this.app.vault.createFolder("./Religions"),
			]);

			await Promise.all(
				Object.values(fmg.burgs).map((burg) =>
					this.app.vault.create(`./Burgs/${burg.name}.md`, burg.name),
				),
			);

			await Promise.all(
				Object.values(fmg.states).map((state) =>
					this.app.vault.create(
						`./States/${state.name}.md`,
						state.name,
					),
				),
			);

			await Promise.all(
				Object.values(fmg.cultures).map((culture) =>
					this.app.vault.create(
						`./Cultures/${culture.name}.md`,
						culture.name,
					),
				),
			);

			await Promise.all(
				Object.values(fmg.provinces).map((province) =>
					this.app.vault.create(
						`./Provinces/${province.name}.md`,
						province.name,
					),
				),
			);

			await Promise.all(
				Object.values(fmg.religions).map((religion) =>
					this.app.vault.create(
						`./Religions/${religion.name}.md`,
						religion.name,
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

class SampleSettingTab extends PluginSettingTab {
	plugin: AzgaarObsidianPlugin;

	constructor(app: App, plugin: AzgaarObsidianPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
