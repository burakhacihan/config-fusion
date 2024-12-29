# Configuration Manager

A simple and powerful library to manage configurations in NodeJS. This library supports `.env` files, JSON files, and allows you to add your custom configuration providers.

## Features

- Load environment variables from `.env` files.
- Automatically scan and load JSON configuration files.
- Merge configurations from multiple sources.
- Add your own custom configuration providers.
- Support for nested configuration keys.

## Installation

To install the library, use npm:

```bash
npm install config-fusion
```

## Usage

### Basic Setup

First, import the library:

```typescript
import { config, configurationManager } from "config-fusion";
```

### Get Configuration Values

You can access configuration values using the `config` function:

```typescript
console.log(config("API_KEY"));
```

### Nested Configuration

If your configuration is nested, use dot notation:

```typescript
console.log(config("database.host"));
```

### Add a Custom Provider

You can add your custom provider to load configurations from any source:

```typescript
class CustomProvider {
	async getConfig() {
		return { customKey: "customValue" };
	}
}

configurationManager.addProvider(new CustomProvider());
await configurationManager.waitForConfigLoad();

console.log(config("customKey"));
```

## File Naming Rules for JSON

JSON files in your project root should follow this naming pattern:

```
name.environment.type
```

- `name`: The configuration name (e.g., `database` or `feature`).
- `environment`: The environment name (e.g., `development` or `production`).
- `type`: The file extension (should always be `json`).

For example:

- `database.development.json`
- `feature.production.json`

The library automatically loads files based on the `NODE_ENV` value.

## Testing

To test the library, run:

```bash
npm test
```

## License

This project is licensed under the MIT License.
