import fs from "fs";
import path from "path";

class JsonProvider {
	private jsonConfig: { [key: string]: any } = {};

	public async getConfig(): Promise<{ [key: string]: any }> {
		const env = process.env.NODE_ENV || "development";

		try {
			const files = fs.readdirSync(process.cwd());
			for (const file of files) {
				const [name, environment, type] = file.split(".");
				if (type === "json" && environment === env) {
					const filePath = path.resolve(process.cwd(), file);
					const jsonData = fs.readFileSync(filePath, "utf-8");
					const parsedData = JSON.parse(jsonData);
					this.jsonConfig[name] = parsedData;
				}
			}
		} catch (error) {
			console.error(`Error loading JSON configs:`, error);
		}

		return this.jsonConfig;
	}
}

export default JsonProvider;
