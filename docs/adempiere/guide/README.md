# ADempiere Vue — Documentation

**adempiere-vue** is the modern Vue-based UI for [ADempiere ERP](https://github.com/adempiere/adempiere)
(Enterprise Resource Planning — a system covering accounting, inventory, sales, purchasing, and manufacturing).
It communicates with the ADempiere backend exclusively via gRPC (Google Remote Procedure Call), proxied through Envoy and nginx
(see the [adempiere-ui-gateway](https://github.com/Systemhaus-Westfalia/adempiere-ui-gateway) for the full stack).

Throughout this documentation, **ZK** refers to ADempiere's previous browser-based UI
(built on the ZK Framework). Screenshots labelled "ZK version" show the equivalent
feature in that older interface for comparison.

<img :src="$withBase('/images/forms/point-of-sales/pos-en.png')" alt="ADempiere Vue — Point of Sale" width="900px">

---

## What is documented here

| Section        | Content                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------- |
| **Components** | ADempiere-specific UI components: Activity, Notes, Process, Reports, Smart Browser, Workflows |
| **Forms**      | Full-screen ADempiere forms: Point of Sale, Check Price, Product Information                  |
| **Use Cases**  | Step-by-step walkthroughs for Windows, Smart Browsers, Processes, Reports                     |

---

## Framework documentation

Developer reference for the underlying vue-element-admin framework
(routing, permissions, build, environment variables, advanced topics) is in the
[Framework section](../../framework/).

New to VuePress (the tool that builds this documentation site)?
See [How this documentation works](../../framework/vuepress.md).
