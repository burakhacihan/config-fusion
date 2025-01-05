import { config, configurationManager } from "config-fusion";

console.log(config("KEY"));

console.log(config("port"));

console.log(config("database.host"));
