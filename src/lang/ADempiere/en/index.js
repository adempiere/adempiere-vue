
import actionMenu from './actionMenu'
import extensionFile from './extensionFile'
import fieldDisplayOptions from './fieldDisplayOptions'
import fieldOptions from './fieldOptions'
import recordManager from './recordManager'
import window from './window'

export default {
  actionMenu,
  extensionFile,
  fieldDisplayOptions,
  fieldOptions,
  recordManager,

  language: 'Language',
  route: {
    dashboard: 'Dashboard',
    calendar: 'Calendar',
    documentation: 'Documentation',
    guide: 'Guide',
    forgotPassword: 'Forgot Password?',
    userEnrollment: 'Check in',
    page401: '401',
    page404: '404',
    profile: 'Profile',
    ProcessActivity: 'Process Logs',
    withoutLog: 'No Error Log Found',
    ProductInfo: 'Product Information',
    role: 'Role',
    organization: 'Organization',
    warehouse: 'Warehouse',
    reportViewer: 'Report Viewer',
    PriceChecking: 'Price checking'
  },
  notifications: {
    // simplex
    completed: 'Completed',
    loading: 'Loading',
    succesful: ' Successful ',
    error: ' Error ',
    opened: 'Opened',
    totalProcess: 'Total Processor Records ',
    // search
    searching: 'Searching records on the server',
    succcessSearch: 'The search has been made',
    searchWithOutRecords: 'The search ended without results',
    errorSearch: 'The search has not been completed',
    // process
    processing: 'Processing',
    processExecuted: 'Executed, see process logs',
    processError: 'Was not executed',
    //
    emptyValues: 'Parameter(s) empty value',
    fieldCannotBeEmpty: 'The field value cannot be empty.',
    fieldMandatory: 'The field is mandatory',
    requestError: 'Error executing the request',
    successChangeRole: 'The role has been changed',
    errorChangeRole: 'The role has not been changed',
    copySuccessful: 'Copied',
    copyUnsuccessful: 'Error, unable to copy',
    actionToTake: 'Action to Take',
    mandatoryFieldMissing: 'Missing fill in the fields ',
    updateFields: 'The record is updated with the field ',
    updateSuccessfully: 'Successfully made changes',
    invalidEmailFormat: 'Invalid email format',
    recordLocked: 'This record has been locked',
    recordUnlocked: 'This record has been unlocked',
    noRoleAccess: 'With your current role and settings, you cannot view this information.',
    errorPointOfSale: 'No point of sale selected',
    emptyPos: 'This User has no Assigned POS Terminal'
  },
  navbar: {
    badge: {
      Notifications: 'Notifications',
      activity: 'Worflow for Approval',
      link: 'Go to Procces Logs'
    },
    dashboard: 'Dashboard',
    github: 'Github',
    logOut: 'Log Out',
    profile: 'Profile',
    theme: 'Theme',
    size: 'Global Size'
  },
  login: {
    noValidUser: 'Please enter the correct user name',
    noValidPassword: 'The password can not be empty',
    invalidLogin: 'User Id or Password invalid',
    unexpectedError: 'An unexpected error has occurred, try again',
    capsLock: 'Caps lock is On',
    title: 'Login Form',
    submit: 'Submit',
    logIn: 'Login',
    name: 'Name',
    lastName: 'Last name',
    eMail: 'Email',
    userName: 'User name',
    userNameOrEmail: 'User name or Email',
    userEnrollment: 'Enrollment user',
    userEnrollmentSuccessful: 'Successful user enrollment, check your email',
    passwordResetSendLink: 'The link to reset the password was sent to the email ',
    password: 'Password',
    passwordNew: 'New password',
    passwordConfirm: 'Password confirm',
    passwordConfirmNew: 'New password confirm',
    any: 'any',
    thirdparty: 'Or connect with',
    thirdpartyTips: 'Can not be simulated on local, so please combine you own business simulation.',
    invalidToken: 'The token used is invalid.',
    passwordReset: 'Password Reset',
    createPassword: 'Create password',
    passwordResetSuccessful: 'Password reset was successful',
    passwordAndConfirmNotMatch: 'The new password and your confirmation do not match.'
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository',
    releases: 'Releases',
    branches: 'Branches',
    code: 'Code',
    issues: 'Issues',
    downloadZip: 'Download Zip',
    releaseNotes: 'Release Notes',
    goRepository: 'go to repository',
    seeDocumentation: 'See documentation'
  },
  permission: {
    addRole: 'New Role',
    editPermission: 'Edit',
    roles: 'Your roles',
    switchRoles: 'Switch roles',
    tips: 'In some cases, using v-permission will have no effect. For example: Element-UI  el-tab or el-table-column and other scenes that dynamically render dom. You can only do this with v-if.',
    delete: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel'
  },
  guide: {
    description: 'The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. Demo is based on ',
    button: 'Show Guide'
  },
  components: {
    date: {
      Today: 'Today',
      Yesterday: 'Yesterday',
      Week: 'Last week',
      LastMonth: 'Last month',
      CurrentMonth: 'The current month'
    },
    documentation: 'Documentation',
    binaryButton: 'Upload file',
    binaryTip: 'Only files with a size smaller than 500kb',
    imageError: 'The image exceeds 2MB and does not comply with the valid formats!',
    contextMenuActions: 'Actions',
    contextMenuReferences: 'References',
    ExportTo: 'Export to',
    contextMenuDownload: 'Download',
    dateStartPlaceholder: 'Start date',
    dateEndPlaceholder: 'End date',
    timePlaceholder: 'Select time',
    dialogCancelButton: 'Cancel',
    dialogConfirmButton: 'Confirm',
    filterableItems: 'Optional Columns',
    fixedleItems: 'Fixed Columns',
    resetAllFilters: 'Reset all filters',
    switchActiveText: 'Yes',
    switchInactiveText: 'Not',
    contextFieldTitle: 'Context Information'
  },
  grid: {
    recordAccess: {
      accessGranted: 'Access granted for roles'
    }
  },
  views: {
    browser: 'Smart Browser',
    smartBrowser: 'Smart Browser',
    process: 'Process',
    window: 'Window',
    report: 'Report',
    workflow: 'Workflow',
    task: 'Task',
    form: 'Form',
    noProcess: 'Not process running',
    logs: 'Summary',
    log: 'Summary',
    seeReport: 'See Report',
    summary: 'Summary',
    viewsHelp: 'Help',
    searchCriteria: 'Search Criteria',
    unsupportedSorry: 'Sorry',
    unsupportedHeadline: 'This view is currently unavailable',
    unsupportedInfo: 'Please check that the view is supported in this version, or click the button below to return to the homepage.',
    unsupportedButton: 'Back to dashboard',
    reportView: 'Report Views',
    printFormat: 'Print Formats',
    drillTable: 'Drill Down'
  },
  table: {
    ProcessActivity: {
      Name: 'Name',
      zoomIn: 'Zoom in',
      Description: 'Description',
      actions: 'Action',
      complete: 'Complete',
      error: 'Error',
      status: 'Status',
      Logs: 'Summary',
      summary: 'Summary',
      Help: 'Help',
      FileName: 'FileName',
      Output: 'Output'
    },
    dataTable: {
      search: 'Search',
      selected: 'Selected',
      deleteSelection: 'Delete Selected Records',
      advancedQuery: 'Advanced Query',
      exportZip: 'Export Zip',
      showAllColumns: 'Show All Columns',
      showOnlyMandatoryColumns: 'Show Only Mandatory Columns',
      showTableColumnsOnly: 'Show Table Columns Only',
      showAllAvailableColumns: 'Show All Available Columns',
      exportRecordTable: 'Export Selected Records',
      showTotal: 'Show Totals',
      hiddenTotal: 'Hidden Totals'
    },
    recentItems: {
      search: 'Filter by name, description or date',
      date: 'Date',
      name: 'Name',
      description: 'Description'
    }
  },
  example: {
    warning: 'Creating and editing pages cannot be cached by keep-alive because keep-alive include does not currently support caching based on routes, so it is currently cached based on component name. If you want to achieve a similar caching effect, you can use a browser caching scheme such as localStorage. Or do not use keep-alive include to cache all pages directly. See details'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Document introduction'
  },
  excel: {
    export: 'Export',
    selectedExport: 'Export Selected Items',
    placeholder: 'Please enter the file name (default excel-list)'
  },
  zip: {
    export: 'Export',
    placeholder: 'Please enter the file name (default file)'
  },
  pdf: {
    tips: 'Here we use window.print() to implement the feature of downloading PDF.'
  },
  theme: {
    change: 'Change Theme',
    documentation: 'Theme documentation',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All',
    newRecord: 'New Record',
    seeRecord: 'See Record',
    advancedQuery: 'Advanced Query'
  },
  settings: {
    title: 'setting',
    theme: 'Theme Color',
    tagsView: 'Open Tags-View',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Sidebar Logo',
    showContextMenu: 'Show Context Information',
    isShowTitle: 'Show Títle',
    isShowMenu: 'Show Menu'
  },
  profile: {
    aboutMe: 'About Me',
    recentItems: 'Recent Items',
    favorites: 'Favorites',
    PendingDocuments: 'Pending Documents',
    recentItemsName: 'Name Recent Items',
    role: 'Role',
    availableRoles: 'Available roles',
    currentRole: 'Current role',
    clientName: 'Client name',
    description: 'Description',
    changeRole: 'Change role',
    changeLanguage: 'Change language',
    changeLanguagePlaceholder: 'Choose a language'
  },
  window,
  field: {
    field: 'Field',
    info: 'Information',
    calculator: 'Calculator',
    preference: 'Preference',
    logsField: 'Field Change Log',
    logsFieldEmpty: 'The field is still unchanged',
    contextInfo: 'Context Info',
    container: {
      help: 'Help',
      description: 'Description'
    }
  },
  data: {
    createRecordSuccessful: 'New record created successfully',
    createNewRecord: 'Mode New record',
    createRecordError: 'Error creating new record',
    deleteRecordSuccessful: 'Record deleted successfully',
    deleteRecordError: 'Error deleting record',
    exportRecord: 'Export Record',
    noDescription: 'No Description',
    addDescription: 'Add Description',
    recordAccess: {
      modeMobile: {
        accessRoles: 'Access Roles',
        accessRolesIsReadonly: 'Roles with Access and Read Only',
        lockedRoles: 'Locked Roles',
        lockedRolesIsDependentEntities: 'Locked Roles with Dependent Entities'
      },
      actions: 'Record Access',
      configRoles: 'Roles Configurados',
      availableRoles: 'Roles Configured',
      isReadonly: 'Reading Only',
      isDependentEntities: 'Dependent Entities',
      isLock: 'Block',
      isUnlock: 'Unblock',
      isError: 'Error on '
    },
    selectionRequired: 'You must select a record',
    undo: 'Undo',
    notification: {
      lockRecord: 'The Registry was Locked',
      unlockRecord: 'Registry was Unlocked'
    },
    addNote: 'Add Note',
    emptyNote: 'Este registro no posee ninguna nota',
    descriptionNote: 'Add Note or Comment to Record'
  },
  sequence: {
    available: 'Available',
    sequence: 'Sequence'
  },
  operators: {
    compareSearch: 'Compare the Search',
    operator: 'Comparison operator',
    EQUAL: 'Equal to "="',
    NOT_EQUAL: 'Not equal to "<>"',
    LIKE: 'Like "~"',
    NOT_LIKE: 'Not like "!~"',
    GREATER: 'Greater than ">"',
    GREATER_EQUAL: 'Greater than equal to ">="',
    LESS: 'Less than "<"',
    LESS_EQUAL: 'Less than equal to "<="',
    BETWEEN: 'Between ">-<"',
    NOT_NULL: 'Is not null',
    NULL: 'Is null',
    IN: 'Include "()"',
    NOT_IN: 'Not include "!()"'
  },
  quickAccess: {
    newRecord: 'Quick Access to Create New Record',
    listRecords: 'Quick Access to List All Records',
    searchWithEnter: 'Press enter to search for the product by Product Code, Name or UPC.'
  },
  businessPartner: {
    notFound: 'Business partner not found.',
    emptyBusinessPartner: 'Use the filters to search for a business partner by Code, Name, Email and Phone Number'
  },
  form: {
    pos: {
      title: 'POS',
      priceList: 'Price List',
      releaseOrder: 'Release It',
      applyDiscountOnOrder: 'Apply Discount Based on Amount',
      fieldDiscountAmount: 'Discount Amount',
      salesDiscountOff: 'Apply Discount on Sale',
      discountRate: '% Descuent',
      optionsPoinSales: {
        title: 'Quick Point of Sales Options',
        emptyAvailablePaymentMethodsRefudn: 'This Terminal does not have a Payment Method configured to allow Pending Refund',
        emptyAvailablePaymentMethods: 'This Terminal does not have a Payment Method configured to allow Refund',
        emptyListCashSummary: 'There is no cash movement',
        salesOrder: {
          title: 'Sale Order',
          newOrder: 'New Order',
          ordersHistory: 'Orders History',
          generateImmediateInvoice: 'Generate Immediate Invoice',
          completePreparedOrder: 'Complete Prepared Order',
          cancelSaleTransaction: 'Cancel Sale Transaction',
          createPos: 'Create Point of Sale Withdrawal',
          print: 'Print Document',
          cancelOrder: 'Cancel Order',
          orderRemoved: 'Order Deleted',
          copyOrder: 'Copy Order',
          createNewReturnOrder: 'Create a new return order',
          confirmDelivery: 'Confirm Delivery',
          emptyProductDelivery: 'Product not in Order'
        },
        cashManagement: {
          title: 'Cash Management',
          cashOpening: 'Cash Opening',
          closeBox: 'Close the box',
          assignSeller: 'Assign seller',
          unassignSeller: 'Unassign Seller',
          transfer: 'Transfer',
          moneyIncome: 'Money Income',
          cashOpenBox: 'Cashbox Opened',
          cashwithdrawal: 'Cash Withdrawal',
          successfulCashWithdrawal: 'Cash withdrawal successful',
          cashCloseBox: 'Cashbox Closed'
        },
        generalOptions: {
          title: 'General Options',
          changePos: 'Change Point of Sale',
          listProducts: 'Change Point of Sale',
          changeWarehouseList: 'Change Warehouse',
          changePriceList: 'Change Price List',
          dateTo: 'Date To',
          dateOrder: 'Date Order',
          dateFrom: 'Date From'
        }
      },
      generalNotifications: {
        orderReleased: 'Order was released: ',
        selectedOrder: 'Selected Order: '
      },
      tableProduct: {
        product: 'Product',
        quantity: 'Quantity',
        options: 'Options',
        editQuantities: 'Edit Quantities',
        pin: 'Insert Pin',
        remove: 'Remove',
        taxAmount: 'Tax',
        taxRate: '% Imp',
        displayDiscountAmount: 'Discount',
        empty: 'Enter the product name, code or UPC'
      },
      order: {
        order: 'Order',
        seller: 'Seller',
        date: 'Date',
        subTotal: 'Sub-Total',
        type: 'Type',
        discount: '% Dcto',
        tax: 'Tax',
        total: 'Total',
        itemQuantity: 'Item Quantity',
        numberLines: 'Number of Lines',
        pointSale: 'Point of Sale',
        collect: 'Collect',
        collections: 'Cobros',
        campaign: 'Campaign',
        noCampaignSelected: 'No Campaign selected',
        BusinessPartnerCreate: {
          phone: 'Phone',
          businessPartner: 'Business Partner',
          successfullyCreated: 'Business Partner Successfully Created',
          customerData: 'Customer Data',
          addBillingAddress: 'Add Billing Address',
          billingAddress: 'Billing Address',
          shippingAddress: 'Shipping Address',
          withoutSetting: 'Sin Establecer',
          taxId: 'Tax Identification',
          address: {
            edit: 'Edit',
            selectAddress: 'Select Address',
            saveAddress: 'Save Address',
            addNewAddress: 'Add New Address',
            editAddress: 'Edit Address',
            billingAddress: 'Billing Address',
            shippingAddress: 'Shipping Address',
            managementDescription: 'Address Description',
            addressType: 'Address Type',
            region: 'Region',
            city: 'City',
            address: 'Address',
            postCode: 'Post Code'
          }
        }
      },
      collect: {
        orderTotal: 'Order Total',
        pending: 'Pending',
        payment: 'Payment',
        change: 'Change',
        totalInvoiced: 'Total Invoiced',
        convertAmount: 'Convert Quantity',
        convertedAmount: 'Converted',
        fullPayment: 'Full Payment',
        dayRate: 'Day Rate',
        noDayRate: 'No daily rate has been generated for the currency.',
        refund: 'Refund',
        paymentMethods: 'Payment Methods',
        emptyRate: 'No conversion rate to date',
        Currency: 'Currency',
        TenderType: {
          directDeposit: 'Direct Deposit',
          creditCard: 'Credit Card',
          directDebit: 'Direct Debit',
          check: 'Check',
          creditNote: 'Credit Note',
          mobilePayment: 'Interbank mobile payment',
          account: 'Account',
          cash: 'Cash',
          zelle: 'Zelle'
        },
        overdrawnInvoice: {
          title: 'OverdrawnInvoice',
          below: 'Invoice will remain with an open balance',
          above: 'Customer Details',
          returned: 'Your change is',
          coupon: 'Generate a Gift Card or Vale',
          returnMoney: 'Return money in another form of payment',
          adjustDocument: 'You want to Adjust Document',
          dailyLimit: 'Daily Limit',
          customerLimit: 'Order Limit',
          available: 'Available',
          emptyPayment: 'Unsupported payment method',
          emptyListPayment: 'You do not have any payment method associated with this option',
          addPayment: 'You must add a change type to complete the operation',
          amountLimitOrder: 'Amount greater than the limit of the Order',
          incompleteChange: 'Incomplete Change',
          fieldList: {
            code: 'Cedula',
            name: 'Holder Name',
            accountType: 'Account Type',
            bank: 'Bank'
          }
        }
      },
      keyLayout: {
        noProducto: 'Product not Avilable'
      },
      pinMessage: {
        pin: 'Enter Pin for ',
        documentType: 'change document type',
        warehouse: 'change warehouse',
        price: 'change price',
        qtyEntered: 'change quantity',
        priceList: 'change price list',
        discount: 'add discount',
        delete: 'delete product',
        addProduct: 'add product',
        invoiceOpen: 'generate invoice with an open balance',
        newOrder: 'create new order'
      }
    },
    priceChecking: {
      productNotFound: 'Unavailable Product',
      basePrice: 'Base price'
    },
    byInvoice: {
      title: 'Aisle Vendor Orders to be Invoiced',
      searchCompleteOrders: 'Search complete orders',
      label: 'To be invoiced',
      toDeliver: 'To be delivered',
      toCollect: 'Receivable',
      salesRepresentative: 'Sales Agent',
      onlyAllocated: 'Only allocated to current point of sales',
      businessPartner: 'Business Partner',
      copyShippingAddress: 'Copy shipping address',
      documentNo: 'Document No.',
      emptyList: 'Use the filters to search for orders'
    },
    productInfo: {
      product: 'Product',
      codeProduct: 'Códe Product',
      productInformation: 'Product Information',
      chargerInformation: 'Charger Information',
      code: 'Code',
      name: 'Name',
      lastName: 'Nombre2',
      id: 'ID',
      description: 'Description',
      price: 'Price',
      quantityOnHand: 'Quantity On Hand',
      taxAmount: 'Tax Amount',
      totalIncludingTax: 'Total Including Tax',
      grandTotal: 'Grand Total',
      grandTotalConverted: 'Grand Total Converted',
      quantityAvailable: 'Available',
      upc: 'UPC / EAN',
      UM: 'UM'
    },
    guideSteps: {
      productValue: {
        description: 'Search for the product by Product Code, Name or UPC'
      },
      businessPartner: {
        description: 'Show Business Partner Information'
      },
      linesTable: {
        title: 'Order Lines',
        description: 'Order Product Listing'
      },
      buttonPanelLeftPos: {
        title: 'Show Left Panel',
        description: 'Display the Point of Sale Options panel'
      },
      point: {
        description: 'Current point of sale information'
      },
      buttonPanelRightPos: {
        title: 'Show Right Panel',
        description: 'Displays the catalog panel'
      },
      fieldListCollection: {
        title: 'Collection Fields',
        description: 'Field Group which has. Amount, Currency, Payment Type, Bank, Reference No. and Date'
      },
      buttonCollection: {
        title: 'Collection Tools',
        description: 'Composed of a set of buttons that allows you to add, delete and process'
      },
      cardCollection: {
        title: 'Payment Panel',
        description: 'In this panel you can see a list with the cards of the added payments'
      },
      infoInvoce: {
        title: 'Invoice Detail',
        description: 'Invoice information with total amount, pending, change'
      },
      toolsPoint: {
        title: 'Point of Sale Tools'
      }
    },
    activity: {
      title: 'Your Workflow Activities',
      filtersSearch: {
        history: 'History records',
        forward: 'Re-send'
      },
      table: {
        priority: 'Priority',
        node: 'Node'
      },
      workflow: {
        title: 'Workflow',
        description: 'Workflow life cycle diagram. The highlighted Node is the one currently awaiting verification.'
      },
      workflowLogs: {
        title: 'Change Log',
        description: 'Workflow timeline'
      }
    },
    match: {
      title: {
        invoice: 'Invoice',
        deliveryReceipt: 'Delivery / Receipt'
      },
      description: {
        searchCriteria: 'Select a Business Partner to check the pending documents to be assigned',
        invoice: 'Select an Invoice to assign the corresponding Delivery/Receipt to',
        deliveryReceipt: 'Select at least one Delivery/Receipt to which you require to assign the selected invoice'
      },
      field: {
        toAssigned: 'To be Assigned',
        assigning: 'Assigning',
        difference: 'Difference'
      },
      filtersSearch: {
        sameBusinessPartner: 'Same Business Partner',
        sameProduct: 'Same Product ',
        sameQuantity: 'SameQuantity '
      },
      table: {
        nrDocument: 'Nr Document'
      }
    },
    weight: 'Weight'
  }
}
