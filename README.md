<div style="display: flex; justify-content: center; flex-direction: column;gap:20px; align-items: center">
    <h1>Compose Craft</h1>
    <img src="./assets/logo_mark.jpg" width="300px">
</div>

[Compose Craft](https://composecraft.com) is a modern, open-source tool to help you manage, edit and share docker compose files in an intuitive GUI way.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/composecraft/composecraft/pulls)
[![Discord](https://img.shields.io/discord/123456789012345678.svg?label=Discord&logo=discord)](https://discord.gg/Wdz7Dht9YQ)

<img src="./assets/demo-img.png" alt="Compose Craft Demo" style="max-width: 100%; height: auto;">

## 🚀 Features

- **Visual Docker Compose Editor**: Create and edit docker compose files with an intuitive drag-and-drop interface
- **Real-time Diagram Visualization**: See your services as interconnected nodes with automatic layout
- **One-Click Sharing**: Generate public links to share your docker compose diagrams with anyone
- **Import/Export**: Import existing docker-compose.yml files and export your creations
- **GitHub Integration**: Connect your GitHub repositories for seamless workflow
- **Multi-Service Management**: Handle complex multi-service applications with ease
- **Environment Variables & Volumes**: Visual management of env vars, volumes, networks, and ports
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📖 Documentation

Complete documentation is available at [https://composecraft.com/docs/](https://composecraft.com/docs/)

## 🛠️ Quick Start

### Online Version

Use the hosted version at [composecraft.com](https://composecraft.com) - no installation required!

### Self-Hosted Deployment

#### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/composecraft/composecraft.git
cd composecraft/webapp

# Start with Docker Compose
docker compose up -d
```

The application will be available at http://localhost:3000

#### Manual Installation

```bash
# Clone the repository
git clone https://github.com/composecraft/composecraft.git
cd composecraft/webapp

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

## 🏗️ Architecture

Compose Craft is built with modern technologies:

- **Frontend**: Next.js 15 with React 19
- **UI Framework**: Radix UI + Tailwind CSS
- **Diagram Engine**: React Flow with Dagre layout
- **State Management**: Zustand
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Code Editor**: Monaco Editor (VS Code's editor)
- **Styling**: Tailwind CSS with custom animations

### Key Dependencies

- `@xyflow/react`: Node-based diagram visualization
- `@composecraft/docker-compose-lib`: Core docker compose parsing library
- `@radix-ui/react-*`: Accessible UI components
- `zod`: Schema validation
- `react-hook-form`: Form management
- `posthog-js`: Analytics (optional)

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
SECRET_KEY=your-super-secret-jwt-key-here
MONGODB_URI=mongodb://localhost:27017/composecraft
URL=http://localhost:3000

# Optional
CORE_ONLY=false                    # Disable SaaS features for simple self-host
DISABLE_TELEMETRY=false           # Disable PostHog analytics
NEXT_PUBLIC_POSTHOG_KEY=your-key  # PostHog project key for telemetry
```

### Docker Configuration

For production deployments, use the provided `docker-compose.yml`:

```yaml
services:
  compose-craft:
    image: composecraft/composecraft:latest
    ports:
      - "3000:3000"
    environment:
      - SECRET_KEY=your-secret-key
      - MONGODB_URI=mongodb://mongo:27017/composecraft
      - URL=https://your-domain.com
    depends_on:
      - mongo
  mongo:
    image: mongo:latest
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. **Fork and clone the repository**
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Set up environment variables** (see Configuration section)
4. **Start development server**:
   ```bash
   pnpm run dev
   ```
5. **Run tests**:
   ```bash
   pnpm test
   ```
6. **Lint code**:
   ```bash
   pnpm lint
   ```

### Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Ensure tests pass and code is formatted
4. Create a pull request with a clear description

## 📋 Project Structure

```
webapp/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Main application dashboard
│   ├── playground/        # Docker compose editor
│   ├── api/              # API routes
│   └── components/       # App-specific components
├── components/           # Shared UI components
│   ├── playground/       # Editor-specific components
│   ├── display/         # Data display components
│   └── ui/             # Reusable UI components
├── lib/                # Core libraries and utilities
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
└── assets/             # Static assets and images
```

## 🐛 Bug Reports

If you find a bug, please open an issue with:

- Clear and descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Your environment details

## 💡 Feature Requests

We'd love to hear your ideas! Please:

1. Check existing issues to avoid duplicates
2. Create a new issue with a clear description
3. Explain why this feature would be useful
4. Include mockups or examples if possible

## 📊 Roadmap

See our [Roadmap](ROADMAP.md) for planned features and improvements.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Flow](https://reactflow.dev/) for the excellent diagram library
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Next.js](https://nextjs.org/) for the fantastic framework
- All our contributors and community members!

## 🤝 Community

- **Discord**: [Join our Discord server](https://discord.gg/Wdz7Dht9YQ)
- **GitHub Discussions**: For questions and community discussions
- **Issues**: For bug reports and feature requests

## 📞 Support

For support:
- Check our [Documentation](https://composecraft.com/docs/)
- Search existing [Issues](https://github.com/composecraft/composecraft/issues)
- Join our [Discord](https://discord.gg/composecraft) community
- Open a new [GitHub Issue](https://github.com/composecraft/composecraft/issues/new)

---

**Made with ❤️ by the Compose Craft community**

[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![made with pnpm](https://img.shields.io/badge/made%20with-pnpm-000?logo=pnpm)](https://pnpm.io/)
