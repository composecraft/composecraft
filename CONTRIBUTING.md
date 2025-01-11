# Contributing to Compose Craft

Thank you for your interest in contributing to Compose Craft! We welcome contributions from the community and are happy to have you on board.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please report any unacceptable behavior to the project maintainers.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list to avoid duplicates. When you create a bug report, include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

Use issue template if one fit to your needs.

- Use a clear and descriptive title
- Provide a detailed description of the proposed functionality
- Include mockups or examples if possible
- Explain why this enhancement would be useful

### Pull Requests

- Fork the repository and create your branch from `main`
- Follow the coding style of the project
- Include comments in your code where necessary
- Update the documentation if needed
- Ensure the test suite passes
- Create a pull request with a clear title and description

## Development Setup

1. Ensure you have Node.js installed (preferably the latest LTS version)
2. Fork and clone the repository
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Set up your environment variables:
   ```env
   SECRET_KEY=your_secret_key
   MONGODB_URI=your_mongodb_uri
   URL=http://localhost:3000
   CORE_ONLY=false
   DISABLE_TELEMETRY=true
   ```
5. Start the development server:
   ```bash
   pnpm run dev
   ```

## Coding Standards

- Use TypeScript for all new code
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Ensure your code is properly formatted using the project's prettier configuration

## Testing

Before submitting a pull request:

1. Run the test suite:
   ```bash
   pnpm test
   ```
2. Ensure your code passes linting:
   ```bash
   pnpm lint
   ```

## Documentation

- Update documentation for any changed functionality
- Document new features
- Keep the README.md up to date

## Questions?

If you have any questions or need clarification:

1. Check the existing issues
2. Open a new issue with your question
3. Contact the maintainers

## License

By contributing to Compose Craft, you agree that your contributions will be licensed under its [licence](./LICENSE).
