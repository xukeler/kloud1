<template>
  <div class="recurring-lesson-item">
    <table>
      <!--<tr>
        <td style="text-align: center;">{{lessonInfo.title}}</td>
        <td><DatePicker v-model="lessonInfo.date" type="date" placeholder="Start Date" :clearable="false" style="width: 100%" @on-change="dateChanged"></DatePicker></td>
        <td><TimePicker v-model="lessonInfo.start" type="time" placeholder="Start Time" format="HH:mm" :steps="[1, 10, 10]" :clearable="false" style="width: 100%" @on-change="startChanged"></TimePicker></td>
        <td><TimePicker v-model="lessonInfo.end" type="time" placeholder="End Time" format="HH:mm" :steps="[1, 10, 10]" :clearable="false" style="width: 100%" @on-change="endChanged"></TimePicker></td>
      </tr>-->
      <tr>
        <td style="text-align: center;">{{lessonInfo.title}}</td>
        <td> 
          <Select v-model="lessonInfo.date" style="width:100%;" @on-change="dateChanged">
            <Option v-for="item in weekdateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </td>
        <td><input :id="startPickerId" style="width:100%" /></td>
        <td><input :id="endPickerId" style="width:100%" /></td>
      </tr>
      <tr v-show="lessonInfo.error">
        <td></td>
        <td colspan="3" style="padding: 0 0.5em;"><Alert type="error" show-icon>{{lessonInfo.error}}</Alert></td>
      </tr>
    </table>
  </div>
</template>

<style lang="scss">
.recurring-lesson-item {
  background-color: #eeeeee;
  padding: 1em;
  position: relative;

  table {
    width: 100%;

    td {
      width: 25%;
      padding: 0.5em;
    }
  }
}
</style>

<script>
import util from "../../common/util.js";

export default {
  props: ["lessonId", "lessonInfo"],
  data () {
    return {
      weekdateList: []
    };
  },
  computed: {
    startPickerId() {
      return 'recurring-lesson-item-start-time-picker-' + this.lessonId;
    },
    endPickerId() {
      return 'recurring-lesson-item-end-date-picker-' + this.lessonId;
    }
  },
  mounted() {
    let self = this;

    this.$nextTick(() => {
      util.LoadKendoFiles().then(()=>{
        $("#" + this.startPickerId).kendoTimePicker({
          value: this.lessonInfo.start,
          interval: 15,
          min: new Date(2000, 0, 1, 7, 0, 0),
          change: function() {
            self.lessonInfo.start = this.value();
            self.lessonInfo.dirty = true;
          }
        });
        $("#" + this.endPickerId).kendoTimePicker({
          value: this.lessonInfo.end,
          interval: 15,
          min: new Date(2000, 0, 1, 7, 0, 0),
          change: function() {
            self.lessonInfo.end = this.value();
            self.lessonInfo.dirty = true;
          }
        });
      });
    });

    let list = [];
    list.push({id: 0, name: 'Sunday'});
    list.push({id: 1, name: 'Monday'});
    list.push({id: 2, name: 'Tuesday'});
    list.push({id: 3, name: 'Wednesday'});
    list.push({id: 4, name: 'Thursday'});
    list.push({id: 5, name: 'Friday'});
    list.push({id: 6, name: 'Saturday'});
    this.weekdateList = list;
  },
  methods: {
    dateChanged() {
      this.lessonInfo.dirty = true;
    },
    startChanged() {
      this.lessonInfo.dirty = true;
    },
    endChanged() {
      this.lessonInfo.dirty = true;
    }
  }
}
</script>
