<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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
  <el-card class="field-option-card translated-field">
    <div slot="header">
      <span>
        {{ $t('field.field') }}
        <b> {{ fieldAttributes.name }} </b>
      </span>
    </div>

    <el-scrollbar wrap-class="scroll-child">
      <el-form
        ref="form"
        class="form-translated-field"
        label-position="top"
        form-translated-field
        @submit.native.prevent="notSubmitForm"
      >
        <p class="justify-text">
          <b> {{ $t('field.container.description') }}: </b>
          {{ fieldAttributes.description }}
        </p>

        <p v-if="!isEmptyValue(fieldAttributes.help)" class="justify-text">
          <b> {{ $t('field.container.help') }}: </b>
          {{ fieldAttributes.help }}
        </p>

        <el-form-item
          :required="true"
          :label="$t('language') + ':'"
        >
          <el-select
            v-model="langValue"
            size="small"
            style="width: 100%;"
            filterable
          >
            <el-option
              v-for="(optionLang, key) in languageList"
              :key="key"
              :value="optionLang.language"
              :label="optionLang.languageName"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('fieldOptions.translationValue')"
          :required="true"
        >
          <el-input
            v-model="translatedValue"
            size="small"
            :disabled="isEmptyValue(langValue)"
          />
        </el-form-item>
      </el-form>
    </el-scrollbar>

    <el-row class="footer">
      <el-col :span="24">
        <samp style="float: right; padding-right: 10px;">
          <el-button
            type="danger"
            icon="el-icon-close"
            @click="close()"
          />

          <el-button
            type="primary"
            icon="el-icon-check"
            :disabled="isDisableRequest"
            @click="changeTranslationValue(translatedValue)"
          />
        </samp>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { defineComponent, computed, watch, ref } from '@vue/composition-api'

import { getLanguage } from '@/lang'

export default defineComponent({
  name: 'TranslatedField',

  props: {
    fieldAttributes: {
      type: Object,
      required: true
    },
    recordUuid: {
      type: String,
      default: undefined
    }
  },

  setup(props, { root }) {
    const { columnName, tabTableName: tableName } = props.fieldAttributes

    const langValue = ref()
    const translatedValue = ref('')
    const isLoading = ref(false)

    const languageList = computed(() => {
      return root.$store.getters.getLanguagesList.filter(itemLanguage => {
        return !itemLanguage.isBaseLanguage
      })
    })

    const translationValues = computed(() => {
      return root.$store.getters.getTranslationValues({
        language: langValue.value,
        tableName,
        recordUuid: props.recordUuid
      })
    })

    const translationOriginalValues = computed(() => {
      return root.$store.getters.getTranslationValues({
        language: langValue.value,
        tableName,
        recordUuid: props.recordUuid
      })
    })

    const isDisableRequest = computed(() => {
      return translatedValue.value === translationOriginalValues.value[columnName]
    })

    const gettterValue = computed(() => {
      const values = translationValues.value
      if (root.isEmptyValue(values)) {
        return undefined
      }
      return values[columnName]
    })

    const getTranslation = () => {
      if (!root.isEmptyValue(translationValues.value)) {
        // translatedValue.value = gettterValue.value
        return
      }
      getTranslationsFromServer()
    }

    const getTranslationsFromServer = () => {
      isLoading.value = true
      root.$store.dispatch('getTranslationsFromServer', {
        recordUuid: props.recordUuid,
        tableName,
        language: langValue.value
      })
        .then(values => {
          translatedValue.value = values[columnName]
        })
        .finally(() => {
          isLoading.value = false
        })
    }

    const changeTranslationValue = (value) => {
      root.$store.dispatch('changeTranslationValue', {
        language: langValue.value,
        tableName,
        recordUuid: props.recordUuid,
        columnName,
        value
      })
      close()
    }

    const close = () => {
      root.$store.commit('cancelTranslated', {
        language: langValue.value,
        tableName,
        recordUuid: props.recordUuid
      })

      root.$children[0].visible = false
      root.$store.commit('changeShowRigthPanel', false)
      root.$store.commit('changeShowOptionField', false)
    }

    watch(gettterValue, (newValue) => {
      let value = ''
      if (!root.isEmptyValue(newValue)) {
        value = newValue
      }
      translatedValue.value = value
    })

    let langMatch = languageList.value.find(itemLanguage => {
      return itemLanguage.languageISO === getLanguage()
    })
    if (root.isEmptyValue(langMatch)) {
      langMatch = languageList.value[0]
    }
    langValue.value = langMatch.language

    getTranslation()

    return {
      langValue,
      translatedValue,
      // computed
      languageList,
      isDisableRequest,
      // methods
      changeTranslationValue,
      close
    }
  }

})
</script>

<style lang="scss" src="../common-style.scss">
</style>
<style lang="scss">
.translated-field {
  &.el-card {
    max-width: 300px;

    .form-translated-field {
      .el-form-item {
        // spacing between form items
        padding-bottom: 10px;

        .el-form-item__content {
          // text content interline
          line-height: 20px;
        }
      }
    }
  }

  .footer {
    // line footer
    border-top: 1px solid #e6ebf5 !important;
    padding-top: 10px;
  }
}
</style>
