# CTF Writeups 🌸

A small, cozy static site for my CTF writeups. Built with React + Vite, deployed to GitHub Pages.

## Adding a writeup

One markdown file per CTF in `src/writeups/`:

```md
---
title: SomeCTF 2026
date: 2026-11-22
tags: web, crypto
description: One line about how it went.
---

## Challenge name [web, sqli]
My notes, code, and ![screenshots](img/somectf-2026/shot.png).
```

- Each `##` heading is a challenge, and `[tags]` at its end become filter tags in the sidebar.
- Put images in `public/img/<ctf-name>/` (lowercase, no spaces).
- Leave a blank line after tables.
- Welcome note on the home page: `src/welcome.md`.

## Run it

```bash
npm install
npm run dev
```

## Tweak the look

Colors, fonts and width are variables at the top of `src/theme.css`. Site title and sticker positions are in `src/App.jsx`.

## Deploy

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes to GitHub Pages (Settings → Pages → Source: GitHub Actions).
