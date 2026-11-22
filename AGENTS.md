## Stack and key files

Astro builds static HTML from the WordPress REST API. GoDaddy cPanel serves the contents of `dist/` from `public_html/`.

- `src/lib/wp.js` owns all WordPress REST calls and pagination.
- `src/layouts/Base.astro` provides the shared page layout.
- `src/pages/` contains the homepage, CMS pages, blog, category listings, and 404 page.
- `public/.htaccess` configures Apache for the static deployment.
- `.github/workflows/deploy.yml` builds and uploads the site over FTPS.
- `wordpress/mu-plugins/trigger-deploy.php` is installed manually on WordPress.

Keep the existing file structure and style. Use static routes only, with no SSR, adapters, or API routes. Forms must submit to an external endpoint. Keep secrets out of source and logs. Explain any new dependency before adding it.

## Development

Run `npm ci` to install dependencies, `npm run build` to generate `dist/`, and `npm run preview` to preview the build.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
