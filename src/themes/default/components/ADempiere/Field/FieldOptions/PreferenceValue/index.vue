<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-card
    v-if="!isEmptyValue(metadataList)"
    class="field-option-card preference-value"
    style="min-width: 430px;"
  >
    <div slot="header">
      <span>
        {{ $t('fieldOptions.preference.title') }}:
        <b>
          {{ fieldAttributes.name }}
        </b>
      </span>
    </div>
    <div class="justify-text">
      {{ getDescriptionOfPreference }}
    </div>

    <div style="margin-top: 10px;">
      <ul>
        <li>
          {{ $t('fieldOptions.currentValue') }}:
          <b>
            <!-- TODO: Add parsed value to boolean and date -->
            <template v-if="!isEmptyValue(displayedValue)">
              {{ value }} - {{ displayedValue }}
            </template>
            <template v-else>
              {{ value }}
            </template>
          </b>
        </li>
      </ul>

      <hr>
      <el-form
        label-position="top"
        :inline="true"
        class="form-values"
        size="medium"
      >
        <el-row>
          <el-col
            v-for="(field) in metadataList"
            :key="field.sequence"
            :xs="6"
            :sm="6"
            :md="6"
            :lg="6"
            :xl="6"
          >
            <el-form-item>
              <p slot="label" style="margin-bottom: 0px;margin-top: 0px;">
                {{ field.name }}
              </p>
              <el-switch
                v-model="field.value"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-row class="footer">
      <el-col :span="24">
        <samp style="float: left; padding-right: 10px;">
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="remove()"
          />
        </samp>

        <samp style="float: right; padding-right: 10px;">
          <el-button
            type="danger"
            icon="el-icon-close"
            @click="close()"
          />

          <el-button
            type="primary"
            icon="el-icon-check"
            @click="sendValue()"
          />
        </samp>
      </el-col>
    </el-row>
  </el-card>

  <div
    v-else
    v-loading="isEmptyValue(metadataList)"
    :element-loading-text="$t('notifications.loading')"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="loading-window"
  />
</template>

<script>
// components and mixins
import formMixin from '@theme/components/ADempiere/Form/formMixin'

// constants
import preferenceFields from './preferenceValueFieldsList.js'
import { CLIENT, ORGANIZATION } from '@/utils/ADempiere/constants/systemColumns'

// api request methods
import { setPreference, deletePreference } from '@/api/ADempiere/field/preference.js'

const containerUuid = `field-preference`

export default {
  name: 'PreferenceValue',

  mixins: [
    formMixin
  ],

  props: {
    fieldAttributes: {
      type: [Object],
      required: true,
      default: null
    },
    containerManager: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      preferenceFields,
      metadataList: [],
      description: [],
      isCustomForm: true,
      containerUuid
    }
  },

  computed: {
    fieldsListPreference() {
      return this.metadataList.map(item => {
        return {
          label: item.name,
          value: item.value,
          columnName: item.columnName,
          sequence: item.sequence
        }
      })
    },
    value() {
      const { columnName, containerUuid, inTable } = this.fieldAttributes
      // table records values
      if (inTable) {
        return this.containerManager.getCell({
          containerUuid,
          rowIndex: this.fieldAttributes.rowIndex,
          columnName
        })
      }

      return this.$store.getters.getValueOfFieldOnContainer({
        parentUuid: this.fieldAttributes.parentUuid,
        containerUuid,
        columnName
      })
    },
    displayedValue() {
      // DisplayColumn_'ColumnName'
      const { displayColumnName: columnName, containerUuid, inTable } = this.fieldAttributes
      // table records values
      if (inTable) {
        return this.containerManager.getCell({
          containerUuid,
          rowIndex: this.fieldAttributes.rowIndex,
          columnName
        })
      }

      return this.$store.getters.getValueOfFieldOnContainer({
        parentUuid: this.fieldAttributes.parentUuid,
        containerUuid,
        columnName
      })
    },

    clientField() {
      return this.metadataList.find(field => {
        return field.columnName === CLIENT
      })
    },
    organizationField() {
      return this.metadataList.find(field => {
        return field.columnName === ORGANIZATION
      })
    },
    userField() {
      return this.metadataList.find(field => {
        return field.columnName === 'AD_User_ID'
      })
    },
    containerField() {
      return this.metadataList.find(field => {
        return field.columnName === 'AD_Window_ID'
      })
    },

    getDescriptionOfPreference() {
      if (this.isEmptyValue(this.metadataList) || !this.clientField) {
        return ''
      }

      // Create Message
      let expl = this.$t('fieldOptions.preference.for')
      if (this.organizationField) {
        if (this.clientField.value) {
          if (this.organizationField.value) {
            expl += this.$t('fieldOptions.preference.clientAndOrganization')
          } else {
            expl += this.$t('fieldOptions.preference.allOrganizationOfClient')
          }
        } else {
          expl += this.$t('fieldOptions.preference.entireSystem')
        }
      }

      if (this.userField && this.containerField) {
        if (this.userField.value) {
          expl += this.$t('fieldOptions.preference.thisUser')
        } else {
          expl += this.$t('fieldOptions.preference.allUsers')
        }

        if (this.containerField.value) {
          expl += this.$t('fieldOptions.preference.thisWindow')
        } else {
          expl += this.$t('fieldOptions.preference.allWindows')
        }
      }

      return expl
    }
  },

  beforeMount() {
    if (this.isEmptyValue(this.metadataList)) {
      this.setFieldsList()
    }
  },

  methods: {
    close() {
      if (!this.isEmptyValue(this.$route.query.fieldColumnName)) {
        /*
        this.$router.push({
          name: this.$route.name,
          query: {
            ...this.$route.query,
            typeAction: '',
            fieldColumnName: ''
          }
        }, () => {})
        */
        this.$children[0].visible = false
        this.$store.commit('changeShowRigthPanel', false)
        this.$store.commit('changeShowOptionField', false)
      }
    },
    remove() {
      deletePreference({
        parentUuid: this.fieldAttributes.parentUuid,
        attribute: this.fieldAttributes.columnName,
        isForCurrentClient: this.clientField.value,
        isForCurrentOrganization: this.organizationField.value,
        isForCurrentUser: this.userField.value,
        isForCurrentContainer: this.containerField.value
      })
        .then(() => {
          this.$message({
            message: this.$t('fieldOptions.preference.preferenceRemoved')
          })
          this.close()
        })
        .catch(error => {
          this.$message({
            message: error.message,
            type: 'error'
          })
          console.warn(`setPreference error: ${error.message}.`)
        })
    },

    setFieldsList() {
      const fieldsList = []
      // Product Code
      this.preferenceFields.forEach(element => {
        this.createFieldFromDictionary(element)
          .then(fieldResponse => {
            fieldsList.push({
              ...fieldResponse,
              containerUuid: this.containerUuid
            })

            if (fieldResponse.value) {
              this.description.push(fieldResponse.name)
            }
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
      })

      this.metadataList = fieldsList
    },
    sendValue() {
      setPreference({
        parentUuid: this.fieldAttributes.parentUuid,
        attribute: this.fieldAttributes.columnName,
        value: this.value,
        isForCurrentClient: this.clientField.value,
        isForCurrentOrganization: this.organizationField.value,
        isForCurrentUser: this.userField.value,
        isForCurrentContainer: this.containerField.value
      })
        .then(() => {
          this.$message({
            message: this.$t('fieldOptions.preference.preferenceIsOk')
          })
        })
        .catch(error => {
          this.$message({
            message: error.message,
            type: 'error'
          })
          console.warn(`setPreference error: ${error.message}.`)
        })
        .finally(() => {
          this.close()
        })
    }
  }

}
</script>

<style lang="scss" src="../common-style.scss">
</style>
<style lang="scss">
.preference-value {
  >.el-card__body {
    padding-top: 5px !important;

    .el-form-item {
      margin-bottom: 0px !important;
    }

    .form-values {
      padding-bottom: 10px;
    }

    .footer {
      // line footer
      border-top: 1px solid #e6ebf5 !important;
      padding-top: 10px;
    }
  }
}
</style>
