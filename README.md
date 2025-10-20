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

- Docker & Docker Compose
- 2GB free RAM

### Run with Docker

```bash
# Clone the repository
git clone https://github.com/edgiumtech/ImageMate
cd imaginary

# Start the services
docker-compose up -d

# Open in browser
open http://localhost:3000
```

That's it! The UI runs on port `3000`, the API on port `9000`.

### Stop the Services

```bash
docker-compose down
```

## Development

```bash
cd client
bun install
bun dev
```

Dev server: http://localhost:3000

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **Backend**: [imaginary](https://github.com/h2non/imaginary) (Go + libvips)
- **Runtime**: Bun
- **Deploy**: Docker

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

## Links

- [imaginary](https://github.com/h2non/imaginary) - The image processing API
- [libvips](https://libvips.github.io/libvips/) - The underlying image library
- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
