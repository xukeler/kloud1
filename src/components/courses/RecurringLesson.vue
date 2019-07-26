<template>
  <div class="recurring-lesson">
    <div class="header-part">
      <!-- <div class="header-item"> Start Date: <DatePicker v-model="startDate" type="date" placeholder="Select start date"></DatePicker></div>
      <div class="header-item"> End Date: <DatePicker v-model="endDate" type="date" placeholder="Select start date"></DatePicker></div> -->
      <div class="header-item"> Start Date: <input id="recurringStartPicker" /></div>
      <div class="header-item"> End Date: <input id="recurringEndPicker" /></div>
      <div class="header-item"> Lessons per Week: <InputNumber :min="1" :max="12" v-model="lessonAmount"></InputNumber></div>
      <!-- <div class="header-item"> Duration per Lesson (minutes): <InputNumber :min="15" :max="180" :step="15" v-model="lessonDuration"></InputNumber></div> -->
    </div>
    <div class="content-part">
      <recurring-lesson-item style="margin-bottom: 2px;" v-for="lessonItem in lessonList" :lesson-id="lessonItem.id" :lesson-info="lessonItem" :key="lessonItem.id"></recurring-lesson-item>
    </div>
  </div>
</template>

<style lang="scss">
.recurring-lesson {
  padding: 10px;

  .header-part {
    .header-item {
      display: inline-block;
      margin-right: 2em;  
    }
  }

  .content-part {
    margin-top: 1em;
  }
}
</style>

<script>
import auth from '../../authenticator';
import util from "../../common/util.js";
import RecurringLessonItem from './RecurringLessonItem.vue';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  components: {
    RecurringLessonItem
  },
  props: {
    courseType:{
      type: Number,
      default: 0
    },
    courseId: {
      type: Number,
      default: 0
    },
    isCreating: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      initialized: false,
      loading: false,
      isDirty: false,
      startDate: '',
      endDate: '',
      lessonAmount: 1,
      //lessonDuration: 45,
      lessonList: [],
    };
  },
  watch: {
    lessonAmount(to, from) {
      this.$nextTick(() => {
        this.isDirty = true;
        this._resetLessonList();
      });
    },
  },
  computed: {
    ...mapState(["Klassroom", "KlassroomSettings"]),

    currentTerm() {
      return this.Klassroom.currentTerm;
    },
  },
  mounted() {
    let self = this;
    this.$nextTick(() => {
      util.LoadKendoFiles().then(()=>{
        $("#recurringStartPicker").kendoDatePicker({
          value: self.startDate,
          change: function() {
            self.startDate = this.value();
            self.isDirty = true;
          }
        });
        $("#recurringEndPicker").kendoDatePicker({
          value: self.endDate,
          change: function() {
            self.endDate = this.value();
            self.isDirty = true;
          }
        });
      });
    });
  },
  methods: {
    clear() {
      this.initialized = false;
      if (this.currentTerm) {
        this.startDate = new Date(this.currentTerm.start);
        this.endDate = new Date(this.currentTerm.end);

        let picker = $("#recurringStartPicker").data("kendoDatePicker");
        if (picker)
          picker.value(this.startDate);

        picker = $("#recurringEndPicker").data("kendoDatePicker");
        if (picker)
          picker.value(this.endDate);
      }
      this.lessonAmount = 1;
      this.lessonDuration = 45;
      this.lessonList = [];
    },
    initialize() {
      this.readData();
    },
    refresh() {
      this.readData();
    },
    readData() {
      if (this.isCreating) {
        this._resetLessonList();
        return;
      }

      let self = this;
      let url = GetAPIUrl() + "Course/GetRecurringLesson?courseID=" + this.courseId;
      this._getData(url, null, (data) => {
        if (data.StartDate) {
          self.startDate = new Date(parseInt(data.StartDate));
          self.endDate = new Date(parseInt(data.EndDate));

          $("#recurringStartPicker").data("kendoDatePicker").value(self.startDate);
          $("#recurringEndPicker").data("kendoDatePicker").value(self.endDate);
        }

        if (data.LessonAmount > 0) {
          self.lessonAmount = data.LessonAmount;

          let lessons = [];
          for (let i = 0; i < data.LessonList.length; i++) {
            let item = data.LessonList[i];
            let lesson = {
              id: item.LessonID,
              title: "Lesson " + (-item.LessonID) + ": ",
              date: item.DayOfWeek,
              start: new Date(parseInt(item.StartTime)),
              end: new Date(parseInt(item.EndTime)),
              error: '',
            };
            lessons.push(lesson);
          }

          self.lessonList = lessons;
        }
        self._resetLessonList();
        self.isDirty = false;
      }, null);
    },
    checkData() {
      if (this.endDate < this.startDate) {
        this.$Message.error(this.$t('AddLesson.EndShouldLaterThanStart'));
        return false;
      }

      let result = true;
      for (let i = 0; i < this.lessonList.length; i++) {
        let lesson = this.lessonList[i];
        if (lesson.end < lesson.start) {
          lesson.error = this.$t('AddLesson.EndShouldLaterThanStart');
          result = false;
        }
        else {
          lesson.error = '';
        }
      }

      return result;
    },
    _checkDirty() {
      if (this.isDirty) {
        return true;
      }

      for (let i = 0; i < this.lessonList.length; i++) {
        if (this.lessonList[i].dirty) {
          return true;
        }
      }

      return false;
    },
    saveData(newCourseId, enabled, callback) {
      if (!this._checkDirty()) {
        return;
      }

      let lessons = [];
      if (enabled) {
        lessons = this._getLessonList();
      }

      let standard = new Date(2000, 0, 1, 0, 0, 0);
      let data = {
        CourseID: newCourseId > 0 ? newCourseId : this.courseId,
        StartDate: this.startDate.getDatePart(),
        EndDate: this.endDate.getDatePart(),
        LessonAmount: enabled ? this.lessonAmount : 0,
        LessonList: lessons,
      };

      let self = this;
      let url = GetAPIUrl() + "Course/SetRecurringLesson";
      this._postData(url, data, null, (result) => {  
        self.readData();
        if (callback && typeof callback === 'function') {
          callback();
        }
      }, null);
    },
    _resetLessonList() {
      let currentAmount = this.lessonList.length;
      for (let i = this.lessonAmount; i < currentAmount; i++) {
        this.lessonList.pop();
      }
      currentAmount = this.lessonList.length;
      for (let i = currentAmount; i < this.lessonAmount; i++) {
        let item = {
          id: -(i + 1),
          title: "Lesson " + (i + 1) + ": ",
          date: (i + 1) % 7,
          start: new Date(2000, 0, 1, 8, 0, 0),
          end: new Date(2000, 0, 1, 9, 0, 0),
        };

        this.lessonList.push(item);
      }
    },
    _getLessonList() {
      let lessons = [];
      let date = new Date(this.startDate.getDatePart());
      let start, end, differ;
      for (let i = 0; i < this.lessonList.length; i++) {
        differ = this.lessonList[i].date - date.getDay();
        start = new Date(date.getTime() + this.lessonList[i].start.getTimePart());
        start.setDate(start.getDate() + differ);
        end = new Date(date.getTime() + this.lessonList[i].end.getTimePart());
        end.setDate(end.getDate() + differ);
        let item = {
          LessonID: this.lessonList[i].id,
          DayOfWeek: this.lessonList[i].date,
          StartTime: start.getTime(),
          EndTime: end.getTime(),
        };
        lessons.push(item);
      }

      lessons.sort((a, b) => {
        let order = a.DayOfWeek - b.DayOfWeek;
        if (order !== 0)
          return order;

        return a.StartTime - b.StartTime;
      });
      
      return lessons;
    },
    _getData(url, before, success, error) {
      if (before && typeof before === 'function') {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: 'GET',
        url: url,
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function (result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === 'function') {
              success(result.RetData);
            }
          }
          else { // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === 'function') {
              error(result);
            }
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ': ' + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === 'function') {
            error();
          }
        }
      });
    },
    _postData(url, data, before, success, error) {
      if (before && typeof before === 'function') {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        data: JSON.stringify(data),
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function (resultString) {
          let result = JSON.parse(resultString);
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === 'function') {
              success(result.RetData);
            }
          }
          else { // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === 'function') {
              error(result);
            }
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ': ' + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === 'function') {
            error();
          }
        }
      });
    },
    _deleteData(url, before, success, error) {
      if (before && typeof before === 'function') {
        before();
      }

      this.loading = true;
      this.$Loading.start();

      let self = this;
      $.ajax({
        type: 'DELETE',
        url: url,
        beforeSend: function (request) {
          request.setRequestHeader("UserToken", auth.getUserToken());
        },
        success: function (result) {
          if (result.RetCode === 0) {
            self.loading = false;
            self.$Loading.finish();

            if (success && typeof success === 'function') {
              success(result.RetData);
            }
          }
          else { // error
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(result.ErrorMessage);
            console.log(result);

            if (error && typeof error === 'function') {
              error(result);
            }
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          self.loading = false;
          self.$Loading.error();
          self.$Message.error(xhr.status + ': ' + xhr.statusText);
          console.log(xhr);

          if (error && typeof error === 'function') {
            error();
          }
        }
      });
    }
  }
}
</script>
