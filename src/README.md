# Config Fusion - Configuration Manager

A simple library to manage configurations in NodeJS. This library supports `.env` files and JSON files. It also allows you to search for nested keys and even search by key name without specifying the full path.

## Features

- Load environment variables from `.env` files.
- Automatically load JSON configuration files based on the environment (e.g., `development`, `production`).
- Merge configurations from multiple sources.
- Access configurations using nested keys (e.g., `database.host`).
- Search for keys by their name without specifying the full path (e.g., search for `host` to find `database.host`).
- Add your own custom configuration providers.

## Installation

Install the library using npm:

```bash
npm install config-fusion
```

## Usage

### Import the Library

```javascript
import { config, configurationManager } from "config-fusion";
```

### Get Configuration Values

You can access configuration values using the `config` function:

```javascript
console.log(config("API_KEY"));
```

### Nested Keys

If your configuration has nested keys, you can use dot notation:

```javascript
console.log(config("database.host"));
```

### Search by Key Name

You can search for a key without specifying the full path:

```javascript
console.log(config("host"));
```

### Adding a Custom Provider

You can add a custom provider to load configurations from any source:

```javascript
class CustomProvider {
	async getConfig() {
		return { customKey: "customValue" };
	}
}

configurationManager.addProvider(new CustomProvider());
```

## File Naming Rules for JSON Files

The library automatically loads JSON files from your project root. File names should follow this pattern:

```
<name>.<environment>.json
```

- `<name>`: The configuration name (e.g., `appsettings`, `featuresettings`).
- `<environment>`: The environment name (e.g., `development`, `production`).
- Example file names:
  - `appsettings.development.json`
  - `featuresettings.production.json`

**Note:** This package supports only ES Modules (ESM).
