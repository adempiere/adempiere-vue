<p align="center">
  <img width="320" src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Adempiere-logo.png">
</p>

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue version">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.15.3-brightgreen.svg" alt="element-ui">
  </a>
  <a href="https://hub.docker.com/r/erpya/adempiere-vue/">
    <img src="https://img.shields.io/docker/pulls/erpya/adempiere-vue.svg" alt="Docker Pulls">
  </a>
  <a href="https://github.com/adempiere/adempiere-vue/actions/workflows/publish.yml">
    <img src="https://github.com/adempiere/adempiere-vue/actions/workflows/publish.yml/badge.svg" alt="Publish GH Action">
  </a>
  <a href="https://github.com/adempiere/adempiere-vue/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-GNU/GPL%20(v3)-blue" alt="license">
  </a>
  <a href="https://github.com/adempiere/adempiere-vue/releases/latest">
    <img src="https://img.shields.io/github/release/adempiere/adempiere-vue.svg" alt="GitHub release">
  </a>
</p>

English | [Spanish](./README.es.md)

## Documentation

**[→ Read the documentation](./docs/README.md)**

Architecture, development setup, component reference, POS guide, debugging case studies, and more.

## Introduction

**adempiere-vue** is an additional browser-based GUI for [ADempiere ERP, CRM & SCM](https://github.com/adempiere/adempiere) — a modern Vue alternative to ADempiere's built-in ZK interface. It is based on [vue](https://github.com/vuejs/vue) and uses the UI toolkit [element-ui](https://github.com/ElemeFE/element).

![POS Image](docs/.vuepress/public/images/forms/point-of-sales/pos-en.png)

It is deployed as part of the [adempiere-ui-gateway](https://github.com/adempiere/adempiere-ui-gateway) Docker Compose stack, which serves the application files and routes API calls: nginx receives the request, Envoy translates it from HTTP/JSON to gRPC, and the ADempiere gRPC server executes the business logic against PostgreSQL. Once loaded, the application runs entirely in the browser.

## Getting started

1. Fork [adempiere/adempiere-vue](https://github.com/adempiere/adempiere-vue) on GitHub.
2. Clone your fork and install dependencies:

```bash
git clone https://github.com/<your-github-username>/adempiere-vue.git
cd adempiere-vue
yarn install
```

3. Add the upstream remote:

```bash
git remote add upstream https://github.com/adempiere/adempiere-vue.git
```

4. Configure the backend URL in `config/default.json` and start the dev server:

```bash
yarn dev
```

This opens `http://localhost:9527`. See the [Development Setup guide](./docs/adempiere/guide/essentials/dev-setup.md) for full instructions including backend configuration.

## Build

```bash
# build for test environment
yarn build:stage

# build for production environment
yarn build:prod
```

## Advanced

```bash
# preview the release environment effect
yarn preview

# preview the release environment effect + static resource analysis
yarn preview --report

# code format check
yarn lint

# code format check and auto fix
yarn lint --fix
```

Refer to the [Deploy documentation](./docs/framework/essentials/deploy.md) for more information.

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/adempiere/adempiere-vue/releases).

## Sponsors

<a href="http://erpya.com/">
  <img alt="ERP Consultores y Asociados" width="250px" src="https://erpya.com/wp-content/uploads/2017/11/ERP-logotipo-H-color.png" />
</a>
<br>
[Systemhaus Westfalia](http://westfalia-it.com/)
<br>
<a href="http://openupsolutions.com/">
  <img alt="OpenUp Solutions" width="250px" src="https://openupsolutions.com/wp-content/uploads/2021/08/logo-openup-horizontal.jpg" />
</a>

### Some Contributors

Thanks to all who have contributed. The following companies have supported development:

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="www.vdevsoft.com">
          <img
            src="https://user-images.githubusercontent.com/2333092/110265373-c2cafb00-7f91-11eb-84de-2aba7f2c2024.jpg"
            alt="vDevSoft"
            width="150"
          >
        </a>
      </td>
    </tr>
  </tbody>
</table>

## Browsers support

Modern browsers and Internet Explorer 10+

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions |

## License

[GNU/GPL v3](https://github.com/adempiere/adempiere-vue/blob/master/LICENSE)

## Previous License

[MIT](./PREVIOUS-LICENSE)

## Origins

This project was forked from [Vue-Element-Admin](https://github.com/PanJiaChen/vue-element-admin) by [PanJiaChen / 花裤衩](https://github.com/PanJiaChen) under [MIT license](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE) and relicensed to [GNU/GPL v3](https://github.com/adempiere/adempiere-vue/blob/master/LICENSE) by [Yamel Senih](https://github.com/yamelsenih).

- [Forked From](https://github.com/PanJiaChen/vue-element-admin)

## Initial Contributors

- [Yamel Senih](https://github.com/yamelsenih)
- [Raúl Muñoz](https://github.com/Raul-mz)
- [Edwin Betancourt](https://github.com/EdwinBetanc0urt)
- [Leonel Matos](https://github.com/leonel1524)
- [Elsio Sanchez](https://github.com/elsiosanchez)
