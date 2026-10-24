# Majlis Energy website

Static HTML/CSS/JS site for Majlis Energy. There is no build step and nothing to install. Every page is a plain `.html` file at the repository root, ready for GitHub Pages.

> This repository is public if the GitHub repo is public. The `context/` folder (client briefs and review documents) is excluded by `.gitignore` and must never be committed or uploaded.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Home: hero, who we are, why Majlis, how we work, services, current focus, projects (`#projects`), team, insights, contact (`#contact`) |
| `about.html` | Who We Are: positioning, what we do and do not do, 2018–2026 timeline |
| `services.html` | Four service areas, regulated-advice disclaimer, engagement models |
| `team.html` | Leadership team, Francis and Michel profiles, organisation |
| `insights.html` | Featured white paper and the article library, with topic filters |
| `404.html` | Not-found page served by GitHub Pages (uses root-absolute paths) |
| `assets/css/styles.css` | All styles. Design tokens (colours, fonts, spacing) are at the top in `:root` |
| `assets/js/main.js` | Header state, mobile menu, scroll reveals, hero line animation, Insights filters |
| `assets/images/` | `logo-mark.png` (transparent logo used on the site), `logo.png` (original), `offshore.*` (generic industrial photo) |
| `articles/` | Majlis-hosted article PDFs |
| `flexcollect-sep25.pdf`, `assets/images/crude-oil-to-plastic-and-back-oct25.pdf` | Copies kept at the old site's PDF addresses so existing links keep working |
| `robots.txt`, `sitemap.xml` | Search-engine files |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

Shared header and footer markup is repeated in each page. When you change navigation, contact details or the footer, update all six HTML files.

## Preview locally

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765.

## Common edits

- **Add an article:** copy one `<article class="article-card">` block in `insights.html`, change the category label, title, link and summary, and set `data-category` to one of the filter values (`circular-economy`, `resource-recovery`, `technology-evaluation`, `energy-transition`, `commercial-structuring`). Put Majlis-hosted PDFs in `articles/`. The homepage shows three articles; edit that block in `index.html` separately.
- **Featured white paper:** when the approved PDF is ready, save it as `publications/bankable-recycling-infrastructure.pdf` and add the download link where the comment in `insights.html` indicates.
- **Team photos:** replace each `<div class="person-portrait"><span>XX</span></div>` with an `<img>` of a matched, approved headshot (4:5 crop).
- **Project status:** edit the `project-status` text in the `#projects` section of `index.html`. Use only the approved labels: Research & Evaluation, Under Development, Advisory Engagement, Commercial Discussions, Engineering Phase, Investment Preparation.

## Publish on GitHub Pages

1. Create a GitHub repository (for example `majlis-energy-website`) and push this folder to the `main` branch. Check that `context/` is not included.
2. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
3. Wait for the first deployment. The site is then available at `https://<your-username>.github.io/<repo-name>/`. The 404 page uses root paths, so its styling only appears once the custom domain is active.
4. Recommended: verify the domain under your GitHub account **Settings → Pages → Add a domain** before changing DNS. This stops anyone else claiming the domain on GitHub.

## Connect the UK2 domain

There is deliberately no `CNAME` file yet, so the site can be reviewed at the github.io address first (with a `CNAME` present, GitHub redirects that address to the custom domain, which still serves the old site). At cutover, add the domain in **Settings → Pages → Custom domain** (`www.majlisenergy.com`); GitHub then commits a `CNAME` file for you. If the site should use a different domain, also update the canonical/Open Graph/sitemap URLs in each page.

In the UK2 control panel, open DNS management for the domain and edit the records there. **Do not change the nameservers**, and **do not touch the MX, SPF/TXT, DKIM or other mail records**: they keep `info@majlisenergy.com` working.

Back up (screenshot or export) the current DNS records first, then:

| Type | Host / name | Value |
| --- | --- | --- |
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `AAAA` (optional) | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| `CNAME` | `www` | `<your-username>.github.io` |

Remove any existing `A`/`AAAA` records on `@` and any existing `www` record that point at the old host, otherwise traffic is split between the old and new sites.

After DNS propagates (minutes to 48 hours):

1. In **Settings → Pages**, enter `www.majlisenergy.com` as the custom domain and wait for the DNS check to pass.
2. Tick **Enforce HTTPS** once the certificate has been issued.
3. Check that `https://majlisenergy.com` redirects to `https://www.majlisenergy.com`, that pages and PDFs load, and that email still sends and receives.

Changing these records takes the current majlisenergy.com site offline and replaces it with this one, so make the change only after the new site has been reviewed and approved.
