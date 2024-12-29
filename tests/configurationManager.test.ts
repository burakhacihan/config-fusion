import { ConfigurationManager } from "../src/configurationManager";
import EnvProvider from "../src/providers/EnvProvider";
import JsonProvider from "../src/providers/JsonProvider";

jest.mock("../src/providers/EnvProvider");
jest.mock("../src/providers/JsonProvider");

describe("ConfigurationManager", () => {
	let configurationManager: ConfigurationManager;

	beforeEach(() => {
		(EnvProvider as jest.Mock).mockImplementation(() => ({
			getConfig: jest.fn(() => ({
				NODE_ENV: "test",
				API_KEY: "test-api-key",
			})),
		}));

		(JsonProvider as jest.Mock).mockImplementation(() => ({
			getConfig: jest.fn(() =>
				Promise.resolve({
					database: { host: "localhost", port: 5432 },
					feature: { featureFlag: true },
				})
			),
		}));

		(ConfigurationManager as any).instance = null;
		configurationManager = ConfigurationManager.getInstance();
	});

	test("should load environment variables from EnvProvider", async () => {
		await configurationManager.waitForConfigLoad();
		expect(configurationManager.get("API_KEY")).toBe("test-api-key");
	});

	test("should load JSON configurations from JsonProvider", async () => {
		await configurationManager.waitForConfigLoad();
		const dbConfig = configurationManager.get("database");
		expect(dbConfig).toEqual({ host: "localhost", port: 5432 });

		const featureConfig = configurationManager.get("feature");
		expect(featureConfig).toEqual({ featureFlag: true });
	});

	test("should retrieve nested configuration values", async () => {
		await configurationManager.waitForConfigLoad();
		expect(configurationManager.get("database.host")).toBe("localhost");
		expect(configurationManager.get("database.port")).toBe(5432);
	});

	test("should return undefined for non-existent keys", async () => {
		await configurationManager.waitForConfigLoad();
		expect(configurationManager.get("nonExistentKey")).toBeUndefined();
	});

	test("should merge EnvProvider and JsonProvider configurations", async () => {
		await configurationManager.waitForConfigLoad();
		const allConfig = configurationManager.getAll();
		expect(allConfig).toEqual({
			NODE_ENV: "test",
			API_KEY: "test-api-key",
			database: { host: "localhost", port: 5432 },
			feature: { featureFlag: true },
		});
	});
});
