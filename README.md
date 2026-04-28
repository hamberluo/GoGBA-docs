# GoGBA Documentation Website

This repository contains the public documentation and marketing site for **GoGBA**: a quiet, reliable, and immersive handheld emulator for **iOS** and **Android** (Game Boy Advance, Game Boy Color, and Game Boy).

## Live site

The production site is served at:

**https://gogba.xyz/**

(`CNAME` in this repo points to that domain; GitHub Pages or your DNS host serves these static files.)

If you ever publish **only** via the default GitHub Pages URL without a custom domain, the base URL would instead be `https://<username>.github.io/<repo>/` — use that only if you are not using `gogba.xyz`.

## About GoGBA

- **Quiet:** No ads, no pop-ups, no distractions
- **Reliable:** Battery saves and optional cloud backup; periodic auto-save while playing
- **Immersive:** Clean UI, transparent on-screen controls, optional gamepad
- **Comfortable:** Multiple dark themes for long sessions

Key features include RetroAchievements integration, gamepad support, many UI languages, video filters, optional Premium (speed, cheats, instant slots, cloud save), and optional AI screen translation.

## Pages

- **Home:** `index.html`
- **About:** `about.html`
- **Support / FAQ:** `support.html`
- **Privacy Policy:** `privacy-policy.html`
- **Terms of Service:** `terms-of-service.html`
- **License:** `license.html`

## GitHub Pages

1. Repository **Settings → Pages**
2. Source: branch (e.g. `main`), folder `/ (root)`
3. Custom domain: `gogba.xyz` (optional; matches `CNAME`)

With pure HTML, keep **`.nojekyll`** in the root so Jekyll does not strip assets.

## Local preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Contact

hamberluo@gmail.com
