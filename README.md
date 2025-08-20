# Aman Thanvi - Personal Website

[![Build & Deploy](https://github.com/amanthanvi/personal-website-1/actions/workflows/site.yml/badge.svg)](https://github.com/amanthanvi/personal-website-1/actions/workflows/site.yml)
[![Content Quality](https://github.com/amanthanvi/personal-website-1/actions/workflows/quality.yml/badge.svg)](https://github.com/amanthanvi/personal-website-1/actions/workflows/quality.yml)

Personal portfolio website showcasing cybersecurity expertise, federal experience, and research publications.

## 🚀 Quick Start

### Prerequisites

- Hugo Extended v0.148.2+ 
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/amanthanvi/personal-website-1.git
cd personal-website-1

# Start the Hugo development server
hugo server -D

# Build for production
hugo --minify
```

The site will be available at `http://localhost:1313/`

## 📁 Project Structure

```
personal-website-1/
├── content/          # Markdown content files
│   ├── experience/   # Work experience (page bundles)
│   ├── projects/     # Project showcases
│   └── posts/        # Blog posts
├── static/           # Static assets
│   ├── files/        # Downloadable files (resume.pdf)
│   └── images/       # Site images
├── layouts/          # Custom Hugo layouts
├── config/           # Hugo configuration
│   └── _default/     
│       ├── hugo.toml
│       ├── params.toml
│       └── module.toml
└── themes/blowfish/  # Blowfish theme
```

## 🎨 Theme

This site uses the [Blowfish](https://blowfish.page) theme for Hugo. The theme is included locally for stability.

### Key Features

- Dark/Light mode with automatic switching
- Built-in search functionality
- SEO optimized with structured data
- Responsive design
- Social media integration

## 🔧 Configuration

Main configuration files are located in `config/_default/`:

- `hugo.toml` - Core Hugo settings
- `params.toml` - Theme parameters and customization
- `module.toml` - Hugo module configuration
- `menus.en.toml` - Navigation menu structure

## 📝 Content Management

### Adding Experience

Create a new page bundle in `content/experience/`:

```bash
mkdir content/experience/new-role
```

Create `index.md` with front matter:

```yaml
---
title: "Job Title - Company"
date: 2024-01-01
draft: false
tags: ["tag1", "tag2"]
categories: ["Experience"]
description: "Brief description"
---

Content here...
```

### Adding Projects

Similar structure in `content/projects/`

## 🚢 Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `main` or `master` branch.

### Manual Deployment

1. Build the site: `hugo --minify`
2. Contents will be in `public/` directory
3. Deploy to any static hosting service

### Security Headers

Security headers are configured in:
- `static/_headers` - For Cloudflare Pages
- `static/.htaccess` - For Apache-based hosts

When using GitHub Pages, consider using Cloudflare for additional security headers.

## 🔒 Security

- Content Security Policy configured (Report-Only mode initially)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict referrer policy
- Permissions policy restricting camera/microphone/geolocation

## 🤝 Contributing

This is a personal website, but suggestions and bug reports are welcome via GitHub issues.

## 📄 License

Content is © Aman Thanvi. Code structure and configurations are available for reference.

## 🔗 Links

- [Live Site](https://amanthanvi.com)
- [LinkedIn](https://www.linkedin.com/in/amanthanvi)
- [GitHub](https://github.com/amanthanvi)