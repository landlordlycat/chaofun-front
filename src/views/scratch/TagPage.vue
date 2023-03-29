<template>
  <div class="container">
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" size="small" round>←返回</el-button>
      <el-button @click="goHome" size="small" round>首页</el-button>
    </div>
    <div style="text-align: center; width: 100%; font-size: 32px;font-weight: bold; padding-top: 3rem; padding-bottom: 2rem">
      #{{this.tagName}}
<!--      <div class="top-right">-->
<!--&lt;!&ndash;        <el-button type="primary" @click="toUserHome" round>个人首页</el-button>&ndash;&gt;-->
<!--        <el-button @click="toCreate" round>创建小测验</el-button>-->
<!--        <div></div>-->
<!--        <el-button type="primary" @click="random" round>随机小测验</el-button>-->
<!--      </div>-->
    </div>

    <section class="list_container">
      <scratch-list :tag.sync="this.tagName" :sort="sort" :current="this.current"></scratch-list>
    </section>
  </div>
</template>

<script>
import * as api from '../../api/api'
import ScratchList from "./scratch-list";

export default {
  name: "TagPage",
  components: {ScratchList},
  data() {
    return {
      totalTimes: null,
      sort: 'hot',
      tagName: null,
      current: 1,
      list: [],
      history: null
    }
  },
  created() {
    this.history = history;
    this.tagName = this.$route.query.tagName;
    if (this.$route.query.sort) {
      this.sort = this.$route.query.sort;
    }

    console.log(this.$route.query.page)
    if (this.$route.query.page) {
      // console.log()
      this.current = parseInt(this.$route.query.page);
    }
  },

  methods: {
    gotoGuess(item) {
      window.location.href = '/scratch/guess?id=' + item.id;
    },

    toCreate() {
      this.doLoginStatus().then((res) => {
        if (res) {
          window.location.href = '/scratch/create'
        }
      });
    },
    random() {
      api.getByPath('/api/v0/scratch/game/random').then(res=>{
        window.location.href = '/scratch/guess?id=' + res.data;
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

  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  .list_container {
    max-width: 40%;
    margin: auto;
  }
  .cover {
    width: 100px; height: 100px;
    //background-color: grey;
    object-fit: cover;
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
}

@media only screen and (max-width: 768px) {
  .container {

    .list_container {
      max-width: 90%;
      margin: auto;
    }

    .container {
    }
  }
}

</style>
