<template>
  <div>
    <div class="inlinebox" @click="showSelect">
      <span class="color-primary font-middle">{{startTime.substr(5, 11) || '开始时间'}}</span>
      到
      <span class="color-primary font-middle">{{endTime.substr(5, 11) || '结束时间'}}</span>
    </div>
    <van-calendar v-model="showDate" :default-date="defaultDay" type="range" :min-date="minDate"  @confirm="changeDate" class="dk-calendar-box" />
  </div>
</template>
<script>
import  { momentFormat } from '@/libs/util'

export default {
  name: 'time_box',
  props: {
    minDays: Number
  },
  components: {
  },
  data () {
    let today = Date.now()
    let day = 24 * 3600 * 1000
    let minDate = new Date(Date.now() - 40 * day)
    if(this.minDays) {
      minDate = new Date(Date.now() - this.minDays * day)
    }

    return {
      showDate: false,
      endTime: '',
      startTime: '',
      defaultDay: [new Date(today - 3 * day), new Date()],
      minDate
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    showSelect() {
      console.log('this showSelect')
      this.showDate = true
    },
    formatTime(date) {
      let dateStr = momentFormat(date).format('YYYY-MM-DD')
      console.log('dateStr --->', dateStr)
      return dateStr
    },
    // formatTime(date) {
    //   let str = momentFormat(momentFormat(date).format('YYYY-MM-DD 00:00:00'), 'YYYY-MM-DD HH:mm:ss').add(this.currentLeagueInfo.dayBegin, 'hour')
    //   console.log('formatTime =====>', str, this.accountInfo)
    //   return str.format('YYYY-MM-DD HH:00')
    // },
    changeDate (date) {
      if (date.length !== 2) {
        this.$notify('请先选择时间')
        return
      }
      const [start, end] = date

      this.startTime = this.formatTime(start)
      this.endTime = this.formatTime(end)

      console.log('this.startTime --->', this.startTime)
      this.showDate = false
      this.$emit('on-change-date', {
        startTime: this.startTime,
        endTime: this.endTime,
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
