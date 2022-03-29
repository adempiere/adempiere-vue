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
  <span>
    <div v-if="isEmptyValue(Attachment)">
      <el-empty />
    </div>
    <el-scrollbar wrap-class="scroll-attachment" class="scroll-attachment">
      <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
        :file-list="Attachment"
        style="width: 100%;"
      >
        <i slot="default" class="el-icon-plus" />
        <div slot="file" slot-scope="{file}">
          <el-image
            :src="file.url"
            :preview-src-list="listImage"
          />
        </div>
      </el-upload>
    </el-scrollbar>
  </span>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import store from '@/store'

export default defineComponent({
  name: 'Attachment',

  props: {
    parentUuid: {
      type: String,
      required: false
    },
    containerUuid: {
      type: String,
      required: false
    },
    isActiveTab: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { root }) {
    const dialogImageUrl = ref('')

    const dialogVisible = ref(false)

    const disabled = ref(false)

    const Attachment = computed(() => {
      console.log(store.getters.getAttachment, { listImage })
      return store.getters.getAttachment
    })

    const listImage = computed(() => {
      if (Attachment) {
        return Attachment.value.map(image => image.url)
      }
      return []
    })

    const fileList = ref([])

    const handleRemove = (file) => {
      console.log(file)
    }
    const handlePictureCardPreview = (file) => {
      dialogImageUrl.value = file.url
      dialogVisible.value = true
    }
    const handleDownload = (file) => {
      const download = document.createElement('a')
      download.href = file.url
      download.download = file.name
      download.click()
    }
    return {
      dialogImageUrl,
      dialogVisible,
      disabled,
      fileList,
      // computed
      listImage,
      Attachment,
      // methods
      handleRemove,
      handlePictureCardPreview,
      handleDownload
    }
  }
})
</script>
<style>
.scroll-attachment {
    max-height: 80vh;
}
.el-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    cursor: pointer;
    line-height: 146px;
    vertical-align: top;
    width: 100%;
}
</style>
