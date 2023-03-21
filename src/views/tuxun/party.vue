<template>
  <div class="game_container">
    <div class="back_home" @click="goHome">
      <el-button round>←图寻首页</el-button>
    </div>

    <div v-if="partyData" class="prepare">
      <div class="party-name">
        {{partyData.host.userName}} 的聚会
      </div>

      <div class="header" v-if="partyData.gameType === 'solo' || partyData.gameType === 'solo_match'">
        图寻1v1对决
      </div>

      <div class="header" v-if="partyData.gameType === 'team'">
        组队对战
      </div>

      <div class="vs" v-if=" partyData.status !== 'ongoing'">
        <div class="player">
          <div style="display: flex; flex-flow: row wrap; justify-content: center; width: 100%" v-if="partyData && partyData.teams && partyData.teams.length >= 1">
            <div class="user" v-for="(item, index) in partyData.teams[0].users">
              <el-avatar :src="imgOrigin + item.icon" class="avatar"></el-avatar>
              <div class="userName">{{item.userName}} <span v-if="item.userId === partyData.host.userId">(房主)</span></div>
            </div>
          </div>
          <div v-if="partyData && (!partyData.teams || partyData.teams.length == 0  || partyData.gameType === 'team')">
            <el-button @click="change2Player(0)" size="small">加入对决</el-button>
          </div>
        </div>
        <div>
          <img class="vs_img"  :src="this.imgOrigin + 'biz/1658807128256_91c9df63c2d144359005b6f504a96a81.png'"></img>
          <div></div>
          <el-button @click="swapTeam"  type="primary" v-if="partyData.gameType==='team'" round>换队伍</el-button>
        </div>
        <div class="player">
          <div style="display: flex; flex-flow: row wrap;  justify-content: center; width: 100%" v-if="partyData && partyData.teams && partyData.teams.length >= 2">
            <div class="user" v-for="(item, index) in partyData.teams[1].users">
              <el-avatar :src="imgOrigin + item.icon" class="avatar"></el-avatar>
              <div class="userName">{{item.userName}} <span v-if="item.userId === partyData.host.userId">(房主)</span></div>
            </div>
          </div>
          <div v-if="partyData && (!partyData.teams || partyData.teams.length <= 1  || partyData.gameType === 'team')">
            <el-button @click="change2Player(1)" size="small">加入对决</el-button>
          </div>
        </div>
      </div>
      <div v-else >
        <div style="margin:5rem 0px">
          <el-button @click="gotoGame" round>正在对局...</el-button>
        </div>
      </div>

      <div class="start_game" v-if="status === 'ready' && this.partyData.gameType !== 'solo_match' && this.partyData.gameType !== 'battle_royale' && this.$store.state.user.userInfo.userId === partyData.host.userId">
        <el-button class="button" type="primary" round @click="start">开始图寻对决</el-button>
      </div>

      <div v-if="(partyData.gameType === 'solo' || partyData.gameType === 'solo_match') && partyData.status === 'wait_join'" class="wait_game_start">
        等待其他玩家加入....
      </div>

      <div v-if="(partyData.gameType === 'team') && partyData.status === 'wait_join'" class="wait_game_start">
        等待其他玩家加入或队伍至少有一人....
      </div>

      <div v-if="partyData.host && $store.state.user.userInfo.userId !== partyData.host.userId && partyData.status === 'ready' " class="wait_game_start">
        等待房主开始游戏...
      </div>

      <div class="wait_game_start">
        <div class="separate-line"></div>
        <div style="font-size: 24px">围观</div>
        <el-button @click="change2Onlooker" size="small">切换为围观</el-button>
        <div>
          <div class="player">
            <div style="display: flex; flex-flow: row wrap;  justify-content: center; width: 100%" v-if="partyData && partyData.onlookers">
              <div class="user-small" v-for="(item, index) in partyData.onlookers">
                <el-avatar :src="imgOrigin + item.icon" class="avatar"></el-avatar>
                <div class="userName">{{item.userName}} <span v-if="item.userId === partyData.host.userId">(房主)</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="(partyData.gameType === 'solo' || partyData.gameType === 'team') && partyData.gameMapsName " class="wait_game_start">
        <div class="separate-line"></div>
        <div style="padding-top: 10px; font-size: 24px">设置</div>
        <div  style="">
          <div style="font-size: 16px">
            类型: <span v-if="$store.state.user.userInfo.userId !== partyData.host.userId"> {{this.partyData.gameType === 'solo'? '1v1对决' : '多对多对决'}} </span>
          </div>
          <div v-if="$store.state.user.userInfo.userId === partyData.host.userId" style="display: flex;   justify-content: center ">
            <div :class="partyData.gameType === 'solo' ? 'choose-type' : 'normal-type'" @click="changeGameType('solo')" >1v1对决</div>
            <div :class="partyData.gameType === 'team' ? 'choose-type' : 'normal-type'" @click="changeGameType('team')">组队对决</div>
          </div>
        </div>
        <div  style="padding-top: 2rem;">
          <div style="font-size: 16px">
            题库：{{partyData.gameMapsName}}
          </div>
          <div>
            <el-button
                v-if="this.$store.state.user.userInfo.userId === this.partyData.host.userId"
                @click="showMapsSearch('noMove')"
                type="primary"
                style="margin-left: 10px"
                size="small"
            >切换题库</el-button>
          </div>
        </div>
        <div style="padding-top: 2rem; font-size: 16px">
          血量
          <el-input-number v-if="this.$store.state.user.userInfo.userId === this.partyData.host.userId" v-model="health" @change="changeHealth" :min=1000 :max=1000000 :step=1000 />
          <span v-else> : {{this.health}} </span>
        </div>
      </div>

      <div class="invite" v-if="status !== 'ready' && ((partyData.gameType !== 'battle_royale' && partyData.gameType !== 'solo_match')  || partyData.gameType == 'team')">
        <div class="separate-line"></div>
        <div class="title" style="padding-top: 10px">
          邀请链接
        </div>
        <div class="body">
<!--          <input class="invite_input" placeholder readonly :value="'https://tuxun.fun/join?code=' + partyData.joinCode" >-->
<!--          </input>-->
          <el-button class="button" type="success" @click="copyInviterLink" round>分享链接</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../../api/api";
import {tuxunJump, tuxunOpen} from "./common";
export default {
  name: "party",
  data() {
    return {
      url: `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/v0/tuxun`,
      status: 'wait',
      ws: null,
      partyData: null,
      health: 6000,
    }
  },
  created() {
    this.joinByParty();
  },
  methods: {
    initWS() {
      if (this.ws) {
        this.ws.close();
      }
      this.ws = new WebSocket(this.url);
      this.ws.onopen = this.wsOnOpen;
      this.ws.onmessage = this.wsOnMessage;
      this.ws.onclose = this.wsOnClose;
    },

    wsOnOpen(e) {
      console.log("wsOnOpen");
      // console.log(e);
      this.wsSend("{\"scope\": \"tuxun\", \"data\": {\"type\": \"subscribe_party\", \"text\": \"" + this.partyData.id + "\"}}");
      // 每3秒发送一次心跳
      setInterval(() => {
        this.wsSend(`{"scope": "heart_beat"}`);
      }, 15000);
    },

    showMapsSearch()  {
      this.$mapsSearch(
          { callBack: (mapsId, mapsType) => {
              if (mapsType === 'move') {
                api.getByPath('/api/v0/tuxun/vip/check').then(res => {
                  if (res.data) {
                    this.changeMaps(mapsId, mapsType);
                  } else {
                    this.$vip();
                  }
                })
              }
              this.changeMaps(mapsId, mapsType);
            }
          })
    },

    change2Onlooker() {
      api.getByPath('/api/v0/tuxun/party/change2Onlooker').then(res=>{
        this.solvePartyData(res.data)
      })
    },

    swapTeam() {
      api.getByPath('/api/v0/tuxun/party/swapTeam').then(res=>{
        this.solvePartyData(res.data)
      })
    },
    change2Player(teamIndex) {
      var teamId = null;
      // console.log(teamIndex);
      // console.log(this.partyData.teams);
      // console.log(this.partyData.teams[teamIndex]);
      // console.log(this.partyData.teams.length)
      if (this.partyData.teams && this.partyData.teams.length > teamIndex) {
        teamId = this.partyData.teams[teamIndex].id;
      }
      api.getByPath('/api/v0/tuxun/party/change2Player', {teamId: teamId}).then(res=>{
        if (res.success) {
          this.solvePartyData(res.data)
        }
      })
    },
    changeHealth() {
      api.getByPath('/api/v0/tuxun/party/changeHealth', {health: this.health}).then(res=>{
        if (res.success) {
          this.solvePartyData(res.data)
        }
      })
    },
    changeGameType(type) {
      api.getByPath('/api/v0/tuxun/party/changeType', {type: type}).then(res=>{
        if (res.success) {
          this.solvePartyData(res.data)
        }
      })
    },
    changeMaps(mapsId, mapsType) {
      // this.$mapsSearch();
      api.getByPath('/api/v0/tuxun/party/changeMaps', {mapsId: mapsId, type: mapsType}).then(res=>{
        if (res.success) {
          this.solvePartyData(res.data)
        }
      })
    },

    wsSend(data) {
      console.log("wsSend: " + data);
      this.ws.send(data);
    },

    wsOnMessage(e) {
      const data = JSON.parse(e.data);
      if (data.scope === 'tuxun_party') {
        this.solvePartyData(data.data.party, data.data.code);
      }
    },
    wsOnClose(e) {
      setTimeout(function () {
        this.initWS();
      }.bind(this), 1000);
      console.log("wsOnClose");
    },
    goHome() {
      tuxunJump('/tuxun/')
    },

    solvePartyData(partyData, code) {
      if (partyData === null) {
        return;
      }
      this.partyData = partyData;
      this.status = this.partyData.status;
      this.health = this.partyData.gameHealth;
      if (code === 'start_game') {
        tuxunJump('/tuxun/solo_game?gameId=' + res.partyData.gameId)
      }
    },

    joinByParty() {
      api.getByPath('/api/v0/tuxun/party/joinByParty').then(res=>{
            if (res.success) {
              this.solvePartyData(res.data, null)
              this.initWS()
            }
      })
    },

    start() {
      api.getByPath('/api/v0/tuxun/party/start').then(res=>{
        if (res.success) {
          tuxunJump('/tuxun/solo_game?gameId=' + res.data.id)
        }
      })
    },

    gotoGame() {
      tuxunJump('/tuxun/solo_game?gameId=' + this.partyData.gameId);
    },
    copyInviterLink() {
      var input = document.createElement('input');
      input.setAttribute('value', 'https://tuxun.fun/join?code=' + this.partyData.joinCode);
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand('copy');
      document.body.removeChild(input);
      this.$toast("复制邀请地址成功");
      return result;
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button {
  touch-action: manipulation;
}
.back_home {
  position: absolute;
  padding-top: 1rem;
  padding-left: 1rem;
  z-index: 5000;
}
.game_container {
  position: absolute;
  width: 100%;
  min-height: 100%;
  text-align: center;
  background-color: #18182A;

  .home_button {
    z-index: 10000;
    margin-top: 2rem;
    font-size: 16px;
  }

  .player {
    width: 60%;
    margin: auto;
    div{
      color: white;
    }
    .winner_title {
      color: gold;
      font-size: 3rem;
      margin-bottom: 1rem;;
    }
    .loser_title {
      color: silver;
      font-size: 3rem;
      margin-bottom: 1rem;;
    }
    .user {
      display: block;
      margin: 10px;
      .avatar {
        width: 75px;
        height: 75px;
        margin: 0 auto;
        justify-content: center;
        display: flex;
      }

      .userName {
        margin-top: 1rem;
        font-size: 12px;
      }
    }
    .user-small {
      display: block;
      margin: 10px;
      .avatar {
        width: 50px;
        height: 50px;
        margin: 0 auto;
        justify-content: center;
        display: flex;
      }

      .userName {
        margin-top: 1rem;
        font-size: 10px;
      }
    }
  }
  .prepare {
    padding-bottom: 10rem;

    div {
      color: white;
    }
    .party-name {
      padding-top: 5rem;
      color: white;
      font-size: 20px;
      font-weight: 700;
    }

    .header {
      padding-top: 1rem;
      color: white;
      font-size: 20px;
    }

    .separate-line {
      margin: auto;
      margin-top: 2rem;
      margin-bottom: 2rem;
      width: 60%;
      height: 1px;
      background-color: grey;
    }

    .vs {
      padding-top: 3rem;
      display: block;
      width: 60%;
      justify-content: center;
      margin: auto;
      display: flex;

      .vs_img {
        width: 100px;
        height: 100px;
        margin: auto;
      }
    }

    .start_game {
      padding-top: 3rem;

      .button {
        height: 3rem;
        width: 10rem;
        font-size: 16px;
      }
    }

    .wait_game_title {
      padding-top: 3rem;
      font-size: 32px;
      font-weight: bold;
    }

    .wait_game_start {
      padding-top: 2rem;
      font-size: 16px;
    }

    .choose-type {
      margin:0px 1rem;
      padding: 4px 8px;
      color: white;
      background-color: green;
      outline: 1px solid white;
    }

    .normal-type {
      cursor: pointer;
      margin:0px 1rem;
      padding: 4px 8px;
      color: white;
      outline: 1px solid white;
    }

    .wait_game_user {
      padding-top: 1rem;
      font-size: 16px;
      align-items: center;
    }

    .wait_game_number {
      font-size: 48px;
      color: white;
      padding-bottom: 1rem;
    }

    .wait_game_hint {
      font-size: 16px;
      color: grey;
    }

    .invite {
      margin: 2rem auto 0;
      //max-width: 90%;
      min-width: 35rem;

      .title {
        font-size: 20px;
        margin-bottom: 1rem;
      }

      input {
        width: 30rem;
        height: 3rem;
        background-color: #191A2E;
        max-width: 100%;
      }

      .button {
        font-size: 16px;
      }
    }
  }
}
@media only screen and (max-width: 768px) {
  .game_container {
    .prepare {
      .separate-line {
        width: 80%;
      }

      .vs {
        width: 80%;

        .vs_img {
          width: 30px;
          height: 30px;
        }

      }

      .invite {
        width: 100%;
        min-width: 50%;
        max-width: 100%;

        .body {
          max-width: 100%;
        }
      }
    }

    .player {
      width: 80%;

      .user {
        .avatar {
          width: 50px;
          height: 50px;
        }
        .userName {
          font-size: 12px;
        }
      }
      .user-small {
        .avatar {
          width: 50px;
          height: 50px;
        }
        .userName {
          font-size: 8px;
        }
      }
    }
  }
}
</style>
