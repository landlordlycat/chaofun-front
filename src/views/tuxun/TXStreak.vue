<template>
  <div class="container">
    <div class="back_home" @click="goHome">
      <el-button type="primary" round>←返回首页</el-button>
    </div>
    <div class="nav">
      连胜挑战
    </div>

    <div class="tab_container">
      <div class="tab">
        <div @click="type='province';init();"  :class="{'normal': type!=='province', 'choose': type==='province'}">
          省份连胜
        </div>
        <div @click="type='country';init()" :class="{'normal': type!=='country', 'choose': type==='country'}">
          <div>
            <div style="line-height: 1">
              国家连胜
              <p>固定</p>
            </div>
          </div>
        </div>
        <div @click="type='country_move';init()" :class="{'normal': type!=='country_move', 'choose': type==='country_move'}">
          <div>
            <div style="line-height: 1">
              国家连胜
              <p>移动</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="type==='country' || type==='country_move' " style="color: white; padding-top: 2rem;font-size: 16px">
      连续选对正确的国家，看你最多坚持多少轮
    </div>

    <div v-if="type==='province'" style="color: white; padding-top: 2rem;font-size: 16px">
      连续选对正确的省份，看你最多坚持多少轮
    </div>

    <div class="top-button">
      <el-button @click="createNew" round>开始新挑战</el-button>
<!--      <el-button class="top-button-continue"  type="warning" @click="$toast('尽请期待')" round>继续上次挑战</el-button>-->
    </div>

    <div class="rank">
      排行榜-记录单人最好成绩
    </div>
    <div class="rank_container" v-if="this.rank">
      <div @click="toUser(item.user)" v-for="(item,index) in this.rank" :key="index" class="item">
        <div class="left">
          <div class="number">
            {{index + 1}}.
          </div>
          <img style="object-fit: cover;" :src="imgOrigin+ item.user.icon + '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'" alt="">
          <div class="info">
            <div class="title">{{item.user.userName}}</div>
          </div>
        </div>
        <div class="right">
          <p>连胜: {{item.bestStreaks}}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import * as api from '../../api/api'
import {tuxunJump, tuxunOpen} from "./common";

export default {
  name: "TXStreak",
  data(){
    return {
      rank: null,
      type: 'province',
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.rank = null;
      this.listRank();
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
    createNew() {

      this.doLoginStatus().then(res => {
        console.log(res)
        if (res) {
          api.getByPath("/api/v0/tuxun/streak/create", {type: this.type}).then(res => {
            if (res.success) {
              tuxunJump('/tuxun/streak_game?streakId=' + res.data.id);
            } else if (res.errorCode === 'need_vip') {
              this.$vip();
            }
          });
        }
      });

    },

    listRank() {
      api.getByPath("/api/v0/tuxun/streak/listRank", {type: this.type}).then(res => {
        this.rank = res.data
      });
    },
    toUser(user) {
      tuxunJump( '/tuxun/user/' + user.userId);
    },
  }
}
</script>

<style lang="scss" scoped>

.container {
  position: absolute;
  width: 100%;
  min-height: 120%;
  text-align: center;
  background-color: #090723;
  justify-content: center;

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
  .nav {
    color: white;
    font-size: 48px;
    font-weight: bold;
    padding-top: 3rem;
  }
  .top-button {
    margin-top: 2rem;
    .top-button-continue {
      margin-left: 1rem;
    }
  }
  .rank {
    padding-top: 4rem;
    font-size: 16px;
    color: darkgray;
  }
  .rank_container {
    padding-top: 2rem;
    padding-bottom: 5rem;
    margin: auto;
    width: 40%;

    .item {
      display: flex;
      justify-content: space-between;
      padding: 5px;
      border-bottom: 1px solid #f1f1f1;
      // height: 60px;
      // box-sizing: border-box;
      overflow: hidden;
      color: white;
      .left {
        flex: 1;
        display: flex;

        .number {
          //position: absolute;
          text-align: end;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          font-size: 16px;
          margin-right: 8px;
        }
        img {
          flex: 0 0 40px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
          vertical-align: middle;
        }

        .title {
          font-size: 16px;
          color: white;
        }

        .desc {
          width: 180px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #888;
          font-size: 13px;
        }

        .info {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          color: white;
        }
      }

      .right {
        display: flex;
        flex: 0 0 60px;
        // line-height: 40px;
        text-align: center;
        font-size: 12px;
        flex-direction: column;
        justify-content: space-around;

        p {
          font-size: 14px;
        }
      }
    }
  }

  .tab_container {
    width: 40%;
    margin: auto;
    padding-top: 2rem;
    .tab {
      width: 100%;
      display: flex;
      .choose {
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
        align-content: center;
        width: 50%;
        height: 50px;
        font-size: 24px;
        color: gold;
        background-color: #3590FF;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
      }

      .normal {
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
        align-content: center;
        border-width: 1px;
        border-color: red;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
        height: 50px;
        width: 50%;
        font-size: 24px;
        background-color: white;
      }
    }
  }
}


@media only screen and (max-width: 679px) {
  .container {
    .rank_container {
      width: 90%;
    }
    .tab_container {
      width: 90%;
    }
  }
}

</style>
