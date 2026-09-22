# Mrao Media: Cloudflare Pages and Decap Turbo

The site remains Jekyll with the existing HTML/CSS design. Content lives in GitHub;
Cloudflare builds the public site; `/admin/` is the Decap content editor.

## Cloudflare Pages

Connect `jcg2147/mraomedia` using **Pages → Import an existing Git repository**.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework | Jekyll |
| Root directory | Repository root |
| Build command | `bundle exec jekyll build` |
| Output directory | `_site` |
| Environment variable | `JEKYLL_ENV=production` |
| Ruby version | `RUBY_VERSION=3.3.10` (also pinned in `.ruby-version`) |

The Gemfile supplies Jekyll. Cloudflare installs its dependencies before building.
Before this pull request is merged, use `codex/cloudflare-decap-cms` as the initial
Cloudflare project branch to preview the migration. After merging, change the
Cloudflare production branch to `main`. Do not use the CMS to publish from that
initial preview: its configured target is `main`, which receives the content files
when the pull request is merged.
Keep GitHub Pages active while reviewing the first `pages.dev` deployment.
Check Home, About, Services, Portfolio, Contact, mobile layouts, role filters,
the featured carousel, and contact form delivery before switching DNS.

Add `mraomedia.com` and `www.mraomedia.com` under the Pages project's Custom domains.
Complete Cloudflare's domain verification and DNS instructions; preserve email/MX
and other unrelated records. The existing CNAME file is retained for GitHub Pages
but excluded from the Cloudflare build. Only disable GitHub Pages after the custom
domain works on Cloudflare. Cloudflare redirects old `.html` page links to clean URLs.

## Decap Turbo

1. Connect Turbo's GitHub App to `jcg2147/mraomedia`.
2. Create a Turbo site with repo `jcg2147/mraomedia`, branch `main`, and config path
   `admin/config.yml`.
3. Register the actual admin URLs: `https://mraomedia.com/admin/`,
   `https://www.mraomedia.com/admin/`, and your assigned
   `https://YOUR-PROJECT.pages.dev/admin/` while testing.
4. This checkout is configured with Site ID `2b2fca46-b1c4-48f3-b270-f5141f968e46`.
   The Site ID is public configuration, not a secret. No GitHub token belongs in this repo.
5. Invite Sabrina with access to this site and its Portfolio and Website text collections.
6. Open `/admin/`, log in with Turbo, publish a small text edit, and confirm it creates
   a GitHub commit and a successful Cloudflare deployment. Restore the text afterwards.

Turbo currently requires the beta CMS release; `admin/index.html` pins it to
`3.17.0-beta.0`. Test upgrades before changing the version. Saving publishes directly to `main`.
On a staging branch, change `backend.branch` to that branch before testing edits;
a preview URL alone does not change which branch the CMS writes to.

## Editing guide for Sabrina

- Open `/admin/` and choose **Login with Turbo**.
- Choose **Website text** for the homepage, About, Services, or shared Contact section.
  Enter ordinary text; HTML is not needed. Editing the three service descriptions
  updates both the homepage and Services page.
- Choose **Portfolio → Portfolio videos** to edit the video list. Add an entry,
  paste a YouTube link, enter a title and description, choose your roles, and select
  **Horizontal (16:9)** or **Vertical / Shorts (9:16)**.
- Drag entries to reorder them. The first three appear in Latest Projects. Turn on
  **Featured** for videos you want in the portfolio carousel.
- Optional start/end times are in seconds. Parameters in pasted share links are
  ignored; use these fields to control the excerpt. Videos must allow embedding.
- **Portfolio headings and showreel** controls the top reel and section headings.
- Publish, wait for the Cloudflare deployment, then refresh the public page.
  A successful save is not yet a finished deployment.

Video files are hosted on YouTube. There is no video upload field.

## Local verification

With Ruby and Bundler installed:

```sh
bundle install
bundle exec ruby tests/site_test.rb
bundle exec jekyll build --trace
bundle exec jekyll serve
```

The tests cover link formats, portrait/landscape markup, featured selection,
text escaping, editable data fields, existing entries, and complete page rendering.

Sources: [Cloudflare Jekyll setup](https://developers.cloudflare.com/pages/framework-guides/deploy-a-jekyll-site/),
[Turbo connection setup](https://decapcms.org/docs/turbo-connecting-a-site/).
