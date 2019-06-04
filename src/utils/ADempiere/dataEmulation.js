import { clientDateTime } from '@/utils/ADempiere/valueUtil.js'

export function contextInitial() {
  var contex = new Map()
  contex.set('#AD_Client_ID', 0)
  contex.set('#AD_Language', 'en_US')
  contex.set('#AD_Org_ID', 0)
  contex.set('#AD_User_ID', 1)
  contex.set('#AD_Client_Name', 'System')
  contex.set('#AD_Org_Name', '*')
  contex.set('#AD_PrintColor_ID', 100)
  contex.set('#AD_PrintFont_ID', 163)
  contex.set('#AD_PrintPaper_ID', 100)
  contex.set('#AD_PrintTableFormat_ID', 100)
  contex.set('#AD_Role_ID', 0)
  contex.set('#AD_Role_Name', 'System Administrator')
  contex.set('#AD_SearchDefinition_ID', 50000)
  contex.set('#AD_Session_ID', 1001424)
  contex.set('#AD_User_ID', 100)
  contex.set('#AD_User_Name', 'SuperUser')
  contex.set('#C_ConversionType_ID', 114)
  contex.set('#C_Country_ID', 100)
  contex.set('#C_Region_ID', 142)
  contex.set('#C_UOM_ID', 100)
  contex.set('#Date', clientDateTime())
  // contex.set('#Date', '2019-06-03 15:09:39')
  contex.set('#IsLiberoEnabled', 'Y')
  contex.set('#IsLiberoWMEnabled', 'Y')
  contex.set('#LanguageName', 'English')
  contex.set('#Locale', 'en_US')
  contex.set('#M_Warehouse_ID', 0)
  contex.set('#SalesRep_ID', 100)
  contex.set('#ShowAcct', 'N')
  contex.set('#ShowAdvanced', 'Y')
  contex.set('#ShowTrl', 'Y')
  contex.set('#StdPrecision', 2)
  contex.set('#SysAdmin', 'Y')
  contex.set('#UI', 'WebUI')
  contex.set('#User_Level', 'S')
  contex.set('#YYYY', 'Y')

  contex.set('#A_Asset_Group_ID', 50006)
  contex.set('#C_BP_Group_ID', 103)
  contex.set('#C_BankAccount_ID', 100)
  contex.set('#C_CashBook_ID', 101)
  contex.set('#C_DocTypeTarget_ID', 126)
  contex.set('#C_Dunning_ID', 100)
  contex.set('#C_PaymentTerm_ID', 105)
  contex.set('#C_TaxCategory_ID', 107)
  contex.set('#C_Tax_ID', 104)
  contex.set('#GL_Category_ID', 108)
  contex.set('#M_CostElement_ID', 100)
  contex.set('#M_Locator_ID', 50006)
  contex.set('#M_PriceList_ID', 101)
  contex.set('#M_Product_Category_ID', 105)
  contex.set('#PP_Product_BOM_ID', 145)
  contex.set('#R_StatusCategory_ID', 100)
  contex.set('#R_Status_ID', 100)
  contex.set('$C_AcctSchema_ID', 101)
  contex.set('$C_Currency_ID', 100)
  contex.set('$Element_AC', 'Y')
  contex.set('$Element_BP', 'Y')
  contex.set('$Element_MC', 'Y')
  contex.set('$Element_OO', 'Y')
  contex.set('$Element_PJ', 'Y')
  contex.set('$Element_PR', 'Y')
  contex.set('$HasAlias', 'Y')
  contex.set('AutoCommit', 'Y')
  contex.set('AutoNew', 'Y')
  contex.set('Login.RememberMe', 'Y')
  return contex
}
