### Report

## Open

### Menu Tree

Open a report from the menu tree:

1. Pull down the menu tree to **Manage Open Balances**.
2. Select the **Open Balances** report.

#### ZK Version:

<img :src="$withBase('/images/use-cases/report/open-menu-zk.gif')" alt="ZK Desktop" width="100%">

#### Vue Version:

<img :src="$withBase('/images/use-cases/report/open-menu-vue.gif')" alt="ZK Desktop" width="100%">

### Menu Browser

Open a report from the menu browser:

1. Pull down the menu tree.
2. In the search box at the top type **Open Balances**.
3. Select the report matching the result.

##### ZK Version:

<img :src="$withBase('/images/use-cases/report/open-search-menu.gif')" alt="ZK Desktop" width="100%">

##### Vue Version:

<img :src="$withBase('/images/use-cases/report/open-search-menu-vue.gif')" alt="ZK Desktop" width="100%">

### Recent Items

Open a report of recent items:

1. Locate the **Recent Items** dashboard.
2. Select any report or in case of using the quick search of the recent items table select the report matching the result.

##### ZK Version:

<img :src="$withBase('/images/use-cases/report/open-recient-item-zk.gif')" alt="ZK Desktop" width="100%">

##### Vue Version:

<img :src="$withBase('/images/use-cases/report/open-recient-item-vue.gif')" alt="ZK Desktop" width="100%">

### Relationships

Open a report from the same menu level relations:

ADempiere's ZK client does not have an equivalent feature.

### Steps to follow

1. Pull down the menu tree to **Manage Outstanding Balances**.
2. Select the **Open Balances to Date** report.
3. Pull down the list from the Relationship menu in the upper right hand side of the window.
4. Locate and select the **Open Balances** report.

#### Vue Version:

<img :src="$withBase('/images/use-cases/report/open-relations-vue.gif')" alt="ZK Desktop" width="100%">

### Re Open Report from the Process History

Open a report from the **Process History** with the executed parameters of the selected report.

Currently the ADempiere ZK client does not have an equivalent feature.

##### Vue version:

1. Locate in the menu tree in **Historical Processes** and open it.
2. Select any report with parameters **Balance in Bank**.

<img :src="$withBase('/images/use-cases/report/open-process-activity.gif')" alt="ZK Desktop" width="100%">

## Loading

### Parameters

The parameters (fields) of the processes must be loaded when opening in case the report handles parameters according to each type of visualization.

1. Open the **Open Balances** report.
2. Note the different types of parameters: String, Yes and No, Date, Amount, List, Table.

##### ZK Version:

<img :src="$withBase('/images/use-cases/report/carga-params.gif')" alt="ZK Desktop" width="100%">

##### Vue Version:

<img :src="$withBase('/images/use-cases/report/carga-params-vue.png')" alt="ZK Desktop" width="100%">

### Display

When loading all parameters with default value, or with mandatory are displayed on first load.

##### ZK Version:

Currently in the zk interface when opening a report in this case **Open Balances** loads all fields in the view.
<img :src="$withBase('/images/use-cases/report/carga-params-zk.gif')" alt="ZK Desktop" width="100%">

##### Vue Version:

In the ADempiere-Vue interface opening a report in this case **Open Balances** only shows the fields with default value, or with mandatory.
Thus creating a more pleasant and minimalistic view for the user.
<img :src="$withBase('/images/use-cases/report/carga-display.gif')" alt="ZK Desktop" width="100%">

### Mandatory

##### ZK Version:

1. Open the **Balance in Bank** report.
2. Mandatory fields show with a red asterisk (\*) on the right side of their name.
   <img :src="$withBase('/images/use-cases/report/carga-mandatory-zk.png')" alt="ZK Desktop" width="100%">

##### Vue Version:

1. Open the **Balance in Bank** report.
2. Mandatory fields show with a red asterisk (\*) to the right side of their name, and empty mandatory fields highlight with a red border above the field.
   <img :src="$withBase('/images/use-cases/report/carga-mandatory-vue.png')" alt="ZK Desktop" width="100%">

<!-- ### Read Only -->

### Default Value

Handle default value for different types of parameters.

##### Vue Version:

1. Open the **Payment Assignment** report.
2. Counter click on the parameter value and select **Preference Value**.
3. Note that the **Document Status** parameter has default value (CO = Complete).

<img :src="$withBase('/images/use-cases/report/carga-defaul-value-zk.gif')" alt="ZK Desktop" width="100%">

##### Vue Version:

1. Open the **Payment Assignment** report.
2. Click on the parameter name and select **Information** or **Preference**.
3. Note that the **Document Status** parameter has default value (CO = Complete).

<img :src="$withBase('/images/use-cases/report/carga-defaul-value-vue.gif')" alt="ZK Desktop" width="100%">

### Zoom in

In ADempiere you can currently access a window from a field that is in another field that is related, as shown below.

##### Vue version:

1. Open the **Payment Selection Detail** report.
2. Counter click on the **Charge** parameter and select **Find**.

<img :src="$withBase('/images/use-cases/report/carga-zoom-zk.gif')" alt="ZK Desktop" width="100%">

##### Vue Version:

1. Open the **Payment Selection Detail** report.
2. Counter click on the **Charge** parameter and select **Find**.

<img :src="$withBase('/images/use-cases/report/carga-zoom-vue.gif')" alt="ZK Desktop" width="100%">

## Execution

### Parameters

The parameters (fields) of the processes must be loaded when opening in case the report handles parameters according to each type of visualization.

1. Open the **Open Balances** report.
2. Note the different types of parameters: String, Yes and No, Date, Amount, List, Table.

##### ZK Version:

<img :src="$withBase('/images/use-cases/report/run/run-params-zk.gif')" alt="ZK Desktop" width="100%">

##### Vue Version:

<img :src="$withBase('/images/use-cases/report/run/run-params-vue.gif')" alt="ZK Desktop" width="100%">

### Validation

The following validations must be ensured in order to run a report:

- All required fields must have values.
- If it is a report associated to a window, it is not allowed to run on a new record.

##### Vue Version:

<img :src="$withBase('/images/use-cases/report/run/run-validation-vue.gif')" alt="ZK Desktop" width="100%">

### Execution

1. Pull down the menu tree to **Pending Balance Management**.
2. Select the **Open Balances** report.
3. Fill in the fields.
4. Execute in the actions menu.

##### Vue Version:

<img :src="$withBase('/images/use-cases/report/run/run-validation-vue.gif')" alt="ZK Desktop" width="100%">

### Run from Window

Currently in the ADempiere-Vue version you can run reports.

1. Open the **Documents Receivable** window.
2. Go to the Actions menu and expand the list.
3. Select the **Print Invoice** Option.

##### Vue Version:

<img :src="$withBase('/images/use-cases/report/run/open-windows.gif')" alt="ZK Desktop" width="100%">

### Download

Currently in the ADempiere ZK interface if you run a report in PDF format and you need to download it in EXCEL you must re-run the report in EXCEL format and then click on the download option.

In the ADempiere-Vue interface if you run a report in HTML and you need to download it, it is not necessary to re-run the report in the format you want to download. At the bottom of the report title positioned to the left you have the option to download it in any type of format.

##### ZK version:

<img :src="$withBase('/images/use-cases/report/run/run-download-zk.gif')" alt="ZK Desktop" width="100%">

##### Vue Version:

<img :src="$withBase('/images/use-cases/report/run/run-download-vue.gif')" alt="ZK Desktop" width="100%">

### Change Parameters

Currently in the ADempiere ZK interface it is not possible to change parameters in the report viewer container.

##### Vue Version:

<img :src="$withBase('/images/use-cases/report/run/run-download-vue.gif')" alt="ZK Desktop" width="100%">

### Change Print Format

It is required that from the report viewer you can change the print format to generate a new report.

##### ZK Version:

<img :src="$withBase('/images/use-cases/report/run/run-print-format-zk.gif')" alt="ZK Desktop" width="100%">

##### Vue Version:

<img :src="$withBase('/images/use-cases/report/run/run-print-format-vue.gif')" alt="ZK Desktop" width="100%">

#### Change File Extension

It is required that from the report viewer you can change the file extension to generate new report.

##### ZK Version:

<img :src="$withBase('/images/use-cases/report/run/run-change-file-extension-zk.gif')" alt="ZK Desktop" width="100%">

##### Vue Version:

<img :src="$withBase('/images/use-cases/report/run/run/run-change-file-extension-vue.gif')" alt="ZK Desktop" width="100%">

### Drill Down

It is required that from the report viewer you can change Report View to generate new report.

##### ZK Version:

<img :src="$withBase('/images/use-cases/report/run/run-drill-down-zk.gif')" alt="ZK Desktop" width="100%">

##### Vue Version:

<img :src="$withBase('/images/use-cases/report/run/run-drill-down-vue.gif')" alt="ZK Desktop" width="100%">
