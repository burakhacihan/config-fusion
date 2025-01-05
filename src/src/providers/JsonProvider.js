import fs from "fs";
import path from "path";

class JsonProvider {
	constructor() {
		this.jsonConfig = {};
	}

	async getConfig() {
		const env = process.env.NODE_ENV || "development";

		try {
			const files = fs.readdirSync(process.cwd());
			for (const file of files) {
				const [name, environment, type] = file.split(".");
				if (type === "json" && environment === env) {
					const filePath = path.resolve(process.cwd(), file);
					const jsonData = fs.readFileSync(filePath, "utf-8");
					const parsedData = JSON.parse(jsonData);
					this.jsonConfig = { ...this.deepMerge(this.jsonConfig, parsedData) };
				}
			}
		} catch (error) {
			console.error("Error loading JSON configs:", error);
		}

		return this.jsonConfig;
	}

	deepMerge(target, source) {
		for (const key of Object.keys(source)) {
			if (
				source[key] &&
				typeof source[key] === "object" &&
				!Array.isArray(source[key])
			) {
				target[key] = this.deepMerge(target[key] || {}, source[key]);
			} else {
				target[key] = source[key];
			}
		}
		return target;
	}
}

export default JsonProvider;
