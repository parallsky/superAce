<template>
  <div class="textcenter padvfix">
    <div class="inlinebox">
      <van-radio-group v-model="dateType" direction="horizontal" @change="newTimeOp" class="font-middle">
        <van-radio name="today">今天</van-radio>
        <van-radio name="yestoday">昨天</van-radio>
        <van-radio name="history" @click="showDate = true">自定义</van-radio>
      </van-radio-group>
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
    console.log('minDays ---->', minDate)
    if(this.minDays) {
      minDate = new Date(Date.now() - this.minDays * day)
    }

    return {
      dateType: 'today',
      showDate: false,
      historyTime: {
        endTime: '',
        startTime: ''
      },
      defaultDay: [new Date(today - 3 * day), new Date()],
      minDate
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    formatTime(date) {
      let dateStr = momentFormat(date).format('YYYY-MM-DD')
      console.log('dateStr --->', dateStr)
      return dateStr
    },
    changeDate (date) {
      console.log('date ---->', date)
      if (date.length !== 2) {
        this.$notify('请先选择时间')
        return
      }
      const [start, end] = date

      this.historyTime.startTime = this.formatTime(start)
      this.historyTime.endTime = this.formatTime(end)
      this.showDate = false
      this.$emit('on-change-date', {
        ...this.historyTime,
        dateType: this.dateType
      })
    },
    newTimeOp() {
      this.$emit('on-change-date', {
        dateType: this.dateType
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
