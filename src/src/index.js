import { ConfigurationManager, config } from "./configurationManager.js";

const configurationManager = await ConfigurationManager.getInstance();

export { configurationManager, config };
