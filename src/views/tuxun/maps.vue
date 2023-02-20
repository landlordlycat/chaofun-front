<template>
  <div class="container">
      <div class="back_home">
        <el-button type="primary"  @click="goHome" round>←返回首页</el-button>
        <el-button type="primary" @click="goMapMakeHome" round>自建</el-button>
      </div>
      <div class="nav">
        练习赛题库
      </div>
      <div @click="searchFocus">
        <el-input v-model="keyword" id="input" placeholder="搜索练习赛" style="margin-top: 2rem; max-width: 60%;" round></el-input>
      </div>
      <section class="game_entrance" v-if="!search">
        <div class="first_session_head" v-if="recentPagedata && recentPagedata.length >= 1">最近玩过</div>
        <div class="line" v-if="recentPagedata && recentPagedata.length >= 1"></div>
        <div class="grid_main" v-if="recentPagedata && recentPagedata.length >= 1">
          <div v-for="(item, index) in recentPagedata" @click.stop="toMapsDetail(item)" :style="{'background-image': 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.6)), url('+ imgOrigin + (item.cover ?? 'biz/1659323781589_7d19c33667a54a4dabb0405ee5aec20f.jpeg') + '?x-oss-process=image/resize,h_400)','background-size':'cover'}"  class="card">
            <div class="title">
              {{item.name}}
            </div>
<!--            <div class="describe">-->
<!--              {{item.desc}}-->
<!--            </div>-->
            <div class="players">
              玩家人次: {{item.players}}
            </div>
            <div v-if="item.difficulty" class="players">
              难度: {{item.difficulty}}
            </div>
            <div>
              <el-button style="background-color: unset; color: white" @click.stop="toMaps(item, 'noMove')" type="primary"  round>固定</el-button>
              <el-button style="background-color: unset; color: white" @click.stop="toMaps(item, 'move')" type="primary" v-if="item.canMove" round>移动</el-button>
            </div>
          </div>
        </div>

        <div class="session_head">最新发布</div>
        <div class="line"></div>
        <div class="grid_main">
          <div v-for="(item, index) in newPagedata" @click.stop="toMapsDetail(item)" :style="{'background-image': 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.6)), url('+ imgOrigin + (item.cover ?? 'biz/1659323781589_7d19c33667a54a4dabb0405ee5aec20f.jpeg') + '?x-oss-process=image/resize,h_400)','background-size':'cover'}" class="card">
            <div class="title">
              {{item.name}}
            </div>
<!--            <div class="describe">-->
<!--              {{item.desc}}-->
<!--            </div>-->
            <div class="players">
              玩家人次: {{item.players}}
            </div>
            <div v-if="item.difficulty" class="players">
              难度: {{item.difficulty}}
            </div>
            <div>
              <el-button style="background-color: unset; color: white" @click.stop="toMaps(item, 'noMove')" type="primary"  round>固定</el-button>
              <el-button style="background-color: unset; color: white" @click.stop="toMaps(item, 'move')" type="primary" v-if="item.canMove" round>移动</el-button>
            </div>
          </div>
        </div>

        <div class="session_head" >热度排序</div>
        <div class="line"></div>
        <div class="grid_main">
          <div v-for="(item, index) in pagedata" @click.stop="toMapsDetail(item)"  :style="{'background-image': 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.6)), url('+ imgOrigin + (item.cover ?? 'biz/1659323781589_7d19c33667a54a4dabb0405ee5aec20f.jpeg') + '?x-oss-process=image/resize,h_400)','background-size':'cover'}" class="card">
            <div class="title">
              {{item.name}}
            </div>
<!--            <div class="describe">-->
<!--              {{item.desc}}-->
<!--            </div>-->
            <div class="players">
              玩家人次: {{item.players}}
            </div>
            <div v-if="item.difficulty" class="players">
              难度: {{item.difficulty}}
            </div>
            <div>
              <el-button style="background-color: unset; color: white" @click.stop="toMaps(item, 'noMove')" type="primary"  round>固定</el-button>
              <el-button style="background-color: unset; color: white" @click.stop="toMaps(item, 'move')" type="primary" v-if="item.canMove" round>移动</el-button>
            </div>
          </div>
        </div>


      </section>
    </div>
</template>

<script>
// @ is an alias to /src
// import Header from '@/components/common/Header.vue'
import * as api from '@/api/api'
import {tuxunJump, tuxunOpen} from "./common";

export default {
  name: 'tuxunRank',
  components: {

  },
  data(){
    return {
      pagedata: [],
      newPagedata: [],
      recentPagedata: [],
      search: false,
      keyword: '',
      timer: 0
    }
  },
  created(){
    // document.title = "图寻-练习赛";
  },
  mounted(){
    this.getHotMaps();
    this.getNewMaps();
    this.getRecentPageData();

    let _this = this;
    let timer = setInterval(()=>{
      // _this.getHotMaps();
      // _this.getNewMaps();
      _this.getRecentPageData();
    },10000)
  },
  methods:{
    getHotMaps(){
      api.getByPath('/api/v0/tuxun/maps/list').then(res=>{
        this.pagedata = res.data
        this.pagedata.forEach(function (item) {
          this.addDifficulty(item)
        }.bind(this));
      })
    },
    getNewMaps(){
      api.getByPath('/api/v0/tuxun/maps/listNew', {count: 9}).then(res=>{
        this.newPagedata = res.data
        this.newPagedata.forEach(function (item) {
          this.addDifficulty(item)
        }.bind(this));
      })
    },
    getRecentPageData(){
      api.getByPath('/api/v0/tuxun/maps/listRecent').then(res=>{
        this.recentPagedata = res.data
        this.recentPagedata.forEach(function (item) {
          this.addDifficulty(item)
        }.bind(this));
      })
    },
    addDifficulty(item){
      console.log(item.avgScore)
      if (item.avgScore === null) {
        item.difficulty = '中等';
      } else if (item.avgScore <= 5000) {
        item.difficulty = '非常难';
      } else if (item.avgScore <= 10000) {
        item.difficulty = '难';
      } else if (item.avgScore <= 15000) {
        item.difficulty = '中等';
      } else if (item.avgScore <= 20000) {
        item.difficulty = '简单';
      } else {
        item.difficulty = '非常简单';
      }
      console.log(item.difficulty)
    },
    searchFocus() {
      document.getElementById('input').blur();
      this.$mapsSearch();
      // tuxunOpen('/tuxun/search')
    },

    toMapsDetail(item, type) {
      tuxunJump('/tuxun/maps_detail?mapsId=' + item.id )
    },

    toMaps(item, type){
      this.doLoginStatus().then(res => {
            console.log(res)
            if (res) {
              api.getByPath('/api/v0/tuxun/game/enterMap', {mapsId: item.id}).then(res=>{
              })

              api.getByPath('/api/v0/tuxun/challenge/create', {'mapsId': item.id, 'type': type}).then(res => {
                if (res.success) {
                  tuxunJump('/tuxun/challenge?challengeId=' + res.data);
                } else {
                  if (res.errorCode === 'need_vip') {
                    this.$vip({
                    })
                  }
                }
              })
            }
      });
    },

    goHome() {
      tuxunJump('/tuxun/');
    },
    goMapMakeHome() {
      tuxunJump('/tuxun/my_maps');
    }
  },
}
</script>
<style scoped lang="scss">

::v-deep .el-input__inner {
  background-color: rgba(255, 255, 255, 0.247);
  color: white;
}
.container{
  position: absolute;
  width: 100%;
  min-height: 120%;
  text-align: center;
  background-color: #090723;
  .nav {
    color: white;
    font-size: 48px;
    font-weight: bold;
    padding-top: 3rem;
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
  section {
    padding-top: 3rem;
    display: block;
  }

  .game_entrance {
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 0 2rem;
    margin: 0 auto;
    max-width: 80rem;
    margin-top: 3rem;
    margin-bottom: 5rem;

    .line {
      width: 100%;
      height: 2px;
      background-color: white;
      margin-bottom: 2rem;
      margin-top: 1rem;
    }
    .first_session_head {
      font-size: 24px;
      color: whitesmoke;
      font-weight: bolder;
    }
    .session_head {
      font-size: 24px;
      color: whitesmoke;
      padding-top: 2rem;
      font-weight: bolder;
    }
    .grid_main {
      display: grid;
      grid-row-gap: 1.5rem;
      grid-column-gap: 1.5rem;
      grid-template-columns: repeat(3, 1fr);

      .card {
        cursor: pointer;
        position: relative;
        border-radius: 1rem;
        background-color: rgb(25,26,46, 0.9);
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: 100%;
        box-sizing: border-box;
        box-radius: 1rem;
        flex-direction: column;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        padding: 4rem 4rem 2rem 4rem;
        min-height: 110px;
        .title {
          font-size: 1.5rem;
          color: white;
          font-weight: 700;
          padding-bottom: 0.2rem;
        }
        .describe {
          color: yellow;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .players {
          color: white;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .card-top-right {
          position: absolute;
          right: 2px;
          top: 2px;
          color: white;
          font-weight: bold;
          font-size: 16px;
          padding-left: 5px;
          padding-right: 5px;
          background-color: #3590FF;
        }
      }
    }
  }
}


@media only screen and (max-width: 679px) {
  .container {
    .game_entrance {
      .grid_main {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  }
}
</style>
