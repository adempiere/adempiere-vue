
import actionMenu from './actionMenu'
import fieldDisplayOptions from './fieldDisplayOptions'
import fieldOptions from './fieldOptions'
import recordManager from './recordManager'
import window from './window'

export default {
  actionMenu,
  fieldDisplayOptions,
  fieldOptions,
  recordManager,

  language: 'Idioma',
  route: {
    dashboard: 'Panel de control',
    documentation: 'Documentación',
    calendar: 'Calendario',
    forgotPassword: '¿Olvidó su Contraseña?',
    userEnrollment: 'Registrarse',
    guide: 'Guía',
    page401: '401',
    page404: '404',
    profile: 'Perfil',
    ProcessActivity: 'Histórico Procesos',
    withoutLog: 'No se Encontró Registro de Error ',
    ProductInfo: 'Información de Producto',
    role: 'Rol',
    organization: 'Organización',
    warehouse: 'Almacén',
    reportViewer: 'Visor de Reportes',
    PriceChecking: 'Consulta del precio'
  },
  notifications: {
    // simplex
    completed: 'Completado',
    loading: 'Cargando',
    succesful: ' Exitoso ',
    error: ' Error ',
    opened: 'Abierto',
    totalProcess: 'Total de Registros Procesador ',
    // search
    searching: 'Buscando registros en el servidor',
    succcessSearch: 'La búsqueda se ha realizado',
    searchWithOutRecords: 'La búsqueda finalizo sin resultados',
    errorSearch: 'La búsqueda no se ha completado.',
    // process
    processing: 'Procesando',
    processExecuted: 'Ejecutado, ver histórico de procesos',
    processError: 'No fue ejecutado',
    //
    emptyValues: 'Parametro(s) con valores vacios',
    fieldCannotBeEmpty: 'El valor del campo no puede estar vacío.',
    fieldMandatory: 'El campo es obligatorio',
    requestError: 'Error al ejecutar la petición',
    successChangeRole: 'El rol se ha cambiado',
    errorChangeRole: 'El rol no se ha cambiado',
    copySuccessful: 'Copiado',
    copyUnsuccessful: 'Error, no se puede copiar',
    mandatoryFieldMissing: 'Falta completar los campos ',
    updateFields: 'Se actualiza el registro con el campo ',
    updateSuccessfully: 'Cambios realizados exitosamente',
    invalidEmailFormat: 'Formato de correo electronico invalido',
    recordLocked: 'Este registro ha sido bloqueado',
    recordUnlocked: 'Este registro ha sido desbloqueado',
    noRoleAccess: 'Con su rol y configuración actuales, no puede ver esta información.',
    errorPointOfSale: 'Sin punto de venta seleccionado',
    emptyPos: 'Este Usuario no tiene Ningún Terminal de PDV Asignado'
  },
  navbar: {
    badge: {
      Notifications: 'Notificaciones',
      activity: 'Flujos de Trabajos por Aprobar',
      link: 'Ir a Histórico de Procesos'
    },
    logOut: 'Salir',
    dashboard: 'Panel de control',
    github: 'Github',
    theme: 'Tema',
    size: 'Tamaño global',
    profile: 'Perfil'
  },
  login: {
    noValidUser: 'Por favor ingrese el nombre de usuario correcto',
    noValidPassword: 'La contraseña no puede estar vacía',
    invalidLogin: 'ID de usuario o contraseña no válida',
    unexpectedError: 'Se ha producido un error inesperado, intente nuevamente',
    capsLock: 'Bloqueo de mayúsculas activado',
    title: 'Formulario de acceso',
    submit: 'Enviar',
    logIn: 'Acceso',
    name: 'Nombre',
    lastName: 'Apellido',
    eMail: 'Correo electronico',
    userName: 'Usuario',
    userNameOrEmail: 'Usuario o Correo',
    userEnrollment: 'Registrar usuario',
    userEnrollmentSuccessful: 'Registro de usuario exitoso, verifique su correo electronico',
    passwordResetSendLink: 'El enlace para reiniciar la contraseña se envio al correo ',
    password: 'Contraseña',
    passwordNew: 'Nueva contraseña',
    passwordConfirm: 'Confirmar contraseña',
    passwordConfirmNew: 'Confirmación de nueva contraseña',
    any: 'nada',
    thirdparty: 'Conectar con',
    thirdpartyTips: 'No se puede simular en local, así que combine su propia simulación de negocios.',
    invalidToken: 'El token utilizado es inválido.',
    passwordReset: 'Reiniciar contraseña',
    createPassword: 'Crear contraseña',
    passwordResetSuccessful: 'El reinicio de contraseña se realizo correctamente',
    passwordAndConfirmNotMatch: 'La contraseña nueva y su confirmación no coinciden.'
  },
  documentation: {
    documentation: 'Documentación',
    github: 'Repositorio Github',
    releases: 'Liberaciones',
    branches: 'Ramas',
    code: 'Código',
    issues: 'Asuntos',
    downloadZip: 'descargar  Zip',
    releaseNotes: 'Nota de Liberaciones',
    goRepository: 'Ir al Repositorio',
    seeDocumentation: 'Ver Documentación'
  },
  permission: {
    addRole: 'Nuevo rol',
    editPermission: 'Permiso de edición',
    roles: 'Tus permisos',
    switchRoles: 'Cambiar permisos',
    tips: 'En algunos casos, no es adecuado usar v-permission, como el componente Element Tab o el-table-column y otros casos de dom de representación asíncrona que solo se pueden lograr configurando manualmente v-if.',
    delete: 'Borrar',
    confirm: 'Confirmar',
    cancel: 'Cancelar'
  },
  guide: {
    description: 'La página de guía es útil para algunas personas que ingresaron al proyecto por primera vez. Puede introducir brevemente las características del proyecto. Demo se basa en ',
    button: 'Ver guía'
  },
  components: {
    date: {
      Today: 'Hoy',
      Yesterday: 'Ayer',
      Week: 'La semana pasada',
      LastMonth: 'El mes pasado',
      CurrentMonth: 'El mes actual'
    },
    documentation: 'Documentación',
    binaryButton: 'Subir archivo',
    binaryTip: 'Solo archivos con un tamaño menor a 500kb',
    imageError: 'La imagen excede los 2MB y no cumple con los formato validos!',
    contextMenuActions: 'Acciones',
    contextMenuReferences: 'Referencias',
    withOutReferences: 'Sin referencias para el registro',
    contextMenuDownload: 'Descargar',
    contextMenuPrintFormatSetup: 'Configurar Formato de Impresión',
    ChangeParameters: 'Cambiar Parametros',
    RunProcessAs: 'Ejecutar como',
    ExportTo: 'Exportar a',
    dateStartPlaceholder: 'Fecha inicial',
    dateEndPlaceholder: 'Fecha final',
    timePlaceholder: 'Seleccione tiempo',
    dialogCancelButton: 'Cancelar',
    dialogConfirmButton: 'Confirmar',
    filterableItems: 'Columnas Opcionales',
    fixedleItems: 'Columnas Fijas',
    resetAllFilters: 'Reiniciar todos los filtros',
    switchActiveText: 'Si',
    switchInactiveText: 'No',
    contextFieldTitle: 'Información de Contexto'
  },
  grid: {
    recordAccess: {
      accessGranted: 'Acceso otorgado a los roles'
    }
  },
  views: {
    browser: 'Consulta Inteligente',
    smartBrowser: 'Consulta Inteligente',
    process: 'Proceso',
    window: 'Ventana',
    report: 'Reporte',
    workflow: 'Flujo de Trabajo',
    task: 'Tarea',
    form: 'Formulario',
    noProcess: 'No hay procesos en ejecución',
    logs: 'Resumen',
    log: 'Bitacora',
    seeReport: 'Ver Reporte',
    summary: 'Resumen',
    viewsHelp: 'Ayuda',
    searchCriteria: 'Criterio de Búsqueda',
    unsupportedSorry: 'Lo sentimos',
    unsupportedHeadline: 'Esta vista no está disponible actualmente',
    unsupportedInfo: 'Verifique que la vista sea compatible con esta versión, o haga clic en el botón a continuación para volver a la página de inicio.',
    unsupportedButton: 'Volver al Panel de control',
    reportView: 'Vistas de Reporte',
    printFormat: 'Formatos de Impresión',
    drillTable: 'Entrar en Detalle'
  },
  report: {
    ExportXlsx: '(xlsx) Extencion de Archivo Excel',
    ExportXls: '(xls) Archivo Excel',
    ExporXml: '(xml) Archivo Lenguaje de marcas Extensible',
    ExporCsv: '(csv) Archivo Separado por Coma',
    ExportTxt: '(txt) Archivo de Texto Delimitado por Tabuladores',
    ExportHtml: '(html) Lenguaje de Marcas de Hipertexto'
  },
  table: {
    ProcessActivity: {
      Name: 'Nombre',
      zoomIn: 'Acercar',
      Description: 'Descripción',
      FileName: 'Nombre de Archivo',
      Output: 'Salida',
      Action: 'Acción',
      Status: 'Estado',
      Logs: 'Resumen',
      Summary: 'Resumen',
      Help: 'Ayuda'
    },
    dataTable: {
      search: 'Buscar',
      selected: 'Seleccionados',
      deleteSelection: 'Eliminar Registros Seleccionados',
      advancedQuery: 'Consulta Avanzada',
      exportZip: 'Exportar Zip',
      showAllColumns: 'Mostrar todas las Columnas',
      showOnlyMandatoryColumns: 'Mostrar Solo Columnas Obligatorias',
      showTableColumnsOnly: 'Mostrar Solo Columnas de la Tabla',
      showAllAvailableColumns: 'Mostrar Todas Columnas Disponibles',
      exportRecordTable: 'Exportar Registros Seleccionados',
      showTotal: 'Mostrar Totales',
      hiddenTotal: 'Ocultar Totales'
    },
    recentItems: {
      search: 'Filtrar por nombre, descripción o fecha',
      date: 'Fecha',
      name: 'Nombre',
      description: 'Descripción'
    }
  },
  tagsView: {
    refresh: 'Actualizar',
    close: 'Cerrar',
    closeOthers: 'Cerrar otros',
    closeAll: 'Cerrar todos',
    newRecord: 'Nuevo Registro',
    seeRecord: 'Ver Registro',
    advancedQuery: 'Consulta Avanzada'
  },
  settings: {
    title: 'Configuración',
    theme: 'Color del tema',
    tagsView: 'Habilitar Tags-View',
    fixedHeader: 'Encabezado fijo',
    sidebarLogo: 'Logotipo de la barra lateral',
    showContextMenu: 'Mostrar Menu de Contexto',
    isShowTitle: 'Mostrar Título',
    isShowMenu: 'Mostrar Menu'
  },
  profile: {
    aboutMe: 'Sobre Mi',
    recentItems: 'Artículos Recientes',
    favorites: 'Favoritos',
    PendingDocuments: 'Documentos Pendientes',
    recentItemsName: 'Nombre Ítems Recientes',
    role: 'Rol',
    availableRoles: 'Roles disponibles',
    currentRole: 'Rol actual',
    clientName: 'Nombre del cliente',
    description: 'Descripción',
    changeRole: 'Cambiar Rol',
    changeLanguage: 'Cambiar idioma',
    changeLanguagePlaceholder: 'Elija un idioma'
  },
  window,
  field: {
    field: 'Campo',
    info: 'Información',
    calculator: 'Calculadora',
    preference: 'Preferencia',
    logsField: 'Bitácora de Cambios',
    contextInfo: 'Información del Contexto',
    logsFieldEmpty: 'El campo no tiene cambios aún',
    container: {
      help: 'Ayuda',
      description: 'Descripción'
    }
  },
  data: {
    createRecordSuccessful: 'Nuevo registro creado con exito',
    createNewRecord: 'Modo nuevo registro',
    createRecordError: 'Error al crear nuevo registro',
    deleteRecordSuccessful: 'Registro eliminado exitosamente',
    deleteRecordError: 'Error al eliminar el regitro',
    exportRecord: 'Exportar Registro',
    noDescription: 'Sin Descripción',
    addDescription: 'Agregue una Descripción',
    recordAccess: {
      modeMobile: {
        accessRoles: 'Roles con Acceso',
        accessRolesIsReadonly: 'Roles con Acceso y Solo lectura',
        lockedRoles: 'Roles Bloqueados',
        lockedRolesIsDependentEntities: 'Roles Bloqueados con Entidades Dependientes'
      },
      actions: 'Acceso a Registros',
      availableRoles: 'Roles Disponibles',
      configRoles: 'Roles Configurados',
      isReadonly: 'Solo  Lectura',
      isDependentEntities: 'Entidades Dependientes',
      isLock: 'Bloquear',
      isUnlock: 'Desbloquear',
      isError: 'Error al '
    },
    selectionRequired: 'Debe seleccionar un registro',
    undo: 'Deshacer',
    notification: {
      lockRecord: 'El Registro fue Bloqueado',
      unlockRecord: 'El Registro fue Desbloqueado'
    },
    addNote: 'Agregar Nota',
    emptyNote: 'Este registro no posee ninguna nota',
    descriptionNote: 'Agregar Nota o Comentario al Registro'
  },
  sequence: {
    available: 'Disponibles',
    sequence: 'Secuencia'
  },
  operators: {
    compareSearch: 'Comparar la Búsqueda',
    operator: 'Operador de comparación',
    EQUAL: 'Igual a "="',
    NOT_EQUAL: 'Diferente a "<>"',
    LIKE: 'Contiene "~"',
    NOT_LIKE: 'No contiene "!~"',
    GREATER: 'Mayor que ">"',
    GREATER_EQUAL: 'Mayor o igual que ">="',
    LESS: 'Menor que "<"',
    LESS_EQUAL: 'Menor o igual que "<="',
    BETWEEN: 'Entre ">-<"',
    NULL: 'No tiene valor',
    NOT_NULL: 'Tiene un valor',
    IN: 'Incluye "()"',
    NOT_IN: 'No incluye "!()"'
  },
  quickAccess: {
    newRecord: 'Acceso Rápido para Crear Registro Nuevo',
    listRecords: 'Acceso Rápido para Listar los Registros',
    searchWithEnter: 'Pulse enter para realizar la busqueda del producto segun su Codigo, Nombre o UPC'
  },
  businessPartner: {
    notFound: 'Socio de negocio no encontrado.',
    emptyBusinessPartner: 'Utilice los filtros para realizar la busqueda de socio de negocio según su Código, Nombre, Email y Teléfono'
  },
  form: {
    pos: {
      title: 'Punto de Venta',
      priceList: 'Lista de Precio',
      releaseOrder: 'Liberar',
      applyDiscountOnOrder: 'Apply Discount on Order',
      discountRate: '% Discount',
      optionsPoinSales: {
        title: 'Opciones Rápidas del Punto de Ventas',
        emptyAvailablePaymentMethods: 'Éste Terminal no tiene Método de Pago configurado para permitir Reembolso',
        emptyAvailablePaymentMethodsRefudn: 'Éste Terminal no tiene Método de Pago configurado para permitir Reembolso Pendiente',
        emptyListCashSummary: 'No hay moviemineto en caja',
        salesOrder: {
          title: 'Orden de Venta',
          newOrder: 'Nueva Orden',
          ordersHistory: 'Histórico de Órdenes ',
          generateImmediateInvoice: 'Generar Factura Inmediata',
          completePreparedOrder: 'Completar Orden Preparada',
          cancelSaleTransaction: 'Anular Transacción de Venta',
          createPos: 'Crear Retiro de Punto de Venta',
          print: 'Imprimir Documento',
          cancelOrder: 'Cancelar Orden',
          orderRemoved: 'Orden Borrada',
          copyOrder: 'Copiar Orden',
          createNewReturnOrder: 'Crear una nueva orden de devolución',
          confirmDelivery: 'Confirmar Entrega',
          emptyProductDelivery: 'Producto no se Encuentra en la Orden'
        },
        cashManagement: {
          title: 'Gestión de Caja',
          cashOpening: 'Apertura de Caja',
          cashOpenBox: 'Caja Aperturada',
          cashwithdrawal: 'Retiro de Efectivo',
          successfulCashWithdrawal: 'Retiro de caja exitoso',
          cashCloseBox: 'Caja Cerrada',
          closeBox: 'Cierre de Caja',
          assignSeller: 'Asignar vendedor'
        },
        generalOptions: {
          title: 'Opciones Generales',
          changePos: 'Cambiar Punto de Venta',
          listProducts: 'Lista de Productos y Precios',
          changeWarehouseList: 'Cambiar de Almacén',
          changePriceList: 'Cambiar Lista de Precio',
          dateTo: 'Fecha Hasta',
          dateOrder: 'Fecha Orden',
          dateFrom: 'Fecha Desde'
        }
      },
      generalNotifications: {
        orderReleased: 'Orden Liberada: ',
        selectedOrder: 'Orden Seleccionada: '
      },
      tableProduct: {
        product: 'Producto',
        quantity: 'Cantidad',
        options: 'Opciones',
        editQuantities: 'Editar Cantidades',
        pin: 'Ingrese Pin',
        remove: 'Eliminar',
        taxAmount: 'Impuesto',
        taxRate: '% Imp',
        displayDiscuentAmount: 'Descuento',
        empty: 'Ingrese el nombre del producto, código o UPC'
      },
      order: {
        order: 'Orden',
        seller: 'Vendedor',
        date: 'Fecha',
        subTotal: 'Sub-Total',
        type: 'Tipo',
        discount: '% Dcto',
        tax: 'Impuesto',
        total: 'Total',
        itemQuantity: 'Cantidad de Artículos',
        numberLines: 'Número de Líneas',
        pointSale: 'Punto de Venta',
        collect: 'Cobrar',
        collections: 'Cobros',
        campaign: 'Campaña',
        noCampaignSelected: 'Sin Campaña seleccionada',
        BusinessPartnerCreate: {
          phone: 'Telefono',
          businessPartner: 'Socio de Negocios',
          successfullyCreated: 'Socio de Negocio Creado Exitosamente',
          customerData: 'Datos del Cliente',
          addBillingAddress: 'Agregar Dirección de Facturación',
          billingAddress: 'Dirección de Facturación',
          shippingAddress: 'Dirección de Envío',
          withoutSetting: 'Sin Establecer',
          taxId: 'Identificación Fiscal',
          address: {
            edit: 'Editar',
            selectAddress: 'Seleccionar Dirección',
            saveAddress: 'Dirección guardada',
            addNewAddress: 'Agregar Nueva Dirección',
            editAddress: 'Editar Dirección',
            billingAddress: 'Dirección de Facturación',
            shippingAddress: 'Dirección de Envió',
            managementDescription: 'Descripción de la Dirección',
            addressType: 'Tipo de Dirección',
            region: 'Región',
            city: 'Ciudad',
            address: 'Dirección',
            postCode: 'Código Postal'
          }
        }
      },
      collect: {
        orderTotal: 'Total de Orden',
        pending: 'Pendiente',
        payment: 'Pago',
        change: 'Cambio',
        totalInvoiced: 'Total Facturado',
        convertAmount: 'Convertir Cantidad',
        convertedAmount: 'Convertido',
        fullPayment: 'Cobro Completo',
        Currency: 'Moneda',
        dayRate: 'Tasa del Día',
        noDayRate: 'No se a generado una tasa del día para la moneda',
        refund: 'Reembolso',
        paymentMethods: 'Métodos de Pago',
        emptyRate: 'Sin tasa de conversión a la fecha',
        TenderType: {
          directDeposit: 'Depósito Directo',
          creditCard: 'Tarjeta de Crédito',
          directDebit: 'Débito Directo',
          check: 'Cheque',
          creditNote: 'Nota de crédito',
          mobilePayment: 'Pago Móvil Interbancario',
          account: 'Cuenta',
          cash: 'Efectivo',
          zelle: 'Zelle'
        },
        overdrawnInvoice: {
          title: 'Factura Sobregirada',
          below: 'Factura quedará con un saldo abierto',
          above: 'Datos del Cliente',
          returned: 'Su vuelto es',
          coupon: 'Generar una Tarjeta de Regalo o Vale',
          returnMoney: 'Devolver dinero en otra forma de pago',
          adjustDocument: 'Desea Ajustar Documento',
          dailyLimit: 'Limite Diario',
          customerLimit: 'Limite Orden',
          available: 'Disponible',
          emptyPayment: 'Método de pago no soportado',
          emptyListPayment: 'No posee ningún método de pago asociado en esta opción',
          addPayment: 'Debe agregar un tipo de vuelto para completar la operación',
          amountLimitOrder: 'Monto Superior al Límite de la Orden',
          incompleteChange: 'Cambio Incompleto',
          fieldList: {
            code: 'Cedula',
            name: 'Nombre del Titular',
            accountType: 'Tipo de Cuenta',
            bank: 'Banco'
          }
        }
      },
      keyLayout: {
        noProducto: 'Producto no Disponible'
      },
      pinMessage: {
        pin: 'Ingrese Pin para ',
        documentType: 'cambiar tipo de documento',
        warehouse: 'cambiar almacén',
        price: 'cambiar precio',
        qtyEntered: 'cambiar cantidad',
        priceList: 'cambiar lista de precio',
        discount: 'agregar descuento',
        delete: 'eliminar producto',
        addProduct: 'agregar producto',
        invoiceOpen: 'generar factura con un saldo abierto',
        newOrder: 'crear nueva orden'
      }
    },
    priceChecking: {
      productNotFound: 'Producto No Disponible',
      basePrice: 'Precio Base'
    },
    byInvoice: {
      title: 'Pedidos Vendedor de Pasillo por Facturar',
      searchCompleteOrders: 'Sólo Completas',
      label: 'Por Facturar',
      toDeliver: 'Por Entregar',
      toCollect: 'Por Cobrar',
      salesRepresentative: 'Agente Comercial',
      onlyAllocated: 'Solo asignado al punto de venta actual',
      businessPartner: 'Socio de Negocio',
      copyShippingAddress: 'Copiar dirección para el envío',
      documentNo: 'Nro. Documento',
      emptyList: 'Utilice los filtros para realizar la busqueda de las ordenes'
    },
    productInfo: {
      product: 'Producto',
      codeProduct: 'Código de Producto',
      productInformation: 'Información de Producto',
      code: 'Código',
      name: 'Nombre',
      id: 'ID',
      lastName: 'Nombre2',
      description: 'Descripción',
      convertedPrice: 'Precio Convertido',
      quantityOnHand: 'Existencia',
      price: 'Precio',
      taxAmount: 'Monto de Impuesto',
      totalIncludingTax: 'Total con Impuesto',
      grandTotal: 'Total General',
      grandTotalConverted: 'Gran Total Convertido',
      quantityAvailable: 'Disponible',
      upc: 'Código de Barras',
      UM: 'UM'
    },
    guideSteps: {
      productValue: {
        description: 'Busca el producto segun su Codigo, Nombre o UPC'
      },
      businessPartner: {
        description: 'Mostrar Informacion del Socio de Negocios'
      },
      linesTable: {
        title: 'Lineas de la Orden',
        description: 'Listado de los Producto de la orden'
      },
      buttonPanelLeftPos: {
        title: 'Mostrar Panel Izquierdo',
        description: 'Despliega el panel de Opciones del Punto de Venta'
      },
      point: {
        description: 'Informacion del punto de venta actual'
      },
      buttonPanelRightPos: {
        title: 'Mostrar Panel Derecho',
        description: 'Despliega el panel de catalogo'
      },
      fieldListCollection: {
        title: 'Campos de la Cobranza',
        description: 'Grupo de Campo el cual posee. Monto, Moneda, Tipo de pago, Banco, Nro Referencia y Fecha'
      },
      buttonCollection: {
        title: 'Herramientas de la Cobranza',
        description: 'Compuesta por un conjunto de botonera que posee agregar, eliminar y porcesar'
      },
      cardCollection: {
        title: 'Panel de Pago',
        description: 'En este panel aparece un listado con las tarjeta de los pagos agregados'
      },
      infoInvoce: {
        title: 'Detalle de la Factura',
        description: 'Informacion de la Factura con el monto total, pendiente, cambio'
      },
      toolsPoint: {
        title: 'Herramientas del Punto de Venta'
      }
    },
    activity: {
      title: 'Sus Actividades de Flujo de Trabajo',
      filtersSearch: {
        history: 'Registros históricos',
        forward: 'Re-enviar'
      },
      table: {
        priority: 'Prioridad',
        node: 'Nodo'
      },
      guide: {
        table: {
          title: 'Lista de Flujos de trabajos por aprobar',
          description: 'Seleccione al menos uno para ver el detalle y responsable de aprobación. De igual manera puede decidir si aprueba, rechaza o redirecciona el mismo'
        },
        workflow: {
          title: 'Flujo de Trabajo',
          description: 'Diagrama del ciclo de vida del flijo de trabajo. El Nodo resaltado es el que se encuentra actualmente a la espera de verificación.'
        },
        workflowLogs: {
          title: 'Bitacora de Cambios',
          description: 'Linea de tiempo del flujo de trabajo'
        }
      }
    },
    match: {
      title: {
        invoice: 'Factura',
        deliveryReceipt: 'Entrega / Recibo'
      },
      description: {
        searchCriteria: 'Seleccione un Socio de Negocio para verificar los documentos pendientes por asignar',
        invoice: 'Seleccione una Factura para asignar las Entrega/Recibo correspondiente',
        deliveryReceipt: 'Seleccione al menos una Entrega/Recibo a la cual requiere asignar la factura seleccionada'
      },
      field: {
        toAssigned: 'Para ser Asignadas',
        assigning: 'Asignando',
        difference: 'Diferencia'
      },
      filtersSearch: {
        sameBusinessPartner: 'Mismo Socio del Negocio',
        sameProduct: 'Mismo Producto ',
        sameQuantity: 'Misma Cantidad '
      },
      table: {
        nrDocument: 'Nr Docuemnto'
      }
    },
    weight: 'Peso'
  }
}
