<template>
  <div class="container">
    <div class="back_home">
      <el-button v-if="history && history.length > 1" size="small" @click="goBack" round>←返回</el-button>
      <el-button @click="goHome" size="small" round>首页</el-button>
    </div>
    <div class="profile-container">

      <div v-if="userStats" class="user">
        <div class="name">
          {{userStats.userName}}
        </div>
        <div class="id">
          (uid: {{userStats.userId}})
        </div>
      </div>

      <div v-if="userStats"  class="stats">
        <div class="header">
          统计信息
        </div>
        <div>
          创建题数：{{userStats.createScratchTotal}}
        </div>
        <div>
          创建题测验次数：{{userStats.createScratchTaken}}
        </div>
        <div>
          测验题数：{{userStats.scratchTaken}}
        </div>
      </div>
      <div class="header">
        发布的小测验
      </div>
      <scratch-list :has-create="false" :has1-day="false" :user-id="parseInt(this.userId)"></scratch-list>
    </div>
  </div>

</template>

<script>
import ScratchList from "./scratch-list";
import * as api from '../../api/api'
export default {
  name: "profile",
  components: {ScratchList},

  data() {
    return {
      list: [],
      userId: null,
      userStats: null,
      history: null,
    }
  },
  created() {
    this.history = history;
    this.userId= this.$route.path.split("/")[this.$route.path.split("/").length - 1];
    this.getUserStats()
  },
  methods: {
    getUserStats() {
      api.getByPath('/api/v0/scratch/user/stats', {'userId': this.userId }).then(res=>{
        this.userStats = res.data;
      })
    },
    goHome() {
      window.location.href = '/scratch'
    },
    goBack() {
      try {
        this.$router.go(-1);
      } catch (e) {
        window.location.href = '/scratch'
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.back_home {
  position: absolute;
  padding-top: 1rem;
  padding-left: 1rem;
}

.container {

  .profile-container {
    width: 40vw;
    margin: auto;
    margin-top: 3rem;
    .user {
      .name {
        font-size: 24px;
        font-weight: bold;
      }
    }
    .stats {
    }
    .header {
      margin-top: 2rem;
      font-weight: bold;
      font-size: 20px;
    }

  }
}

@media only screen and (max-width: 768px) {
  .container {
    .profile-container {
      width: 90vw;
    }
  }
}
</style>
