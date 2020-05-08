import { URL, TEXT, NUMBER, INTEGER, TEXT_LONG, TABLE_DIRECT } from '@/utils/ADempiere/references'

export default [
  // URL
  {
    columnName: 'URL',
    definition: {
      name: 'Web',
      isAutoFocus: true, // or handleFocus
      isAutoSelection: true,
      displayType: URL.id
    }
  },
  // From Field UUID
  {
    isFromDictionary: true,
    fieldUuid: '8ceabe8a-fb40-11e8-a479-7a0060f0aa01'
  },
  // From Column UUID
  {
    isFromDictionary: true,
    columnUuid: '8b4bbb7e-fb40-11e8-a479-7a0060f0aa01'
  },
  // From Element Column Name
  {
    isFromDictionary: true,
    elementColumnName: 'M_RMA_ID'
  },
  // From Table and Column Name
  {
    tableName: 'C_BPartner',
    columnName: 'PaymentRule',
    isFromDictionary: true,
    overwriteDefinition: {
      isMandatory: true
    }
  },
  // Table direct
  // To be define
  {
    columnName: 'C_Currency_ID',
    definition: {
      name: 'Currency',
      displayType: TABLE_DIRECT.id,
      keyColumn: 'C_Currency.C_Currency_ID',
      directQuery: 'SELECT C_Currency.C_Currency_ID,NULL,C_Currency.ISO_Code,C_Currency.IsActive FROM C_Currency WHERE C_Currency.C_Currency_ID=?',
      query: 'SELECT C_Currency.C_Currency_ID,NULL,C_Currency.ISO_Code,C_Currency.IsActive FROM C_Currency ORDER BY 3'
    }
  },
  // Text
  {
    columnName: 'Name',
    definition: {
      name: 'Only Name',
      displayType: TEXT.id,
      displayLogic: '@URL@!""',
      handleActionKeyPerformed: true
    }
  },
  // Amount
  {
    columnName: 'Amount',
    definition: {
      name: 'Amount for it',
      displayType: NUMBER.id,
      readOnlyLogic: '@C_Currency_ID@<>""',
      handleActionKeyPerformed: true
    }
  },
  // Integer
  {
    columnName: 'SeqNo',
    definition: {
      name: 'Sequence for record',
      displayType: INTEGER.id,
      mandatoryLogic: '@URL@!""',
      showControl: 1
    }
  },
  // Text Long
  {
    columnName: 'Description',
    definition: {
      name: 'Only Description',
      displayType: TEXT_LONG.id
    }
  }
]
