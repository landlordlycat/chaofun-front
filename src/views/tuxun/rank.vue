<template>
  <div class="container">
    <div class="top-left">
      <el-button type="primary" @click="goHome" round>←返回首页</el-button>
    </div>
    <div style="margin: 0 auto;width: 640px;max-width: 100%;padding: 10px;  ">

      <div style="display: flex;justify-content: center; align-items: center; padding-top: 4rem">
        <img alt="" src="../chaofun-webview/assets/images/rank.png">
        <span style="font-size: 18px; color: white">Top 100</span>
      </div>
      <div style="display: flex;justify-content: space-around;position: relative;margin-top: 10px;">

        <!-- 第2名 -->
        <div
            v-if="pagedata && pagedata.length >= 2"
            class="podium" style="position: relative;top: 30px;"
            @click="toUser(pagedata[1])">
          <span style="display: block;color: #C0C0C0;font-weight: bold;font-size: 120%;">{{ pagedata[1].rating }}</span>
          <img :src="imgOrigin+pagedata[1].userAO.icon + '?x-oss-process=image/resize,h_100/format,webp/quality,q_75'"
               alt=""
               style="width: 50px; height: 50px; border-radius: 100%;border: 2px solid #C0C0C0;">
          <span
              style="display: block;color: #C0C0C0;font-weight: bold;font-size: 120%;">{{ pagedata[1].userAO.userName
            }}</span>
        </div>

        <!-- 第1名 -->
        <div
            v-if="pagedata && pagedata.length >= 0"
            class="podium" style="position: relative;"
            @click="toUser(pagedata[0])">
          <span style="display: block;color: #FFD700;font-weight: bold;font-size: 120%;">{{ pagedata[0].rating }}</span>
          <img :src="imgOrigin+pagedata[0].userAO.icon + '?x-oss-process=image/resize,h_120/format,webp/quality,q_75'"
               alt=""
               style="width: 60px; height: 60px; border-radius: 100%;border: 2px solid #FFD700;">
          <span
              style="display: block;color: #FFD700;font-weight: bold;font-size: 120%;">{{ pagedata[0].userAO.userName
            }}</span>
        </div>

        <!-- 第3名 -->
        <div
            v-if="pagedata && pagedata.length >= 3"
            class="podium" style="position: relative;top: 30px;"
            @click="toUser(pagedata[2])">
          <span style="display: block;color: #C47222;font-weight: bold;font-size: 120%;">{{ pagedata[2].rating }}</span>
          <img :src="imgOrigin+pagedata[2].userAO.icon + '?x-oss-process=image/resize,h_100/format,webp/quality,q_75'"
               alt=""
               style="width: 50px; height: 50px; border-radius: 100%;border: 2px solid #C47222;">
          <span
              style="display: block;color: #C47222;font-weight: bold;font-size: 120%;">{{ pagedata[2].userAO.userName
            }}</span>
        </div>

      </div>

      <div>
        <img :src="imgOrigin+  'biz/1657789683976_d8ce47d3156c437f8ab54e2008daf398.png'" alt="" style="width: 100%;">
      </div>

      <div v-for="(item,index) in pagedata" v-if="index>2" :key="index" class="list" @click="toUser(item)">
        <span style="width: 28px;text-align: center;">{{ item.rank }}</span>
        <img :src="imgOrigin+item.userAO.icon + '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'" alt=""
             style="width: 40px; height: 40px; border-radius: 100%;margin: 0 5px;">
        <span style="flex: 1;">{{ item.userAO.userName }}</span>
        <span style="width: 60px;text-align: right;">{{ item.rating }}</span>
      </div>
      <div class="footer">

      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/api/api";
import {tuxunJump, tuxunOpen} from "./common";


export default {
  name: "tuxunRank",
  components: {},
  data() {
    return {
      pagedata: [],
      timer: 0
    };
  },
  created() {
  },
  mounted() {
    this.getButtonRank();

    let _this = this;
    setInterval(() => {
      _this.getButtonRank();
    }, 5000);
  },
  methods: {
    getButtonRank() {
      api.getByPath("/api/v0/tuxun/getRank").then(res => {
        this.pagedata = res.data;
      });
    },
    toUser(item) {
      tuxunOpen("/tuxun/user/" + item.userAO.userId);
    },

    goHome() {
      tuxunJump('/tuxun/');
    },
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100%;
  background-color: #090723;
  .top-left {
    position: absolute;
    padding-top: 2rem;
    padding-left: 2rem;
  }
}
div {
  color: white;
}
.list {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 2px 0;
  padding: 2px 4px;
  border-bottom: 1px solid #f9f9f9;

  &:hover {
    background-color: grey;
  }
}

.podium {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 30%;
}
.footer {
  height: 10rem;
}

@media only screen and (max-width: 768px) {
  .container {
    .top-left {
      padding-left: 1rem;
      padding-top: 1rem;
    }
  }
}
</style>
