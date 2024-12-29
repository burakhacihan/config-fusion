import fs from "fs";
import path from "path";
import dotenv from "dotenv";

class EnvProvider {
	private envConfig: { [key: string]: any } = {};

	constructor() {
		const envFilePath = path.resolve(process.cwd(), ".env");
		if (fs.existsSync(envFilePath)) {
			dotenv.config({ path: envFilePath });
			this.envConfig = { ...process.env };
		} else {
			console.warn(".env file not found in the project.");
		}
	}

	public getConfig(): { [key: string]: any } {
		return this.envConfig;
	}
}

export default EnvProvider;
