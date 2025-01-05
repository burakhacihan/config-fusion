import fs from "fs";
import path from "path";
import dotenv from "dotenv";

class EnvProvider {
	constructor() {
		this.envConfig = {};

		const envFilePath = path.resolve(process.cwd(), ".env");
		if (fs.existsSync(envFilePath)) {
			dotenv.config({ path: envFilePath });
			this.envConfig = { ...process.env };
		} else {
			console.warn(".env file not found in the project.");
		}
	}

	getConfig() {
		return this.envConfig;
	}
}

export default EnvProvider;
