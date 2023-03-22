<template>
  <div class="game-container">
    <div class="back_home" @click="goHome">
      <el-button round>←图寻首页</el-button>
    </div>
    <div v-if="disband" class="disband">
      派对不存在或者已经解散
      <div>
        <el-button round @click="goParty">去派对首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../../api/api";
import {tuxunJump} from "./common";

export default {
  name: "join",
  data() {
    return {
      joinCode: null,
      disband: false,
    }
  },
  mounted() {
    if (this.$route.query.code) {
      api.getByPath('/api/v0/tuxun/party/join', {joinCode: this.$route.query.code}).then(res=>{
        if (res.success) {
          tuxunJump('/tuxun/party')
        } else if (res.errorCode === 'need_login') {
          this.doLoginStatus().then((res) => {
          });
        } else {
          this.disband = true;
        }
      })
    }
  },
  methods: {
    goHome() {
      tuxunJump('/tuxun/')
    },
    goParty() {
      tuxunJump('/tuxun/party')
    },
  }
}
</script>

<style lang="scss" scoped>
.game-container {
  position: absolute;
  width: 100%;
  min-height: 100%;
  text-align: center;
  background-color: #18182A;
  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
    z-index: 5000;
  }
  .disband {
    color: white;
    margin-top: 5rem;
    font-size: 16px;
  }
}
</style>
