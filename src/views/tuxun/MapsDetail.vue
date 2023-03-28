<template>
  <div class="container">
    <div class="back_home">
      <el-button v-if="history && history.length !== 1" @click="goBack" round>←返回</el-button>
      <el-button v-else  @click="goHome" round>←首页</el-button>
      <el-button @click="share" type="primary" round>分享</el-button>
    </div>
    <div v-if="name" class="nav">
      {{name}}
    </div>
    <div v-if="mapsData && mapsData.desc" class="describe">
      {{mapsData.desc}}
    </div>
    <div v-if="userInfo" class="players">
      作者: {{userInfo.userName}}
    </div>
    <div v-if="mapsData" class="players">
      玩家人次: {{mapsData.players}}
    </div>
    <div v-if="mapsData && mapsData.difficulty" class="players">
      难度: {{mapsData.difficulty}}
    </div>

    <div v-if="mapsData" style="margin-top: 1rem">
      <el-button style="background-color: unset; color: white" @click.stop="toMaps(mapsData, 'noMove')" type="primary"  round>固定</el-button>
      <el-button style="background-color: unset; color: white" @click.stop="toMaps(mapsData, 'move')" type="primary" v-if="mapsData.canMove" round>移动</el-button>
    </div>

    <div class="rank">
      Top100排名
    </div>

    <div class="rank_container" v-if="mapsData && this.rank">
      <el-radio-group v-if="mapsData && mapsData.canMove" v-model="type"  @change="getRank" style="margin-bottom: 10px;">
        <el-radio-button size="mini" label="noMove">固定</el-radio-button>
        <el-radio-button size="mini" label="move">移动</el-radio-button>
      </el-radio-group>
      <div @click="toUser(item.user)" v-for="(item,index) in this.rank" :key="index" class="item">
        <div class="left">
          <div class="number">
            {{index + 1}}.
          </div>
          <img style="object-fit: cover;" :src="imgOrigin+ item.user.icon + '?x-oss-process=image/resize,h_80/quality,q_75'" alt="">
          <div class="info">
            <div class="title">{{item.user.userName}}</div>
          </div>
        </div>
        <div class="right">
          <p>得分：{{item.score}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {tuxunJump, tuxunOpen} from "./common";
import * as api from '@/api/api'
export default {
  name: "MapsDetail",
  data() {
    return {
      mapsId: null,
      name: null,
      mapsData: null,
      userInfo: null,
      history: null,
      rank: [],
      type: 'noMove'
    }
  },
  mounted() {
    this.history = history;
    this.mapsId = this.$route.query.mapsId;
    this.getMapsInfo();
    this.getRank();
  },
  methods: {
    getMapsInfo() {
      api.getByPath('/api/v0/tuxun/maps/get', {mapsId: this.mapsId}).then(res=>{
        this.name = res.data.name;
        this.mapsData = res.data;
        this.addDifficulty(this.mapsData);
        this.getUserInfo(res.data.userId);
      })
    },
    addDifficulty(item){
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
    },
    goHome() {
      tuxunJump('/tuxun/')
    },
    getRank() {
      this.rank = [];
      api.getByPath('/api/v0/tuxun/maps/rank', {mapsId: this.mapsId, type: this.type}).then(res=>{
        if (res.success) {
          this.rank = res.data;
        }
      })
    },
    getUserInfo(userId) {
      api.getByPath('/api/v0/user/info',{userId: userId}).then((res) => {
        if (res.success) {
          this.userInfo = res.data;
        }
      });
    },
    toMaps(item, type) {
      api.getByPath('/api/v0/tuxun/game/enterMap', {mapsId: item.id}).then(res => {
      })
      this.doLoginStatus().then((res) => {
        if (res) {

          api.getByPath('/api/v0/tuxun/challenge/create', {'mapsId': item.id, 'type': type}).then(res => {
            if (res.success) {
              tuxunJump('/tuxun/challenge?challengeId=' + res.data);
            } else {
              if (res.errorCode === 'need_vip') {
                this.$vip({})
              }
            }
          })
        }})
    },
    share() {
      var input = document.createElement('input');
      input.setAttribute('value','邀请你来图寻做「' + this.mapsData.name + '」练习赛题库, 你能找到你在哪吗？ https://tuxun.fun/maps_detail?mapsId=' + this.mapsId);
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand('copy');
      document.body.removeChild(input);
      this.$toast("复制练习赛题库地址成功");
      return result;
    },
    toUser(user) {
      tuxunJump( '/tuxun/user/' + user.userId);
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
  .rank {
    padding-top: 3rem;
    font-size: 16px;
    color: darkgray;
  }
  .rank_container {
    color: white;
    padding-top: 1rem;
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

        }
      }

      .right {
        flex: 0 0 60px;
        // line-height: 40px;
        text-align: center;
        font-size: 12px;

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
  }
}
</style>
