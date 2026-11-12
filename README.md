# Majlis Energy website

Jekyll site for Majlis Energy. GitHub Pages builds it automatically on every push to `main`; nothing needs to be installed to publish.

> This repository is public if the GitHub repo is public. The `context/` folder (client briefs and review documents) is excluded by `.gitignore` and must never be committed or uploaded.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Home: hero, who we are, why Majlis, how we work, services, current focus, projects (`#projects`), team, latest insights, contact (`#contact`) |
| `about.html`, `services.html`, `team.html` | Inner pages |
| `insights.html` | Featured white paper, then every article with topic filters |
| `_posts/` | **Insights articles**, one Markdown file each, named `YYYY-MM-DD-title.md`. Each becomes a page at `/insights/title/` |
| `_data/external_insights.yml` | Articles published on other sites (Knowledge Ridge, The EIC), listed after the on-site articles |
| `_layouts/default.html` | Page shell: `<head>`, header, footer |
| `_layouts/post.html` | Article page template |
| `_includes/` | Header, footer, article card and icons, shared by every page |
| `_config.yml` | Site settings, including `baseurl` (see domain cutover below) |
| `.pages.yml` | Configuration for the Pages CMS browser editor |
| `assets/css/styles.css` | All styles. Design tokens (colours, fonts, spacing) are at the top in `:root` |
| `assets/js/main.js` | Header state, mobile menu, scroll reveals, hero line animation, Insights filters |
| `assets/images/` | Logo and site photography |
| `assets/uploads/` | Images and files uploaded for articles |
| `articles/` | Original article PDFs |
| `flexcollect-sep25.pdf`, `assets/images/crude-oil-to-plastic-and-back-oct25.pdf` | Copies kept at the old site's PDF addresses so existing links keep working |
| `404.html`, `robots.txt`, `sitemap.xml` | Not-found page and search-engine files (the sitemap lists articles automatically) |

## Publishing insights

New articles appear automatically on the Insights page and, if among the three newest, on the homepage.

**In the browser (recommended for Francis):** sign in at [app.pagescms.org](https://app.pagescms.org) with a GitHub account that has write access to `Majlis-Energy/Majlis-Energy-Website` and open the repository. The first time, an owner of the Majlis-Energy organisation must approve the Pages CMS GitHub app for it. **Insights articles** lists every article; **Add an entry** opens a form with title, date, topic, summary, optional cover image and PDF, and the article body. Untick **Published** to keep a draft private. Saving commits to GitHub and the site updates within a couple of minutes.

**By hand:** add a Markdown file to `_posts/` named `YYYY-MM-DD-short-title.md`:

```markdown
---
title: "Article title"
date: 2026-11-01
topic: Project finance
summary: "One or two sentences for the card and search results."
pdf: /articles/optional-file.pdf   # optional
---

Article text in Markdown. Use ## for section headings.
```

Notes:
- A post with `published: false` is not built, so drafts stay private.
- A post dated in the future is hidden until the site next rebuilds after that date. GitHub Pages rebuilds on each push, so a scheduled post goes live with the first change made after its date.
- Images go in `assets/uploads/` and are referenced as `/assets/uploads/file.jpg`.

## Preview locally

GitHub Pages builds the site itself, so a local preview is optional. With Docker:

```bash
docker run --rm -p 4000:4000 -v "$PWD":/srv/site -w /srv/site ruby:3.3-slim bash -c "bundle install && bundle exec jekyll serve --host 0.0.0.0"
```

Then open http://localhost:4000/Majlis-Energy-Website/.

## Other common edits

- **Featured white paper:** when the approved PDF is ready, save it as `publications/bankable-recycling-infrastructure.pdf` and add the download link where the comment in `insights.html` indicates.
- **Team photos:** replace each `<div class="person-portrait"><span>XX</span></div>` with an `<img>` of a matched, approved headshot (4:5 crop).
- **Project status:** edit the `project-status` text in the `#projects` section of `index.html`. Use only the approved labels: Research & Evaluation, Under Development, Advisory Engagement, Commercial Discussions, Engineering Phase, Investment Preparation.
- **Navigation, contact details, footer:** edit `_includes/header.html` and `_includes/footer.html` once; every page updates.

## Publish on GitHub Pages

The site is published from **`Majlis-Energy/Majlis-Energy-Website`**, branch `main`. These steps need an **owner/admin** of the Majlis-Energy organisation:

1. **Visibility or plan:** the repository is private. GitHub Pages works on a private repository only if the organisation is on a paid plan (GitHub Team or Enterprise). On the free plan, make the repository public (**Settings → General → Danger Zone → Change visibility**). The published website is public either way; `context/` is never committed.
2. **Turn on Pages:** **Settings → Pages → Build and deployment → Deploy from a branch**, branch `main`, folder `/ (root)`, then save.
3. Wait for the first deployment (a couple of minutes). The site is then at `https://majlis-energy.github.io/Majlis-Energy-Website/`, which matches `baseurl` in `_config.yml`.
4. Recommended: verify the domain under the organisation's **Settings → Pages → Add a domain** before changing DNS. This stops anyone else claiming the domain on GitHub.

## Connect the UK2 domain

There is deliberately no `CNAME` file yet, so the site can be reviewed at the github.io address first (with a `CNAME` present, GitHub redirects that address to the custom domain, which still serves the old site). At cutover, first change `baseurl` in `_config.yml` to `""` and push, then add the domain in **Settings → Pages → Custom domain** (`www.majlisenergy.com`); GitHub then commits a `CNAME` file for you. If the site should use a different domain, also update `url` in `_config.yml`.

In the UK2 control panel, open DNS management for the domain and edit the records there. **Do not change the nameservers**, and **do not touch the MX, SPF/TXT, DKIM or other mail records**: they keep `info@majlisenergy.com` working.

Back up (screenshot or export) the current DNS records first, then:

| Type | Host / name | Value |
| --- | --- | --- |
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `AAAA` (optional) | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| `CNAME` | `www` | `majlis-energy.github.io` |

Remove any existing `A`/`AAAA` records on `@` and any existing `www` record that point at the old host, otherwise traffic is split between the old and new sites.

After DNS propagates (minutes to 48 hours):

1. In **Settings → Pages**, enter `www.majlisenergy.com` as the custom domain and wait for the DNS check to pass.
2. Tick **Enforce HTTPS** once the certificate has been issued.
3. Check that `https://majlisenergy.com` redirects to `https://www.majlisenergy.com`, that pages and PDFs load, and that email still sends and receives.

Changing these records takes the current majlisenergy.com site offline and replaces it with this one, so make the change only after the new site has been reviewed and approved.
