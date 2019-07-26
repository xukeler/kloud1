<template>
  <div class="course-lessons">
    <div v-if="isKlassroom" style="padding:1em 0;">
      <Button shape="circle" size="large" :type="isRecurring ? 'primary' : 'default'" :icon="isRecurring ? 'android-radio-button-on' : 'android-radio-button-off'" style="margin-right:2em;" @click="handleRecurring">Recurring Lesson</Button>
      <Button shape="circle" size="large" :type="!isRecurring ? 'primary' : 'default'" :icon="!isRecurring ? 'android-radio-button-on' : 'android-radio-button-off'" @click="handleNonRecurring">Non-Recurring Lesson</Button>
    </div>
    <div v-if="isKlassroom" v-show="isRecurring">
      <recurring-lesson ref="recurringLesson" :is-creating="isCreating" :course-id="courseId" :course-type="courseType"></recurring-lesson>
    </div>

    <div v-show="!isRecurring">
      <lesson-list ref="lessonList" :is-creating="isCreating" :course-id="courseId" :course-type="courseType"></lesson-list>
    </div>
  </div>
</template>

<style lang="scss">
.course-lessons {
  padding: 0;
}
</style>

<script>
import LessonList from './LessonList.vue';
import RecurringLesson from './RecurringLesson.vue';

export default {
  components:{
    LessonList, RecurringLesson
  },
  props: {
    courseType: {
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
    lessonAmount: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      isRecurring: false,
    };
  },
  watch: {
    lessonAmount(to, from) {
      this.$nextTick(() => {
        this.isRecurring = this.lessonAmount > 0;
      })
    }
  },
  computed: {
    isKlassroom() {
      return IsKlassroom();
    },
  },
  mounted() {
    this.isRecurring = this.lessonAmount > 0;
  },
  methods: {
    clear() {
      if (this.isKlassroom)
        this.$refs.recurringLesson.clear();

      this.$refs.lessonList.clear();
    },
    initialize() {
      if (this.isKlassroom)
        this.$refs.recurringLesson.initialize();

      this.$refs.lessonList.initialize();
    },
    refresh() {
      if (this.isKlassroom)
        this.$refs.recurringLesson.refresh();

      this.$refs.lessonList.refresh();
    },
    checkData() {
      let result = true;
      if (this.isKlassroom)
        result = this.$refs.recurringLesson.checkData();

      if (result)
        result = this.$refs.lessonList.checkData();
      
      return result;
    },
    saveData(newCourseId, lectureRelation, memberData, callback) {
      if (this.isKlassroom) {
        this.$refs.recurringLesson.saveData(newCourseId, this.isRecurring, this.isRecurring ? callback : null);

        if (!this.isRecurring) {
          this.$refs.lessonList.saveData(newCourseId, lectureRelation, memberData, callback);
        }
      }
      else {
        this.$refs.lessonList.saveData(newCourseId, lectureRelation, memberData, callback);
      }
    },
    handleRecurring() {
      this.isRecurring = true;
    },
    handleNonRecurring() {
      this.isRecurring = false;
    },
  },
}
</script>

