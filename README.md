# create-x-lite

**create-x-lite** is a modern, interactive command-line interface (CLI) for generating production-ready Express.js projects. It removes the boilerplate setup process and lets you start writing application code in seconds.

_This project was created as a submission for the **[boot.dev](https://www.boot.dev/) Hackathon (July 2025)**._

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Usage](#usage)
  - [Interactive Mode](#interactive-mode)
  - [Advanced Usage: Flags](#advanced-usage-flags)
- [Philosophy](#philosophy)
- [Future Vision](#future-vision)
- [License](#license)

## Getting Started

To scaffold a new project, run the following command in your terminal. For most users, the interactive guide is all you need.

```bash
npx create-x-lite
```

This single command is all you need to create a fully configured Express.js application.

## Features

- **Interactive and Intuitive**: A step-by-step guided process to configure your project exactly as you need it.
- **Non-Interactive Mode**: Use CLI flags to bypass prompts and enable automated, scripted project setup.
- **TypeScript and JavaScript**: First-class support for both TypeScript (with strict settings) and plain JavaScript.
- **Modern and Legacy Modules**: Choose between modern ESM (import/export) or legacy CommonJS (require/exports).
- **Flexible Folder Structures**: Select a feature-based structure for scalability or a traditional MVC-style structure.
- **Optional Schema Validation**: Add Zod for powerful, type-safe validation with a single command.
- **Out-of-the-Box Tooling**: Every project comes pre-configured with ESLint, Prettier, and Nodemon.

## Usage

### Interactive Mode

Running the CLI without arguments is the primary way to use create-x-lite. It will guide you through all the necessary setup questions.

```bash
# This will start the interactive setup process
npx create-x-lite
```

You can also provide a project name directly, or use a single dot (.) to scaffold in the current directory.

```bash
# Create a new directory named 'my-api'
npx create-x-lite my-api

# Scaffold in the current folder (will prompt if not empty)
npx create-x-lite .
```

### Advanced Usage: Flags

For power users or automated environments, you can use flags to bypass the interactive prompts.

| Flag            | Alias | Description                          | Default (if -y) |
| --------------- | ----- | ------------------------------------ | --------------- |
| `--yes`         | `-y`  | Skip all prompts and use defaults    | N/A             |
| `--typescript`  | `-t`  | Use TypeScript instead of JavaScript | JavaScript      |
| `--commonjs`    | `-c`  | Use CommonJS instead of ESM          | ESM             |
| `--traditional` | `-T`  | Use traditional structure            | Feature-based   |
| `--zod`         |       | Add Zod for validation               | Disabled        |

Examples:

```bash
# Skip all prompts and create the recommended default project (JS, ESM, Feature-based)
npx create-x-lite my-default-app -y

# Create a default project but override the language to TypeScript
npx create-x-lite my-ts-app -y -t

# Create a highly specific project without any interaction
npx create-x-lite my-specific-app --typescript --commonjs --traditional --zod
```

## Philosophy

The time between deciding to build an API and writing the first line of business logic is often filled with tedious, repetitive setup. create-x-lite is built on a few core principles to solve this:

- **Modern by Default**: The generated code should use modern standards, like strict TypeScript configurations and the latest ESLint flat-config.
- **Opinionated but Flexible**: The tool provides sensible defaults but ultimately puts the developer in control. Every significant architectural choice is presented as a clear option.
- **Developer Experience First**: From the guided prompts to the non-interactive flags, every aspect is designed to create a smooth and productive workflow.

## Future Vision

The goal is for create-x-lite to become a comprehensive toolkit for backend development. The immediate roadmap includes a powerful plugin system (for databases like Prisma, authentication, etc.), support for other frameworks like Koa and Fastify, and automatic resource generators.

## License

Released under the MIT License.

---

_This is a submission for the [boot.dev](https://www.boot.dev/) Hackathon._
