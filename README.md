# ImageMate

<div align="center">
  <p><strong>A modern web UI for private, fast image conversion</strong></p>
  <p>Built on top of <a href="https://github.com/h2non/imaginary">imaginary</a> • Powered by libvips</p>
</div>

---

## Why ImageMate?

We needed a way to convert images privately without uploading them to third-party services. A shell script worked initially, but we wanted something more user-friendly and accessible to the team. We discovered [imaginary](https://github.com/h2non/imaginary) - a powerful image processing API - but found no open-source UI for it.

So we built one.

## Features

- 🎨 **Modern UI** - Built with Next.js 15, TypeScript, and shadcn/ui
- ⚡ **Fast Conversion** - Powered by libvips through imaginary
- 🔒 **Private** - Everything runs locally, your images never leave your machine
- 🖼️ **Side-by-side Preview** - Compare original and converted images
- 📊 **Size Comparison** - See compression savings instantly
- 🔄 **Multiple Formats** - WebP, JPEG, PNG, AVIF, TIFF
- 🎛️ **Full Control** - Quality adjustment, resize, and more
- 🌓 **Dark Mode** - Automatic theme support

## Quick Start

### Prerequisites

- Docker
- 2GB free RAM

### Option 1: Run Pre-built Image (Recommended)

The easiest way to get started is using our pre-built Docker image:

```bash
docker run -d \
  --name imagemate \
  -p 3000:3000 \
  -p 9000:9000 \
  edgium/imagemate:latest
```

Open in browser: http://localhost:3000

**Manage the container:**

```bash
# Stop
docker stop imagemate

# Start again
docker start imagemate

# Remove
docker rm imagemate

# View logs
docker logs -f imagemate
```

#### Custom Ports

You can customize the ports using environment variables:

```bash
docker run -d \
  --name imagemate \
  -e FRONTEND_PORT=8080 \
  -e BACKEND_PORT=8081 \
  -p 8080:8080 \
  -p 8081:8081 \
  edgium/imagemate:latest
```

Access at: http://localhost:8080

### Option 2: Run with Docker Compose

For those who prefer Docker Compose:

```bash
# Using pre-built image
docker-compose up -d

# Open in browser
open http://localhost:3000
```

**Stop the services:**

```bash
docker-compose down
```

## Development

### Local Development (without Docker)

```bash
cd client
bun install
bun dev
```

Dev server: http://localhost:3000

### Build from Source

```bash
# Clone the repository
git clone https://github.com/edgiumtech/ImageMate
cd imaginary

# Build and run locally
docker-compose -f docker-compose.dev.yml up --build

# Or build the image directly
docker build -t imagemate:local .
docker run --name imagemate -p 3000:3000 -p 9000:9000 imagemate:local
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **Backend**: [imaginary](https://github.com/h2non/imaginary) (Go + libvips)
- **Runtime**: Bun
- **Deploy**: Docker

## Configuration

### Environment Variables

| Variable        | Default      | Description                      |
| --------------- | ------------ | -------------------------------- |
| `FRONTEND_PORT` | `3000`       | Port for Next.js frontend server |
| `BACKEND_PORT`  | `9000`       | Port for Imaginary backend API   |
| `NODE_ENV`      | `production` | Node.js environment              |

### Example Configurations

**Run on different ports:**

```bash
docker run -d \
  --name imagemate \
  -e FRONTEND_PORT=3333 \
  -e BACKEND_PORT=3334 \
  -p 3333:3333 \
  -p 3334:3334 \
  edgium/imagemate:latest
```

**Docker Compose with custom ports:**

```yaml
version: "3.8"
services:
  imagemate:
    image: edgium/imagemate:latest
    environment:
      - FRONTEND_PORT=3333
      - BACKEND_PORT=3334
    ports:
      - "3333:3333"
      - "3334:3334"
    restart: unless-stopped
```

## Usage

1. **Upload** - Drag & drop or click to select
2. **Configure** - Choose format, quality, dimensions
3. **Convert** - Process in milliseconds
4. **Download** - Save your optimized image

## About imaginary

This project is a web UI wrapper around [imaginary](https://github.com/h2non/imaginary) by [h2non](https://github.com/h2non). Imaginary is a fast, simple HTTP microservice for image processing using [libvips](https://libvips.github.io/libvips/). All credit for the core image processing goes to these amazing open-source projects.

## Contributing

Contributions are welcome! Whether it's:

- 🐛 Bug reports
- 💡 Feature requests
- 📝 Documentation improvements
- 🔧 Code contributions

Feel free to open an issue or submit a pull request.

## License

MIT License - Free to use, modify, and distribute.

## Docker Hub

Pre-built images are available on Docker Hub:

- **Latest**: `docker pull edgium/imagemate:latest`
- **Specific version**: `docker pull edgium/imagemate:v1.0.1`

[View on Docker Hub](https://hub.docker.com/r/edgium/imagemate)

## Links

- [Docker Hub](https://hub.docker.com/r/edgium/imagemate) - Pre-built Docker images
- [imaginary](https://github.com/h2non/imaginary) - The image processing API
- [libvips](https://libvips.github.io/libvips/) - The underlying image library
- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
