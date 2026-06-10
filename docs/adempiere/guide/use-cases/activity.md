# Activity

The component "**Activity**" is a change log that saves all the changes made in the window records, indicating the business partner who made the change, the field that was modified with its previous value and its value current, the exact date and time in which it was performed.

## ADempiere-ZK version

<video width="100%" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/activity/logs-zk.mp4')">
</video>

## ADempiere-Vue version

<video width="100%" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/activity/logs-vue.mp4')">
</video>

## Where it is located?

It is located in the second tab of the window displayed by the icon "**i**", located in the central right part of the ADempiere windows.

## What is it for?

It is used to consult the detailed information of the updates that are made to the ADempiere windows registers.

## Functions or Observations

::: tip
The detailed information of the changes is displayed by date and time according to user.
:::

## How is it used in the Desktop version?

In the desktop version, click on the icon "**i**", located in the central right part of the ADempiere windows, to view the window displayed by it and finally select the tab "**Activity**", to access all the changes made to the window's registry.

<video width="100%" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/activity/logs-vue.mp4')">
</video>

## Developer Options

The **Activity** panel is located in the icon on the right side of the navigation bar.

```bash
    └─ src                              # Main source code
        └── components                  # Global components
                └─ADempiere             # ADempiere specific components
                    └── containerInfo   # Record Information Container
                        └── recordLogs  # Record Logs
```

The **Activity** service consumption call can be found in the following path:

```bash
└─ src                      # Main source code.
    └─ api                  # Global services.
        └─ ADempiere        # Main directory of role services.
            └─ windows      # Main directory of role services.
```

The services called from the component are <br>
[POST /adempiere-api/logs/list-entity-logs](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-log.html#post-adempiere-api-logs-list-entity-logs)
