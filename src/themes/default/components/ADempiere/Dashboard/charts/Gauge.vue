<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { getMetrics } from '@/api/ADempiere/dashboard/chart'

const animationDuration = 2800

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    metadata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.unsubscribe = this.subscribeChanges()
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    this.unsubscribe()
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'notifyDashboardRefresh') {
          this.initChart()
        }
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.showLoading()
      getMetrics({
        id: this.metadata.id
      })
        .then(metrics => {
          this.loadChartMetrics(metrics)
        })
        .catch(error => {
          console.warn(`Error getting Metrics: ${error.message}. Code: ${error.code}.`)
        })
    },
    loadChartMetrics(metrics) {
      const xAxisValues = []
      let seriesToShow = []
      if (!this.isEmptyValue(metrics.series)) {
        seriesToShow = metrics.series.map(serie => {
          return {
            name: serie.name,
            animationDuration,
            type: 'gauge',
            min: 0,
            max: metrics.measureTarget,
            splitNumber: 15,
            radius: '100%',
            data: [{
              value: serie.data_set.map(set => set.value).reduce((partialSum, a) => partialSum + a, 0),
              name: metrics.name
            }],
            axisLine: {
              lineStyle: {
                color: metrics.colorSchemas.filter(colorSchema => colorSchema.percent > 0).map(colorSchema => {
                  return [
                    colorSchema.percent / 100,
                    colorSchema.color
                  ]
                }),
                width: 5,
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            splitLine: {
              length: 25,
              lineStyle: {
                width: 3,
                color: 'inherit',
                shadowColor: 'auto',
                shadowBlur: 10
              }
            },
            pointer: {
              shadowColor: 'auto',
              shadowBlur: 5
            },
            detail: {
              ackgroundColor: 'auto',
              borderColor: 'inherit',
              offsetCenter: [0, '50%'],
              fontWeight: 'bolder',
              fontSize: 20,
              fontStyle: 'italic',
              color: 'inherit',
              shadowColor: 'auto',
              shadowBlur: 10
            }
          }
        })
      }
      this.chart.setOption({
        toolbox: {
          show: true,
          feature: {
            dataView: xAxisValues,
            saveAsImage: {
              pixelRatio: 2
            },
            mark: {
              show: true
            },
            restore: {
              show: true
            }
          }
        },
        series: seriesToShow
      })
      this.chart.hideLoading()
    }
  }
}
</script>
