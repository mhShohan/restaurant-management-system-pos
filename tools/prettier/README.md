# Prettier Configuration

Industry-grade Prettier configuration for modern TypeScript/React/Next.js projects.

## Features

- ✅ **Modern Standards**: Latest industry best practices
- ✅ **TypeScript Support**: Optimized for TypeScript projects
- ✅ **React/JSX**: Enhanced formatting for React components
- ✅ **Import Sorting**: Automatic import organization
- ✅ **Tailwind CSS**: Plugin support for Tailwind classes
- ✅ **Multi-format**: Support for JSON, Markdown, YAML, CSS, HTML
- ✅ **Customizable**: File-type specific overrides

## Usage

### Installation

This package is already configured in your monorepo workspace.

### Basic Configuration

Add to your project's `package.json`:

```json
{
  "prettier": "@tools/prettier"
}
```

### React Projects

For React-specific enhanced rules:

```json
{
  "prettier": "@tools/prettier/react"
}
```

### Custom Configuration

Create a `.prettierrc.js` file:

```javascript
import config from '@tools/prettier';

export default {
  ...config,
  // Your custom overrides
  printWidth: 100,
};
```

## Configuration Details

### Core Rules

- **Print Width**: 80 characters (industry standard)
- **Indentation**: 2 spaces (consistent with project)
- **Semicolons**: Always (explicit and safe)
- **Quotes**: Single quotes for JS/TS, double for HTML/CSS
- **Trailing Commas**: ES5 compatible
- **Bracket Spacing**: Enabled for readability

### Import Sorting

Imports are automatically sorted in this order:

1. React and React DOM
2. Next.js imports
3. Node.js built-ins
4. External packages
5. Internal workspace packages (`@repo/`)
6. Relative imports (parent then current directory)
7. Style imports (CSS/SCSS files)

### File Type Overrides

- **JSON**: 120 character width
- **Markdown**: 100 character width with proper prose wrapping
- **HTML**: 120 character width, bracket same line
- **CSS/SCSS**: Double quotes, 2-space indentation
- **Test files**: 120 character width for better readability

## Plugins

This configuration includes these powerful plugins:

- **@trivago/prettier-plugin-sort-imports**: Automatic import sorting
- **prettier-plugin-tailwindcss**: Tailwind CSS class sorting

## Integration

### VS Code

Install the Prettier extension and add to your `settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

### Pre-commit Hooks

Use with lint-staged in your `package.json`:

```json
{
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx,json,css,md}": ["prettier --write"]
  }
}
```

## Scripts

Common scripts to add to your `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\""
  }
}
```
