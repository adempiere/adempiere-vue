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
    class="box-card"
    style="padding: 1%;"
  >
    <div slot="header" class="clearfix">
      <span>
        {{ $t('components.preference.title') }}
        <b>
          {{ fieldAttributes.name }}
          {{ fieldValue }}
        </b>
      </span>
    </div>
    <div class="text item">
      {{ getDescriptionOfPreference }}
    </div>
    <br>

    <div class="text item">
      <el-form
        :inline="true"
      >
        <el-form-item>
          <p slot="label">
            {{ fieldAttributes.name }}: {{ fieldValue }}
          </p>
        </el-form-item>
      </el-form>
      <el-form
        label-position="top"
        :inline="true"
        class="demo-form-inline"
        size="medium"
      >
        <el-form-item
          v-for="(field) in metadataList"
          :key="field.sequence"
        >
          <p slot="label">
            {{ field.name }}
          </p>
          <el-switch
            v-model="field.value"
          />
        </el-form-item>
      </el-form>
    </div>
    <br>

    <el-row>
      <el-col :span="24">
        <samp style="float: left; padding-right: 10px;">
          <el-button
            type="danger"
            class="custom-button-address-location"
            icon="el-icon-delete"
            @click="remove()"
          />
        </samp>

        <samp style="float: right; padding-right: 10px;">
          <el-button
            type="danger"
            class="custom-button-address-location"
            icon="el-icon-close"
            @click="close()"
          />

          <el-button
            type="primary"
            class="custom-button-address-location"
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
import formMixin from '@/components/ADempiere/Form/formMixin'
import preferenceFields from './preferenceValueFieldsList.js'
import { CLIENT, ORGANIZATION } from '@/utils/ADempiere/constants/systemColumns'
import { setPreference, deletePreference } from '@/api/ADempiere/field/preference.js'

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
    fieldValue: {
      type: [String, Number, Boolean, Date, Array, Object],
      required: true,
      default: ''
    }
  },
  data() {
    return {
      preferenceFields,
      metadataList: [],
      code: '',
      description: [],
      isActive: false
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
      if (this.isEmptyValue(this.metadataList)) {
        return ''
      }
      if (!this.clientField) {
        return ''
      }

      // Create Message
      let expl = this.$t('components.preference.for')
      if (this.clientField && this.organizationField) {
        if (this.clientField.value && this.organizationField.value) {
          expl = expl.concat(this.$t('components.preference.clientAndOrganization'))
        } else if (this.clientField.value && !this.organizationField.value) {
          expl = expl.concat(this.$t('components.preference.allOrganizationOfClient'))
        } else if (!this.clientField.value && this.organizationField.value) {
          expl = expl.concat(this.$t('components.preference.entireSystem'))
        } else {
          expl = expl.concat(this.$t('components.preference.entireSystem'))
        }
      }

      if (this.userField && this.containerField) {
        if (this.userField.value) {
          expl = expl.concat(this.$t('components.preference.thisUser'))
        } else {
          expl = expl.concat(this.$t('components.preference.allUsers'))
        }

        if (this.containerField.value) {
          expl = expl.concat(this.$t('components.preference.thisWindow'))
        } else {
          expl = expl.concat(this.$t('components.preference.allWindows'))
        }
      }
      return expl
    }
  },
  watch: {
    isActive(value) {
      const preferenceValue = this.fieldValue
      if (value && this.isEmptyValue(this.metadataList)) {
        this.setFieldsList()
      }
      if (!this.isEmptyValue(preferenceValue)) {
        if ((typeof preferenceValue !== 'string') && (this.fieldAttributes.componentPath !== 'FieldYesNo')) {
          this.code = preferenceValue
        } else {
          this.code = preferenceValue
        }
      }
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
        this.$router.push({
          name: this.$route.name,
          query: {
            ...this.$route.query,
            typeAction: '',
            fieldColumnName: ''
          }
        }, () => {})
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
            message: this.$t('components.preference.preferenceRemoved')
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
          .then(metadata => {
            const data = metadata
            fieldsList.push({
              ...data,
              containerUuid: 'field-reference'
            })
            if (data.value) {
              this.description.push(data.name)
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
        value: this.fieldValue,
        isForCurrentClient: this.clientField.value,
        isForCurrentOrganization: this.organizationField.value,
        isForCurrentUser: this.userField.value,
        isForCurrentContainer: this.containerField.value
      })
        .then(() => {
          this.$message({
            message: this.$t('components.preference.preferenceIsOk')
          })
          this.close()
        })
        .catch(error => {
          this.$message({
            message: error.message,
            type: 'error'
          })
          this.close()
          console.warn(`setPreference error: ${error.message}.`)
        })
    }
  }
}
</script>
