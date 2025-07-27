# create-x-lite

**create-x-lite** is a modern, interactive command-line interface (CLI) for generating production-ready Express.js projects. It removes the boilerplate setup process and lets you start writing application code in seconds.

_This project was created as a submission for the **[boot.dev](https://www.boot.dev/) Hackathon (July 2025)**._

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Usage](#usage)
  - [The Interactive Prompts](#the-interactive-prompts)
- [Philosophy](#philosophy)
- [Future Vision](#future-vision)

## Getting Started

To scaffold a new project, run the following command in your terminal. The CLI will guide you through the necessary setup options.

```bash
npx create-x-lite
```

This single command is all you need to create a fully configured Express.js application.

## Features

- **Interactive and Intuitive:** A step-by-step guided process to configure your project exactly as you need it.
- **TypeScript and JavaScript:** First-class support for both **TypeScript** (with strict settings) and plain **JavaScript**.
- **Modern and Legacy Modules:** Choose between modern **ESM** (import/export) or legacy **CommonJS** (require/exports) to fit any environment.
- **Flexible Folder Structures:** Select a **feature-based** structure for scalability or a **traditional MVC-style** structure for familiarity.
- **Optional Schema Validation:** Add **Zod** for powerful, type-safe validation with a single command during setup.
- **Out-of-the-Box Tooling:** Every generated project comes pre-configured with ESLint, Prettier, and Nodemon for a seamless development experience.

## Usage

The primary way to use create-x-lite is to run it without arguments and follow the interactive prompts.

```bash
# This will start the interactive setup process
npx create-x-lite
```

You can also provide a project name directly. If the directory does not exist, it will be created.

```bash
# This will create a new directory named 'my-api'
npx create-x-lite my-api
```

To scaffold a project in the current directory, use a single dot (.) as the project name.

```bash
# Scaffold in the current folder (will prompt if not empty)
npx create-x-lite .
```

### The Interactive Prompts

The CLI will ask you a series of questions to tailor the project to your needs:

1. **Project Name:** The name of your project directory.
2. **Language:** Choose between TypeScript and JavaScript.
3. **Module System:** Choose between ESM and CommonJS.
4. **Project Structure:**
   - **Feature-based:** Groups files by feature (e.g., `/features/users`, `/features/products`). Recommended for larger, more scalable applications.
   - **Traditional:** Separates files by responsibility (e.g., `/controllers`, `/routes`, `/services`). A classic and familiar MVC pattern.
5. **Zod Validation:** If enabled, it will add the zod library, a reusable validation middleware, and an example user route with schema validation to demonstrate its usage.

## Philosophy

The time between deciding to build an API and writing the first line of business logic is often filled with tedious, repetitive setup. While tools like express-generator exist, they are often outdated. create-x-lite is built on a few core principles to solve this:

1. **Modern by Default:** The generated code should use modern standards, like strict TypeScript configurations and the latest ESLint flat-config, without being overly experimental.

2. **Opinionated but Flexible:** The tool provides sensible defaults but ultimately puts the developer in control. Every significant architectural choice is presented as a clear, interactive option.

3. **Developer Experience First:** From the guided prompts to the pre-configured tooling, every aspect is designed to create a smooth and productive workflow from the very first minute.

## Future Vision

The goal is for create-x-lite to become a comprehensive toolkit for backend development. The immediate roadmap includes a powerful plugin system (for databases like Prisma, authentication, etc.), support for other frameworks like Koa and Fastify, and automatic resource generators.

## License

Released under the MIT License.

---

_This is a submission for the [boot.dev](https://www.boot.dev/) Hackathon._
