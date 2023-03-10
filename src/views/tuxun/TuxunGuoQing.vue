<template>
  <div class="container">
    <div class="back_home" @click="goHome">
      <el-button v-if="history && history.length !== 1" @click="goBack"  round>←返回</el-button>
      <el-button v-else @click="goHome" round>←图寻首页</el-button>
    </div>
    <div class="nav">
      日常淘汰赛
    </div>
    <div class="tab_container">
      <div class="tab">
        <div @click="type='noMove';init();" :class="{'normal': type!=='noMove', 'choose': type==='noMove'}">
          固定街景
        </div>
        <div @click="type='move';init()" :class="{'normal': type!=='move', 'choose': type==='move'}">
          移动街景
        </div>
      </div>
    </div>
    <div class="desc">
      满3人发车，暂时不算积分
    </div>
    <div class="next-round">
      <el-button type="primary" v-if="this.gameId" @click="toGame" round>
        进入游戏
      </el-button>
      <div>
      </div>
    </div>
    <div class="rank">
      场次结果
    </div>
    <div class="rank_container" v-if="this.rank">
      <div @click="toUser(item.user)" v-for="(item,index) in this.rank" :key="index" class="item">
        <div class="left">
          <p>{{item.time}}</p>
        </div>
        <div class="right">
          <img style="object-fit: cover;" :src="imgOrigin+ item.user.icon + '?x-oss-process=image/resize,h_80/quality,q_75'" alt="">
          <div class="info">
            <div class="title">{{item.user.userName}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import * as api from '../../api/api'
import {tuxunJump, tuxunOpen} from "./common";


export default {
  name: "TuxunGuoQing",

  data() {
    return {
      timeLeftStr: null,
      nextStartTime: null,
      gameId: null,
      rank: null,
      type: 'noMove',
      history: null
    }
  },

  created() {
  },
  mounted() {
    this.history = history;
    this.init();
  },

  methods: {
    init() {
      this.timeLeftStr = null;
      this.nextStartTime = null;
      this.gameId = null;
      this.rank = null;
      this.get();
      this.listResult();
      this.countDown();
    },
    goHome() {
      tuxunJump('/tuxun/');
    },

    countDown() {
      this.time = setInterval(function () {
        if (!this.nextStartTime) {
          return;
        }
        var time = parseInt((this.nextStartTime - (new Date().getTime())) / 1000);
        if (time % 5 == 0) {
          this.get();
        }
      }.bind(this), 1000)
    },

    get() {
      api.getByPath("/api/v0/tuxun/br/get", {type: this.type}).then(res => {
        this.gameId = res.data.gameId;
      });
    },
    toGame() {
      tuxunJump('/tuxun/guoqing_game?guoqingId=' + this.gameId);
    },
    listResult() {
      api.getByPath("/api/v0/tuxun/br/listResult", {type: this.type}).then(res => {
        this.rank = res.data;
      });
    },
    toUser(item) {
      tuxunOpen("/tuxun/user/" + item.userId);
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/')
      }
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
  align-items: center;
  align-content: center;
  .tab_container {
    width: 40%;
    margin: auto;
    padding-top: 2rem;

    .tab {
      width: 100%;
      display: flex;

      .choose {
        cursor: pointer;
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
        align-content: center;
        width: 50%;
        height: 50px;
        font-size: 32px;
        color: gold;
        background-color: #3590FF;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      .normal {
        cursor: pointer;
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
        align-content: center;
        border-width: 1px;
        border-color: red;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        height: 50px;
        width: 50%;
        font-size: 32px;
        background-color: white;
      }
    }
  }
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
  .desc {
    margin: auto;
    padding-top: 1rem;
    width: 80%;
    color: gray;
    align-items: center;
    align-content: center;
    justify-content: center;
    text-align: center;
  }
  .next-round {
    padding-top: 1rem;
    .next-round-info {
      color: white;
      font-size: 20px;
    }

    .next-round-count {
      color: yellow;
      font-size: 24px;
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

      overflow: hidden;
      color: white;
      .right {
        flex: 1;
        display: flex;
        justify-content: flex-end;

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

      .left {
        display: flex;
        flex: 0 0 100px;
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

}

@media only screen and (max-width: 768px) {
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
