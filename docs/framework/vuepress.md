# How this documentation works

This documentation site is built with **VuePress** — a static site generator.
If you have never heard of VuePress, this page explains everything you need to know
to read, edit, and build the docs.

---

## Reading without VuePress

Every page in this documentation is a plain Markdown (`.md`) file. You can read
it directly — no tools required:

| How you open it                 | What works                                              | What does not render     |
| ------------------------------- | ------------------------------------------------------- | ------------------------ |
| VS Code (with Markdown Preview) | All text, headings, tables, code blocks, relative links | `$withBase()` image tags |
| GitHub (in the browser)         | All text, headings, tables, code blocks, relative links | `$withBase()` image tags |
| Any text editor                 | Raw Markdown source                                     | —                        |

**Relative links** between pages (e.g. `../../framework/vuepress.md`) resolve
correctly in VS Code preview and on GitHub because they point to actual files
relative to the current file's location.

**`$withBase()` images** are Vue template syntax processed only by VuePress.
They appear as raw HTML tags in plain viewers. To see those images rendered,
run the local preview server (see below).

---

## What VuePress is

VuePress takes a folder of plain Markdown (`.md`) files and turns them into a complete
HTML website — with a navigation bar, a sidebar, syntax-highlighted code blocks,
and search.

The output is a folder of static files (HTML, CSS, JS). Any web server can host them.
No database or server-side logic is needed at runtime.

---

## What each part of the `docs/` folder does

```
docs/
├── .vuepress/
│   ├── config.js        ← build configuration (nav, sidebar, site title)
│   ├── nav.js           ← top navigation bar items
│   └── public/          ← static assets (images, icons) copied as-is to the output
│
├── adempiere/           ← ADempiere-specific documentation (this is what you want to read)
│   └── guide/
│       ├── README.md    ← landing page for /adempiere/guide/
│       ├── components/
│       ├── forms/
│       └── use-cases/
│
└── framework/           ← Generic vue-element-admin framework docs (developer reference)
    ├── README.md        ← landing page for /framework/
    ├── essentials/
    └── advanced/
```

**Every `.md` file becomes a page.** A file at `docs/adempiere/guide/forms/point-of-sales.md`
becomes the URL `/adempiere/guide/forms/point-of-sales.html` in the built site.

**`config.js` is not a page.** It is JavaScript that VuePress executes only during the build.
It controls how pages are presented (which links appear in the sidebar, what the site is
called, etc.) but does not appear as readable content.

---

## How to preview the docs locally

You need [Node.js](https://nodejs.org/) and [yarn](https://yarnpkg.com/).

```bash
# from the docs/ directory (not the repo root)
cd docs
yarn install   # install VuePress and dependencies (first time only)
yarn dev       # start the local preview server
```

Open `http://localhost:8080` in a browser.
VuePress watches the files and refreshes the browser automatically when you save a change.

::: warning Node 17 and later
VuePress 0.14 uses webpack 4, which relies on an OpenSSL algorithm removed in Node 17.
If you see `ERR_OSSL_EVP_UNSUPPORTED` on startup, run:

```bash
NODE_OPTIONS=--openssl-legacy-provider yarn dev
```

To make this permanent, update the `dev` script in `docs/package.json`:

```json
"dev": "NODE_OPTIONS=--openssl-legacy-provider vuepress dev"
```

:::

::: tip
`config.js` changes (sidebar, nav) require restarting `yarn dev` to take effect.
Content changes in `.md` files reload automatically.
:::

---

## How to build the static site

```bash
# from the docs/ directory
NODE_OPTIONS=--openssl-legacy-provider yarn build
```

The output is written to `docs/.vuepress/dist/`. Copy that folder to any web server
or S3 bucket to publish the documentation.

---

## How to add a new page

1. Create a new `.md` file in the appropriate folder under `docs/`.
2. Write content in standard Markdown.
3. Add the file path to the sidebar in `docs/.vuepress/config.js`
   (inside the relevant `gen*Sidebar` function or sidebar array).
4. The page is immediately visible in `yarn docs:dev`.

---

## Markdown features available

VuePress supports standard Markdown plus a few extras:

**Tip / warning / danger blocks:**

```md
::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a danger note.
:::
```

**Embedding images from the `public/` folder:**

```md
<img :src="$withBase('/images/forms/point-of-sales/pos-en.png')" alt="POS form" width="800px">
```

Images placed in `docs/.vuepress/public/images/` are referenced with `$withBase('/images/...')`.
This ensures the path is correct regardless of where the site is deployed.

**Internal links:**

```md
See the [Point of Sale documentation](../adempiere/guide/forms/point-of-sales.md).
```

---

## Where the sidebar is configured

Open `docs/.vuepress/config.js`. The sidebar for each section is a key-value map:

```js
sidebar: {
  '/adempiere/guide/': [   // shown when browsing any page under /adempiere/guide/
    {
      title: 'Components',
      collapsable: true,
      children: [
        '/adempiere/guide/components/notes.md',
        '/adempiere/guide/components/activity.md',
        ...
      ]
    }
  ]
}
```

Adding a file to the sidebar array makes it appear in the left-hand navigation.
Removing it hides it from the sidebar (the page still exists and is accessible by direct URL).
