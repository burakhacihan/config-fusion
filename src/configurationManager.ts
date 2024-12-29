import EnvProvider from "./providers/EnvProvider";
import JsonProvider from "./providers/JsonProvider";

interface ConfigProvider {
	getConfig(): { [key: string]: any } | Promise<{ [key: string]: any }>;
}

interface Config {
	[key: string]: any;
}

class ConfigurationManager {
	private static instance: ConfigurationManager;
	private config: Config = {};
	private providers: ConfigProvider[] = [];
	private isLoaded = false;

	private constructor() {
		this.addProvider(new EnvProvider());
		this.addProvider(new JsonProvider());
		this.init();
	}

	public static getInstance(): ConfigurationManager {
		if (!ConfigurationManager.instance) {
			ConfigurationManager.instance = new ConfigurationManager();
		}
		return ConfigurationManager.instance;
	}

	public addProvider(provider: ConfigProvider): void {
		this.providers.push(provider);
	}

	private async init(): Promise<void> {
		for (const provider of this.providers) {
			const providerConfig = await provider.getConfig();
			this.config = { ...this.config, ...providerConfig };
		}
		this.isLoaded = true;
	}

	public async waitForConfigLoad(): Promise<void> {
		while (!this.isLoaded) {
			await new Promise((resolve) => setTimeout(resolve, 10));
		}
	}

	public get(key: string): any {
		return key
			.split(".")
			.reduce(
				(obj, segment) => (obj && obj[segment] ? obj[segment] : undefined),
				this.config
			);
	}

	public getAll(): Config {
		return this.config;
	}
}

function config(key: string): any {
	return ConfigurationManager.getInstance().get(key);
}

export { ConfigurationManager, config };
