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
    <el-card v-if="!isEmptyValue(newImage)" shadow="always">
      <div slot="header" class="clearfix">
        <span>{{ $t('window.containerInfo.attachment.newFiles') }}</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          icon="el-icon-upload2"
          @click="submitUpload"
        >
          {{ $t('window.containerInfo.attachment.uploadFiles') }}
        </el-button>
      </div>
      <el-image
        v-for="(file, key) in newImage"
        :key="key"
        style="width: 150px;height: 150px;margin-left: 1%;margin-right: 1%;"
        :src="file"
        fit="fill"
        :preview-src-list="newImage"
      />
    </el-card>
    <div v-if="!Attachment">
      <el-empty />
    </div>
    <el-upload
      ref="upload"
      action="#"
      list-type="picture-card"
      :auto-upload="true"
      :file-list="listImageAll"
      :before-upload="beforeAvatarUpload"
    >
      <i slot="default" class="el-icon-plus" />
      <div slot="file" slot-scope="{file}">
        <el-image
          v-if="file.type !=='application/pdf'"
          style="width: 100%; height: 250px"
          :src="file.url"
          :preview-src-list="listImage"
        />

        <img v-else :src="file.url" alt="" class="el-upload-list__item-thumbnail">
        <span v-if="file.type ==='application/pdf'" class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in" />
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download" />
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <hr>
  </span>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import { buildImageFromArrayBuffer, buildLinkHref } from '@/utils/ADempiere/resource.js'
import { uploadAttachment } from '@/api/ADempiere/user-interface/resources.js'
import axios from 'axios'
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
    recordId: {
      type: Number,
      default: 0
    },
    tableName: {
      type: String,
      default: ''
    },
    recordUuid: {
      type: String,
      default: ''
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
    const organizationBackground = ref('')
    const organizationImagePath = ref('')
    const currentImageOfProduct = ref('')
    const pdfAttachment = ref([])
    const newImage = ref([])
    const newListImage = ref([])
    const imageAttachment = ref([])
    const listImageAll = computed(() => {
      if (imageAttachment.value) {
        return imageAttachment.value.concat(pdfAttachment.value)
      }
      return []
    })
    const listImage = computed(() => {
      if (listImageAll) {
        return listImageAll.value.map(image => image.url)
      }
      return []
    })
    const Attachment = computed(() => {
      if (store.getters.getAttachment) {
        const cafe = store.getters.getAttachment.map(element => {
          if (element.content_type !== 'application/pdf') {
            return {
              ...element,
              image: converImage(element)
            }
          }
          return {
            ...element,
            image: converFile(element)
          }
        })
        return cafe
      }
      return store.getters.getAttachment
    })

    const fileList = ref([])

    const handleRemove = (file) => {
      console.log(file)
    }
    const handlePictureCardPreview = (file) => {
      dialogImageUrl.value = file.url
      dialogVisible.value = true
    }
    const handleDownload = async(file) => {
      const urlImage = await axios.get(file.qlq)
      const link = buildLinkHref({
        fileName: 'epae',
        outputStream: urlImage.data.result.data,
        type: file.type
      })
      link.click()
    }

    const converFile = (image) => {
      pdfAttachment.value.push({
        ...image,
        qlq: image.url.uri,
        type: image.content_type,
        uuid: image.resource_uuid,
        url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAolBMVEXp6eD////MS0zZ18rq7OPKPkDiw7zMSErPXFvLRkfLREXp6eHk49nKPD7OUlP03d3YfH399fXekZLotLTJNzny1NTkqKjr8ej46Ojm2dHn3tbYk4/jysPk0cnesavZmZXbpJ/TdXPgurTQZmXVg4DOWFjXjor99/fQY2LgvbfUgX7boZzRbWzdrKbhnp7rwMDrv7/s9evvy8vHLC3gmZr34+MLT3S6AAALDUlEQVR4nO2d63qqOhCGKTsxkgrVaktF1FqPtdh2da3e/61tIAE5EzGE4MP3Z68qIO/OJJmZDEG5K9IeKI0I7Atv6yIpRV82xOdqUHhf3AjNxgDvB/9xQyy6UGOAHiE3xILr7Jsl/O++dsLmeiEh5NSKMhPyQZSakIuhFhDeN0/IA1FyQg6IshNe3xelJ7waUX7Caw21BYRXIraB8DrEVhBehdgOwmuGm5YQXoHYFsLqiK0hrNwX20NYFbFFhBUNtU2E1VqxVYSVENtFWMVQW0ZYoRVFEwLAkhzJJ7wcUSghMJWpPWdALCC8GFEgIVBOq62KtaNSylhEeGlfFEcIbANqSFVV3C9FLCS8EFEYIZgiD88TXl1HeJmhCiM0D5oaCM5KEEsIL0IURQjeoHoWfC9GLCO8BFEY4RpFCFG/+OhSwgsQBRGCObFRhAmiXjxnlBOyDzeiCBe+kaKtTUjh6VpCZkRBhObMbzy4+LP0/4GXVxOyGqoowqPmN6ECLN0n3BUuoTMRMiIKJcQzkw452oYDIRuiUELYAwrYYW6ETH1RFOHGJ5y6hH5H5GKlbIiixlJ/pIGWEhByGGkYDVUU4QkGbehbKYfZghVRFKENg37o+Pa64EVYiiiKcBrOEf6Ur9vcCMsQhfmlfd8vtYDtz4e6VXj0RYQlw40oQnPjDzCbPzvimRYffRlhMaLg6Am+Gr5/uuZKWIgoLAK2SHxIWlDblEX5g8tUUI8qMMaPBIj4g3PBFZCAELxGgnxv2uB7dQkIAzMlbTi9RUIy1dMkxoDvtZWCOVEg4SJsRG3Fu8BaCkLFMsKEKe+BRhJCk072NQw0khACOyBUp5wvLQmhYtKcKepzf85BEkLwpqsMaagqkoRQAWSswcubJQw9t+LYqYJkIRxM6Gwxu835MLr+xNtrk4TwPCHisgXESyUJIc1k1OF6y0EYrLD5hEO+PVESwlMkfipJtl0qSQhX5zZUNecGCS2D+GykM5bkhC+UFITgHZLYkDQlMnhGwXIQ7ugyMA0xuE77UhAq1CmdmkeCCFkq3BglAyFN56ODCWhOSlvfFiGtVcCvQDFpYhG+crNTKQiJkZJCGurcIG6ejQSEYE4Lajwm0KN2WlrCxyoJCE1aR0Nc7sAH10+c7FQCQkCCX0idtQHNLOqc7LR5QppnCyv2wLtOx1M+12+eMDTSwCrDSZFPzqZ5QoUYKT5HFEEGvKzUlE2NE5JSjFhZKXVTVaRaHBCbJ5wljFTxxlPIL45qnpCGvTFPFPRprSkHF7xpQjpyom0MBUxpYqqkQIpFTROaQ7+1kotq4Yoivjql0TShlTO9gw2v0aZhQpqCyvJC16QratsB+Q64Mk3g/4ftITA5CMkKfkZmBlg0a4MdxSW7t+a908dsszmujpvZR2/KzNgsIZgTj83IWI8JogwVHxe71cGAEGKMNU8YQ+Qsyp8Ck4AwiH0zC5/NBR1QNYi16EMn9MM+W6qjWUIaR6QX792OZvU+jCRWnFFjQmyUkK44kdg3Qmda9sdK1XEhoIt4YPmRRglNJzUZunjTxdFw7bIEz5P+xvLQaYOEYEqWRcOaWdc27eUBwnSv84W9/uh+hdyOST7YSU5IExba0R9ngDmwZ4aOs+k8Y36151PLGgysaW+nkTMlJ6TjjO4VsZtKb9eHKTwN6zCwV2TYJp38TeLUyd6GwUNrB/eO5zMjiefaoo5Xr7blBCtvCJ8IojlVyRjM4pc32YakSgi/Wq/bpHG6Pc0YnubESzuGi4v60XJ9mcGCAKoaS+FGc4SBz4Ic10OJNZ77t9t2ihk4ZmCph4MNdlZrRI9nMtImCYe0gyXwdGP3bsVda7fbhQehcKBFbGUbjRGCqa4m5bbedmkraacazPswdbTOtpDaGOGfHU7i4cPSNrNjBgBmSR+ANcPREKFpfcSHFqwflvOisM+0HT3CiEof3G+U0LRmatTqNKjtsowzJgB6zoQOuQiqLA5bU4TAmuGIhbrW6bwpJsMNuy7rx8F1AjTVOTEGh00QAmup4Wjz9ZdzFjxysuvazefzAfMJinBCAE5GbI8I5+2i21VYN+o5SyyhafdjszuyL7zdChJJCKzNJDaC1lDznJZAQvPNSEyBJQ9T8pEwQqBs9ERsJKQJhRGC+TZswAAU8i4HzpQgQvMtDI80PAyaUMjW7mIIzXP9KFzbS9qaQppQDOEZUIOvYEofiuVelZ8tEYTmIgiUoDM1zaBalveDhjkSQEgL8zwPdOk6JD3yF/wQ9CYXAYT3WxoQ4HcXakD+Qoao3SXrJzSXNB+DvGUGuhbDlq7motoJybYXQVaF1pZwLMwrVf2EtGJU8xfkqY2qbMtGXFQ/4YquvngDC+eCLibVTkhbzfD+HVQAo77AF9XUT0iYHDPygBrPQvVS1U9Ill+MATDfaTIXFu8ExVn190OyCqqt7k8wLK4QKXFjKaQmigweFYfsqn/GtxILE0I7oSKCMPbknQv4LvjNgiI87/P6H/VNhUpE9HRGxIYt/N2QQiJgsIQYIQ3DjdhBxpeYLAaYz9ZbZyl4jCESlIkCRHUQlKnpCtr61RF2hPKrI+wI5VdH2BHKr46wI5RfHWFHKL86wo5QfnWE2QJtUiVCu9ce2ZUIDR22RbpRibCf+widdEL9jrAjlF0dYUcovzrCjlB+dYQdofyqkxBHXXycsd8FikcBuGA/k9zQoXQLlBoJ8ec4os/HtR7fWEBF6+gB4+fPjYNyNv4wnsc5csoQayTUfxMnjcb92NNr2jB13f3Dp6Gn7xkZua+HeyzbpqdOwof0eT/RJxAzCP1jHJi8OjJGbSG82w/PVXw5hHd3X9vkZgQtInRv6fwCsjzCu9EmvqOE3IT7z2dX46+QdxjcU0D45R0x/v6J/h/5nGQRvjyn5JTdSf2Eo78Ye/PGZPtDTw5qhgPCx4l/gD6ZrL7DtnqOld1Swqe/qdmi9EYEEAatgSaf5OQfPUEYGpqmo+fgJx4jiCFhejuUUgkkdD/5JmfTN5ClCT0nYP2S/o3WEKItmdaoBWYReo8J03n0IXJiWwjVyZP/0a9eQKgiRDvj8Pzwd2sIIellL2oRoYo35PNzI7aHEP8jH5GHvfIIVUjnDee8U9uNEeJH8sU43KitPYRkvhiRv3IJUZ+MSL/tI4Rj/6OXorHUP5XMGHv6wGmLCCdkIvgqHEu9U8mYG3bE1hBq6xhSPiFt6/CbXK+tzO0WTah/+Z/s1XyfJk74L0G4f/iNa5zep65BQjRJDJEFhNQ7/UwQpvQjBWFgWSptmH24C0hpG7aDcE/iuPFTcG4qPmS3UjkJk0rH+BmE3/FvAsLRU1wPz+VDjQx5mvzZYpicLf7qcUkxlsb0HR3f8wknNEZct2LGDzV6+mfE7jDfa6Pp0ZHRCsLR8NHVZrhObWSdS6ityBdt8Uu9TBQmW40nQHKjJzodtjC2YCWkeYxh++JDNkLNIZ+PwmH31gh1mlgd3yohXtEfMcIfuS1CHHho32ecmyKEfTrb789NeDOECGlw8i9YC41lwttOCJEn1egPx2EMMY7CtJ1w9EIUjZBigK0nzNBn9grpzRA+JV8TcFuE+5/VJHn1INiQjBA+jTz95t6VNhzF9fL78P24zag2UY0X/wCGpIVIQtUgKj8ikFdFlfOqIP8yxa/waoBQJZNA6RGhqgCU30RXudcRSq+OMEeHFhEeKhEeGVKxkggfKxG+V3AuGpL+XonwbtWWRgxzIpcSjpws50o6abqTW7dZQnh397Wq5EQJlbH6KmT4H1bSWVRkok+LAAAAAElFTkSuQmCC'
      })
      return
    }
    const converImage = async(image) => {
      const urlImage = await axios.get(image.url.uri)
      imageAttachment.value.push({
        name: 'file',
        type: image.content_type,
        url: buildImageFromArrayBuffer({
          arrayBuffer: urlImage.data.result.data
        })
      })
      return urlImage.data.result.data
    }

    const submitUpload = () => {
      uploadAttachment({
        tableName: props.tableName,
        recordId: props.recordId,
        recordUuid: props.recordUuid,
        list: listImageAll.value
      })
    }
    const beforeAvatarUpload = (file) => {
      listImageAll.value.push({
        name: file.name,
        type: file.type,
        status: 'newImage',
        uuid: file.uid,
        url: URL.createObjectURL(file)
      })
      newImage.value.push(URL.createObjectURL(file))
    }

    return {
      dialogImageUrl,
      dialogVisible,
      disabled,
      newImage,
      newListImage,
      fileList,
      imageAttachment,
      pdfAttachment,
      organizationBackground,
      currentImageOfProduct,
      organizationImagePath,
      // computed
      listImage,
      listImageAll,
      Attachment,
      // methods
      // submitUpload,
      submitUpload,
      beforeAvatarUpload,
      converFile,
      // isEmptyValue,
      converImage,
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
