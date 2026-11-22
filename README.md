# Wominjeka Australia

Astro generates the static site from the WordPress REST API. GoDaddy cPanel serves the contents of `dist/` from `public_html/`.

## Local setup

Use Node 22.23.4 or later. Copy `.env.example` to `.env` and set `WP_URL` to the WordPress installation's base URL, including its subdirectory if applicable. Astro appends `/wp-json/wp/v2`. The build needs access to the public posts, pages, and categories endpoints.

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the locked dependencies |
| `npm run dev -- --background` | Start Astro in the background |
| `npm run astro -- dev status` | Check the background dev server |
| `npm run astro -- dev logs` | Inspect its logs |
| `npm run astro -- dev stop` | Stop the background dev server |
| `npm run build` | Generate the static files in `dist/` |
| `npm run preview` | Serve the local build for preview |

If the WordPress page slug is `home`, the homepage displays its content. Published pages and posts also get routes based on their WordPress slugs.

## GitHub deployment

In the repository, open **Settings → Secrets and variables → Actions** and add these repository secrets.

| Secret | Value |
| --- | --- |
| `WP_URL` | The WordPress installation's base URL |
| `FTP_HOST` | The cPanel FTPS hostname |
| `FTP_USER` | The cPanel FTP account username |
| `FTP_PASS` | The FTP account password |

The FTP account must see the staging site's document root at `./public_html/` from its login directory. Confirm that mapping in cPanel before running the workflow. For a manual upload, copy the contents of `dist/`, including the hidden `.htaccess`, into the same document root. If it already contains an `.htaccess`, merge the Astro directives with the existing configuration before the first upload.

The workflow runs on pushes to `main`, on `wp-publish` dispatches, and from **Actions → Deploy static site → Run workflow**.

## WordPress publish hook

1. Create a fine-grained GitHub personal access token scoped to `lodayamayank/wominjeka-australia` with repository **Contents: Read and write** for repository dispatch.
2. Add `define( 'GITHUB_DEPLOY_TOKEN', 'paste-token-here' );` to the WordPress server's `wp-config.php` before WordPress loads settings.
3. Upload `wordpress/mu-plugins/trigger-deploy.php` directly into `wp-content/mu-plugins/` on the WordPress server.
4. Publish or unpublish a post and check the repository's **Actions** tab for a new run. Run the workflow manually after editing a published post or changing a page or category when its status does not trigger the hook.
