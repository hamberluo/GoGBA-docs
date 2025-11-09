# GoGBA Documentation Website

This repository contains the documentation website for GoGBA, a GBA game emulator app.

## Pages

- **Home**: Main landing page (`index.html`)
- **About**: Information about GoGBA (`about.html`)
- **Support**: Support and FAQ page (`support.html`)
- **Privacy Policy**: Privacy policy (`privacy-policy.html`)
- **Terms of Service**: Terms of service (`terms-of-service.html`)

## GitHub Pages Setup

To enable GitHub Pages for this repository:

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select the branch you want to use (typically `main`)
4. Select the folder (usually `/ (root)`)
5. Click "Save"

Your site will be available at: `https://yourusername.github.io/GoGBA-docs/`

### Using Pure HTML (Recommended)

If you want to use pure HTML without Jekyll:

1. Create a `.nojekyll` file in the root directory (already included)
2. GitHub Pages will serve your HTML files directly

### Using Jekyll

If you prefer Jekyll:

1. Remove the `.nojekyll` file
2. The `_config.yml` file will configure Jekyll settings
3. GitHub Pages will automatically build your site using Jekyll

## Local Development

To preview the site locally:

### Using a Simple HTTP Server

```bash
# Python 3
python3 -m http.server 8000

# Node.js (with http-server)
npx http-server

# PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### Using Jekyll (if enabled)

```bash
gem install bundler jekyll
bundle install
bundle exec jekyll serve
```

## Contact

For questions or support, contact: hamberluo@gmail.com
