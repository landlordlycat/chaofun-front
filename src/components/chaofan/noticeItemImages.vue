<template>
  <span v-if="imageNames">
    <span v-for="(image,index) in imageArray" :key="index">
      <el-popover placement="bottom" trigger="hover" width="324">
        <viewer :images="[image]">
          <img :data-source="image" :src="image+ '?x-oss-process=image/resize,w_300/quality,q_75'"
               alt="" style="width: 300px;max-height: 80vh;"/>
        </viewer>
        <span slot="reference" style="color: #007bff;cursor: pointer;margin: 0px 3px;">[图片]</span>
      </el-popover>
    </span>
  </span>
</template>

<script>
export default {
  name: "noticeItemImages",
  props: {
    imageNames: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      imageArray: [],
    }
  },
  created() {
    this.init();
  },
  watch: {
    imageNames() {
      this.init();
    }
  },
  methods: {
    init() {
      this.imageArray = [];
      if (this.imageNames) {
        const imageArray = this.imageNames.split(",");
        imageArray.forEach(image => {
          this.imageArray.push(this.imgOrigin + image);
        });
      }
    },
  }
}
</script>

<style scoped>

</style>
