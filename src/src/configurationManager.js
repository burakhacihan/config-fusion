import EnvProvider from "./providers/EnvProvider.js";
import JsonProvider from "./providers/JsonProvider.js";

class ConfigurationManager {
	constructor() {
		this.config = {};
		this.providers = [];
		this.isLoaded = false;
		this.loadingPromise = null;

		this.addProvider(new EnvProvider());
		this.addProvider(new JsonProvider());

		this.autoLoad();
	}

	addProvider(provider) {
		this.providers.push(provider);
	}

	async init() {
		for (const provider of this.providers) {
			const providerConfig = await provider.getConfig();
			this.config = { ...this.config, ...providerConfig };
		}
		this.isLoaded = true;
	}

	async autoLoad() {
		if (!this.isLoaded) {
			this.loadingPromise = this.init();
			await this.loadingPromise;
		}
	}

	get(key) {
		const searchKey = key.split(".");

		function recursiveSearch(obj, keys) {
			if (!obj || typeof obj !== "object" || keys.length === 0) {
				return undefined;
			}
			const [currentKey, ...remainingKeys] = keys;
			if (currentKey in obj) {
				if (remainingKeys.length === 0) {
					return obj[currentKey];
				}
				return recursiveSearch(obj[currentKey], remainingKeys);
			}
			for (const childKey in obj) {
				if (typeof obj[childKey] === "object") {
					const result = recursiveSearch(obj[childKey], keys);
					if (result !== undefined) {
						return result;
					}
				}
			}
			return undefined;
		}

		return recursiveSearch(this.config, searchKey);
	}

	getAll() {
		if (!this.isLoaded) {
			console.warn(
				"Configuration not fully loaded. Await autoLoad() to ensure configurations are available."
			);
			return {};
		}
		return this.config;
	}
}

function config(key) {
	const manager = ConfigurationManager.getInstance();
	return manager.get(key);
}

ConfigurationManager.instance = null;

ConfigurationManager.getInstance = function () {
	if (!ConfigurationManager.instance) {
		ConfigurationManager.instance = new ConfigurationManager();
	}
	return ConfigurationManager.instance;
};

export { ConfigurationManager, config };
