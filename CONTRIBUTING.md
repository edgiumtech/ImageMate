# Contributing to ImageMate

Thank you for your interest in contributing! This guide will help you set up your development environment.

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) (latest version)
- Docker & Docker Compose
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/edgiumtech/ImageMate
cd imaginary
```

### Step 2: Start the Backend

Run the imaginary backend using Docker Compose:

```bash
docker-compose -f docker-compose.backend.yml up -d
```

This will start the imaginary API on `http://localhost:9000`

**Verify it's running:**

```bash
curl http://localhost:9000/
```

You should see a JSON response with version information.

### Step 3: Set Up the Frontend

```bash
cd client

# Install dependencies
bun install

# (Optional) Create environment file if you need custom backend URL
# By default, the app connects to http://localhost:9000
# echo "BACKEND_URL=http://localhost:9000" > .env.local

# Start the development server
bun dev
```

The frontend will run on `http://localhost:3000`

### Step 4: Make Your Changes

The project structure:

```
client/
├── app/                    # Next.js 15 app directory
│   ├── api/               # API routes (proxy to imaginary)
│   │   ├── convert/       # Image conversion endpoint
│   │   └── version/       # Backend version endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── image-converter/   # Main converter components
│   └── ui/                # shadcn/ui components
└── lib/                   # Utility functions
```

### Step 5: Test Your Changes

```bash
cd client

# Run linting
bun run lint

# Run type checking
bun run build
```

### Step 6: Submit a Pull Request

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Commit: `git commit -m "feat: your feature description"`
4. Push: `git push origin feature/your-feature-name`
5. Open a Pull Request on GitHub

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Stopping Development Services

```bash
# Stop the backend
docker-compose -f docker-compose.backend.yml down

# Stop the frontend
# Just Ctrl+C in the terminal where bun dev is running
```

## Need Help?

- 💬 Open an issue for questions
- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features via GitHub Discussions

## Code Style

- Use TypeScript
- Follow the existing code style
- Use named exports (not default exports)
- Add `displayName` when using `memo`
- Use functional components with hooks

Happy coding! 🚀
