<template>
  <div class="game_container">
    <div class="" v-if="status==='wait'">
    </div>

    <div class="" v-if="status==='need_join'">
    </div>

    <div v-if="!gameData || (gameData.status !== 'ongoing' && gameData.status !== 'finish')" class="back_home" @click="goHome">
      <el-button round>←图寻首页</el-button>
    </div>

    <div class="prepare" v-if="status==='wait_join' || status === 'ready'">
      <div class="header" v-if="gameData.type === 'solo' || gameData.type === 'solo_match'">
        图寻1v1决斗
      </div>

      <div class="header" v-if="gameData.type === 'team'">
        组队对战
      </div>

      <div class="vs" v-if="gameData.type !== 'battle_royale'">
        <div class="player">
          <div style="display: flex; flex-flow: row wrap; justify-content: center; width: 100%" v-if="gameData && gameData.teams && gameData.teams.length >= 1">
            <div class="user" v-for="(item, index) in gameData.teams[0].users">
              <el-avatar :src="imgOrigin + item.icon" class="avatar"></el-avatar>
              <div class="userName">{{item.userName}} <span v-if="gameData.type === 'team' && item.userId === gameData.host.userId">(房主)</span></div>
            </div>
          </div>
        </div>
        <div>
          <img class="vs_img"  :src="this.imgOrigin + 'biz/1658807128256_91c9df63c2d144359005b6f504a96a81.png'"></img>
          <div></div>
          <el-button @click="swapTeam"  type="primary" v-if="gameData.type==='team'" round>换队伍</el-button>
        </div>
        <div class="player">
          <div style="display: flex; flex-flow: row wrap;  justify-content: center; width: 100%" v-if="gameData && gameData.teams && gameData.teams.length >= 2">
            <div class="user" v-for="(item, index) in gameData.teams[1].users">
              <el-avatar :src="imgOrigin + item.icon" class="avatar"></el-avatar>
              <div class="userName">{{item.userName}} <span v-if="gameData.type === 'team' && item.userId === gameData.host.userId">(房主)</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="start_game" v-if="status === 'ready' && this.gameData.type !== 'solo_match' && this.gameData.type !== 'battle_royale' && this.$store.state.user.userInfo.userId === gameData.host.userId">
        <el-button class="button" type="primary" round @click="start">开始图寻对决</el-button>
      </div>

      <div v-if="(gameData.type === 'solo' || gameData.type === 'solo_match') && gameData.status === 'wait_join'" class="wait_game_start">
        等待其他玩家加入....
      </div>

      <div v-if="(gameData.type === 'team') && gameData.status === 'wait_join'" class="wait_game_start">
        等待其他玩家加入或队伍至少有一人....
      </div>

      <div v-if="gameData.host && this.$store.state.user.userInfo.userId !== gameData.host.userId && gameData.type !== 'solo_match' && gameData.type !== 'battle_royale' " class="wait_game_start">
        等待房主开始游戏...
      </div>

      <div v-if="(gameData.type === 'solo' || gameData.type === 'team') && gameData.mapsName " class="wait_game_start">
        <div class="separate-line"></div>
        <div style="padding-top: 10px; font-size: 24px">设置</div>
        <div>
          <div style="font-size: 16px">
            题库：{{gameData.mapsName}}
          </div>
          <div>
            <el-button
                v-if="this.$store.state.user.userInfo.userId === this.gameData.host.userId"
                @click="showMapsSearch('noMove')"
                type="primary"
                style="margin-left: 10px"
                size="small"
            >切换题库</el-button>
          </div>
        </div>
        <div style="padding-top: 2rem; font-size: 16px">
          血量
          <el-input-number v-if="this.$store.state.user.userInfo.userId === this.gameData.host.userId" v-model="health" @change="changeHealth" :min=1000 :max=1000000 :step=1000 />
          <span v-else> : {{this.health}} </span>
        </div>
      </div>

      <div v-if="gameData.type === 'battle_royale' && gameData.status == 'ready'" class="wait_game_title">
        图寻淘汰赛-准备中
      </div>
      <div v-if="(gameData.type === 'solo_match' || gameData.type === 'battle_royale') && gameData.status == 'ready' && gameData.timerStartTime" class="wait_game_start">
        开始倒计时 <span style="color: greenyellow">{{this.gameTimeLeft}}</span> 秒
      </div>
      <div v-if="gameData.type === 'battle_royale' && gameData.status == 'ready'" class="wait_game_start">
        本次淘汰赛人数
      </div>
      <div v-if="gameData.type === 'battle_royale' && gameData.status == 'ready'" class="wait_game_number">
        {{gameData.players.length}}
      </div>
      <div v-if="gameData.type === 'battle_royale' && gameData.status == 'ready'"  class="wait_game_hint">
        满3人开始游戏, 选手列表：
      </div>
      <div v-if="gameData.type === 'battle_royale' && gameData.status == 'ready'" class="wait_game_user">
        <div v-for="(item, index) in gameData.players"> {{item.userName }}</div>
      </div>
      <div class="invite" v-if="status !== 'ready' && ((gameData.type !== 'battle_royale' && gameData.type !== 'solo_match')  || gameData.type == 'team')">
        <div class="separate-line"></div>
        <div class="title" style="padding-top: 10px">
          邀请链接
        </div>
        <div class="body">
          <input class="invite_input" placeholder readonly :value="origin + this.$route.fullPath" >
          </input>
          <el-button class="button" type="success" @click="copyInviterLink" round>复制分享</el-button>
        </div>
      </div>
    </div>

    <div class="game" v-if="status === 'ongoing' || status === 'finish'">
      <div class="im-view">
        <div id="viewer"  style="width: 100%; height: 100%"></div>
        <img v-if="lastRound && lastRound.source === 'baidu_pano'" style="position: absolute; bottom: 10px; left: 10px; width: 100px" src="https://webmap0.bdimg.com/wolfman/static/pano/images/pano-logo_7969e0c.png">
        <div v-if="showRoundResult" class="round_result">
          <div class="round_result_top">
            <span v-if="gameData.type === 'daily_challenge'">每日挑战<span v-if="gameData.move && gameData.mapsId !== 9">(全球移动)</span><span v-if="!gameData.move && gameData.mapsId !== 9">(全球固定)</span><span v-if="!gameData.move && gameData.mapsId === 9">(中国固定)</span> - </span>
            <span v-if="gameData.type === 'challenge'">{{gameData.mapsName}}<span v-if="gameData.move">(移动)</span><span v-if="!gameData.move">(固定)</span> - </span>
            <span v-if="gameData.type === 'country_streak'">国家连胜<span v-if="gameData.move">(移动)</span><span v-if="!gameData.move">(固定)</span> - </span>
            <span v-if="gameData.type === 'province_streak'">省份连胜 - </span>
            第 {{gameData.currentRound}} 轮
            <span v-if="lastRound.isDamageMultiple"> - {{lastRound.damageMultiple}} 倍伤害</span>
            <span v-if="gameData.type === 'battle_royale'"> - 淘汰用户 </span>
          </div>

          <div class="round_result_center" v-if="!gameData.player && gameData.type !== 'battle_royale'">
            <div class="round_result_block" v-if="gameData.type !== 'team'">
              {{gameData.teams[0].users[0].userName}} 本轮得分: {{gameData.teams[0].lastRoundResult.score}}
              <div>
                血量变化：{{gameData.teams[0].lastRoundResult.healthAfter - gameData.teams[0].lastRoundResult.healthBefore}}
              </div>
            </div>
            <div class="round_result_block" v-if="gameData.type !== 'team'">
              {{gameData.teams[1].users[0].userName}} 本轮得分: {{gameData.teams[1].lastRoundResult.score}}
              <div>
                血量变化：{{gameData.teams[1].lastRoundResult.healthAfter - gameData.teams[1].lastRoundResult.healthBefore}}
              </div>
            </div>
            <div class="round_result_block" v-if="gameData.type === 'team'">
              队伍1 本轮得分: {{gameData.teams[0].lastRoundResult.score}}
              <div v-if="gameData.teams[0].lastRoundResult.user">
                最佳队员：{{gameData.teams[0].lastRoundResult.user.userName}}
              </div>
              <div>
                血量变化：{{gameData.teams[0].lastRoundResult.healthAfter - gameData.teams[0].lastRoundResult.healthBefore}}
              </div>
            </div>
            <div class="round_result_block" v-if="gameData.type === 'team'">
              队伍2 本轮得分: {{gameData.teams[1].lastRoundResult.score}}
              <div v-if="gameData.teams[1].lastRoundResult.user">
                最佳队员：{{gameData.teams[1].lastRoundResult.user.userName}}
              </div>
              <div>
                血量变化：{{gameData.teams[1].lastRoundResult.healthAfter - gameData.teams[1].lastRoundResult.healthBefore}}
              </div>
            </div>
          </div>

          <div class="round_result_center" v-if="gameData.type === 'battle_royale'">
            <div v-for="(item, index) in obsoleteUsers">
              {{item.userName}}
            </div>
          </div>

          <div class="round_result_center" v-if="gameData.type === 'daily_challenge' || gameData.type === 'challenge' " >
            <div class="round_result_block">
              <div>
                轮数:  {{gameData.currentRound}} / {{gameData.roundNumber}}
              </div>
              本轮得分: {{gameData.player.lastRoundResult.score}}
              <div>
                总得分:  {{gameData.player.totalScore}}
              </div>
            </div>
          </div>

          <div class="round_result_center" v-if="gameData.type === 'country_streak' || gameData.type === 'province_streak'">
            <div class="round_result_block">
              <!--              <div>-->
              <!--                本轮得分: {{gameData.player.lastRoundResult.score}}-->
              <!--              </div>-->
              <!--              <div v-if="gameData.player.lastRoundResult.distance">-->
              <!--                本轮距离: {{(gameData.player.lastRoundResult.distance / 1000).toFixed(3)}} 千米-->
              <!--              </div>-->
              <div v-if="gameData.type === 'country_streak'">
                选择国家： {{gameData.player.lastRoundResult.guessPlace}}
              </div>
              <div v-if="gameData.type === 'province_streak'">
                选择省份： {{gameData.player.lastRoundResult.guessPlace}}
              </div>
              <div>
                正确答案： {{gameData.player.lastRoundResult.targetPlace}}
              </div>
            </div>
          </div>

          <div v-if="showChallengeGameEnd" class="challenge_result_bottom" >
            <div v-if="this.dailyChallengeRank" class="result_rank">
              排名：{{this.dailyChallengeRank}}
              <p>
              </p>
              超过：{{((1 - this.dailyChallengePercent) * 100).toFixed(2)}} % 选手
            </div>
            <div v-if="gameData.type === 'daily_challenge'">
              <el-button class="result_button" type="primary" @click="goDailyChallenge" round>查看总排名</el-button>
            </div>
            <div v-if="gameData.type === 'challenge'">
              <el-button class="result_button" type="primary" @click="challengeAgain" round>再来一局</el-button>
            </div>
            <div v-if="gameData">
              <el-button class="result_button"  type="primary" @click="replay" round>题目复盘</el-button>
            </div>
            <div v-if="gameData.type === 'challenge'">
              <el-button class="result_button" @click="goMaps" round>回到练习赛首页</el-button>
            </div>
            <div>
              <el-button class="result_button" @click="goHome" round>回到图寻首页</el-button>
            </div>
          </div>

          <div v-if="showStreakGameEnd" class="challenge_result_bottom" >
            <!--            <div class="result_rank">-->
            <!--              排名：{{x}}, 超过：{{x}}-->
            <!--            </div>-->
            <div style="font-size: 30px; color: orangered">
              选择错误，挑战结束
            </div>
            <div style="font-size: 30px; color: yellow">
              你连胜了 {{gameData.player.streaks}} 轮
            </div>
            <div>
              <el-button class="result_button" type="primary" @click="createNew" round>再来一局</el-button>
            </div>
            <div v-if="gameData">
              <el-button class="result_button"  type="primary" @click="replay" round>题目复盘</el-button>
            </div>
            <div>
              <el-button class="result_button"  @click="goHome" round>回到图寻首页</el-button>
            </div>
          </div>
        </div>
        <div v-if="showGameEnd && winner && gameData.type !== 'battle_royale'" class="game_result">
          <div class="player">
            <div v-if="isWin" class="winner_title">
              胜利!
            </div>
            <div v-else class="loser_title">
              失败!
            </div>

            <el-avatar  v-if="gameData.type !== 'team'" :src="this.imgOrigin + yourTeam.users[0].icon" class="avatar"></el-avatar>
            <div class="userName"  v-if="gameData.type !== 'team'">{{yourTeam.users[0].userName}}</div>
            <div class="userName"  v-if="gameData.type === 'team'"></div>
            <div v-if="gameData && gameData.type === 'solo_match'">
              <div class="info">
                <p v-if="yourTeam.ratingChange  && yourTeam.ratingChange > 0" class="desc">积分变化：+{{yourTeam.ratingChange}}</p>
                <p v-if="!yourTeam.ratingChange && yourTeam.finalRating" class="desc">积分无变化, 积分：{{ yourTeam.finalRating }}</p>
                <p v-if="!yourTeam.ratingChange && !yourTeam.finalRating" class="desc">积分无变化 (需要有其他人选择才计算积分)</p>
                <p v-if="yourTeam.ratingChange  && yourTeam.ratingChange < 0" class="desc">积分变化：{{yourTeam.ratingChange}}</p>
                <div>
                  最新积分：{{ yourTeam.finalRating }}
                </div>
              </div>
              <el-button class="home_button"  type="primary" @click="goTuxun" round>继续匹配</el-button>
            </div>
            <div v-if="gameData && ( gameData.type === 'solo' || gameData.type === 'team')">
              <el-button class="home_button"  type="primary" @click="again" round>再来一局</el-button>
            </div>
            <div v-if="gameData">
              <el-button class="home_button"  type="primary" @click="replay" round>题目复盘</el-button>
            </div>
            <div>
              <el-button class="home_button" type="warning" @click="goHome" round>回到图寻首页</el-button>
            </div>
          </div>
        </div>
        <div v-if="showGameEnd && gameData.type === 'battle_royale'" class="game_result">
          <div class="player">
            <div v-if="gameData.saveTeamCount === 0" style="font-size: 30px; color: white">
              无人存活
            </div>
            <div v-if="gameData.saveTeamCount !== 0" style="font-size: 30px; color: gold">
              最终存活: {{winner.userName}}
            </div>
            <div>
              <el-button class="home_button"  type="primary" @click="toNew" round>进入最新局</el-button>
            </div>
            <div>
              <el-button class="home_button" type="warning" @click="goHome" round>回到图寻首页</el-button>
            </div>
          </div>
        </div>


        <div v-if="gameData && !gameData.player && gameData.type !== 'battle_royale' " class="game_hud">
          <div class="hub_left">
            <div class="user_title" v-if="gameData.type !== 'team'">
              {{gameData.teams[0].users[0].userName}}
            </div>
            <div class="user_title" v-if="gameData.type === 'team'">
              队伍1
            </div>
            <div class="user_blod_left">
              血量：{{gameData.teams[0].health}}
            </div>
            <div class="sub_user_name" v-for="(item, index) in gameData.teams[0].users"  v-if="gameData.type === 'team'">
              {{item.userName}}
            </div>
            <div v-if="team1Emoji" class="emoji">
              <img :src="imgOrigin+team1Emoji +'?x-oss-process=image/resize,h_120'"/>
            </div>
          </div>

          <div class="hub_right">
            <div class="user_title" v-if="gameData.type !== 'team'">
              {{gameData.teams[1].users[0].userName}}
            </div>
            <div class="user_title" v-if="gameData.type === 'team'">
              队伍2
            </div>
            <div class="user_blod_right">
              血量：{{gameData.teams[1].health}}
            </div>
            <div class="sub_user_name" v-for="(item, index) in gameData.teams[1].users"  v-if="gameData.type === 'team'">
              {{item.userName}}
            </div>
            <div v-if="this.team2Emoji" class="emoji">
              <img :src="imgOrigin+team2Emoji +'?x-oss-process=image/resize,h_120'"/>
            </div>
          </div>
        </div>
      </div>
      <!--    TODO: 这里有个问题，不能在中间加 v-if 的DIV，一加在 v-if 条件触发的时候（特别是 hide）就会影响 map 的布局，原理未知，-->

      <div id="map-container" :class="[{'bm-view-container': !ISPHONE}, {'bm-view-container-phone': ISPHONE && showMap}, {'bm-view-container-phone-hidden': ISPHONE && !showMap}]"@mouseover="mapMouseOver" @mouseout="mapMouseOut">
        <div v-if="!this.isMapSmall && !ISPHONE" style="text-align: left">
          <el-button size="small" @click="mapBig" round>放大</el-button>
          <el-button size="small" @click="mapSmall" round>缩小</el-button>
          <el-button size="small" v-if="!mapPin" @click="mapPin = true" round>固定大小</el-button>
          <el-button size="small" v-if="mapPin" @click="mapPin = false" round>解除固定</el-button>
        </div>
        <div id="map" :class="[{'bm-view': !ISPHONE}, {'bm-view-phone': ISPHONE}]" @mouseover="mapMouseOver" @mouseout="mapMouseOut"></div>
      </div>

      <div :class="[{'top-info': !ISPHONE}, {'top-info-phone': ISPHONE}]">
        <div v-if="lastRound && !lastRound.endTime && lastRound.isDamageMultiple" class="count-down">
          本轮 {{lastRound.damageMultiple}} 倍伤害
        </div>
        <div v-if="gameData.type === 'battle_royale'" class="count-down">
          存活人数: {{gameData.saveTeamCount}}
        </div>
        <div></div>
        <div v-if="lastRound && lastRound.timerStartTime && !lastRound.endTime" class="count-down">
          选择倒计时: {{timeLeftStr}}
        </div>
      </div>

      <div v-if="gameData.type === 'country_streak' || gameData.type === 'province_streak'" :class="[{'topRight': !ISPHONE}, {'topRight-phone': ISPHONE}]">
        <div :class="[{'topRight-info': !ISPHONE}, {'topRight-info-phone': ISPHONE}]">
          连胜次数：{{gameData.player.streaks}}
        </div>
      </div>

      <div v-if="showMap && ISPHONE" style="position: absolute; left: 20px; bottom: 20px;z-index: 5000">
        <el-button @click="showMap = false" round>隐藏地图</el-button>
      </div>

      <div class="home">
        <el-button v-if="gameData.type === 'challenge' || gameData.type === 'battle_royale'" size="mini" @click="goHome" round>图寻首页</el-button>
        <el-button size="mini" v-if="gameData && gameData.type !== 'daily_challenge'" @click="toReport" round> 坏题反馈 </el-button>
        <el-button v-if="gameData && gameData.move" size="mini"  @click="reset" round> 回到原点</el-button>
        <el-button size="mini" v-if="gameData && !gameData.player && gameData.type != 'battle_royale'"  @click="sendEmoji=true" round> 发送表情 </el-button>
        <el-button size="mini" v-if="gameData && (gameData.type ==='country_streak' || gameData.type ==='province_streak')"  @click="skip" round> 换一题 <span>
          ({{gameData.leftSkipTimes}})
        </span> </el-button>
        <el-button size="mini" v-if="gameData && gameData.type === 'challenge'" @click="challengeAgain" round> 重开 </el-button>
        <el-button v-if="ISPHONE" @click="reloadPage" size="mini" round>刷新页面</el-button>
      </div>

      <div :class="[{'confirm': !ISPHONE}, {'confirm-phone': ISPHONE}]">
        <el-button @mouseover.native="mapMouseOver" v-if="(showMap || !ISPHONE) && !confirmed && !this.targetLat"  @click="confirm" round>确定选择</el-button>
        <el-button @mouseover.native="mapMouseOver" v-else-if="!showMap && ISPHONE && confirmed" @click="showMapTrue" round>打开地图</el-button>
        <el-button @mouseover.native="mapMouseOver" v-else-if="!showMap && ISPHONE" @click="showMapTrue" round>选择地点</el-button>
        <el-button @mouseover.native="mapMouseOver" v-if="gameData.status === 'ongoing' && gameData.player && this.targetLat" @click="next" round>下一题</el-button>
      </div>
    </div>
    <matching v-if="this.showMatch"/>
    <emoji-sender :gameId="gameData.id" v-if="this.sendEmoji" @hide="hideEmojiSender" style="z-index: 501"></emoji-sender>
  </div>
</template>

<script>
import * as THREE from 'three';
import * as api from '../../api/api'
import {Viewer} from 'photo-sphere-viewer'
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
import { CompassPlugin} from 'photo-sphere-viewer/dist/plugins/compass'
import { MarkersPlugin} from 'photo-sphere-viewer/dist/plugins/markers'
import { VirtualTourPlugin } from 'photo-sphere-viewer/dist/plugins/virtual-tour'
import 'photo-sphere-viewer/dist/plugins/compass.css'
import 'photo-sphere-viewer/dist/plugins/virtual-tour.css'
import 'photo-sphere-viewer/dist/plugins/markers.css'
import BMapLoader from "../../utils/bmap-jsapi-loader";
import {getByPathLongTimeout} from "../../api/api";
import Matching from "./Matching";
import EmojiSender from "./EmojiSender";
import { loadScript } from "vue-plugin-load-script";


import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./SmoothWheelZoom"
import {tuxunJump, tuxunOpen} from "./common";


export default {
  name: "TXInvitor",
  components: {EmojiSender, Matching},
  data() {
    return {
      url: `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/v0/tuxun`,
      // url: `ws://127.0.0.1:8080/ws/v0/tuxun`,
      ws: null,
      status: 'wait',
      gameId: this.gameId,
      gameData: null,
      lastRound: null,
      map: null,
      BMap: null,
      viewer: null,
      image: null,
      round: null,
      confirmed: false,
      chooseMarker: null,
      showMap: false,
      currentRound: null,
      lastTouchTime: 0,
      showRoundResult: false,
      showGameEnd: false,
      timeLeft: 15,
      gameTimeLeft: 5,
      timeLeftStr: '',
      team1User: null,
      team2User: null,
      winner: null,
      saveUser: null,
      showStreakGameEnd: false,
      winTeam: null,
      yourTeam: null,
      isWin: null,
      showMatch: false,
      challengeId: null,
      sendEmoji: false,
      team1Emoji: null,
      team2Emoji: null,
      showChallengeGameEnd: false,
      ranksMarker: [],
      teamMarker: [],
      needSmall: false,
      maxMapWidth: '40%',
      maxMapHeight: '60%',
      isMapSmall: true,
      guoqingId: null,
      mapPin: false,
      obsoleteUsers: [],
      panorama: null,
      dailyChallengeRank: null,
      dailyChallengePercent: null,
      notifyStatus: '',
      health: 6000,
      origin: location.origin,
      mapsData: []

      // gameData: {playerIds: [1, 2]}
    }
  },

  mounted() {
    THREE.Cache.enabled = false;

    this.gameId = this.$route.query.gameId;
    this.challengeId = this.$route.query.challengeId;
    this.streakId = this.$route.query.streakId;
    this.guoqingId = this.$route.query.guoqingId;
    this.init();

    document.onkeydown=function(event){
      var e = event || window.event || arguments.callee.caller.arguments[0];
      console.log(e.keyCode)
      if(e && e.keyCode===32){//空格
        this.keyConfirm()
      }
    }.bind(this);


  },
  destroyed() {
    document.onkeydown = undefined;
  },

  methods: {
    init() {
      var Notification = window.Notification || window.mozNotification || window.webkitNotification;
      if (Notification) {
        Notification.requestPermission(function (status) {
          this.notifyStatus = status;
        }.bind(this))
      }
      if (this.gameId && this.gameId !== null && this.gameId !== '') {
        this.showMatch = false;
        this.initWS();
        this.join();
        this.countDown();
      } else if (!this.challengeId && !this.streakId && !this.guoqingId) {
        this.showMatch = true;
        this.match();
      } else if (this.challengeId) {
        this.doLoginStatus().then(res => {
          console.log(res)
          if (res) {
            this.showMatch = false;
            this.challengeInit();
          }
        });

      } else if (this.streakId) {
        this.showMatch = false;
        this.gameId = this.streakId;
        this.getGameInfo();
      } else if (this.guoqingId) {
        this.showMatch = false;
        this.gameId = this.guoqingId;
        this.initWS();
        this.joinGuoqing();
        this.countDown();
      }
    },

    mapBig() {
      this.maxMapWidth = '68%';
      this.maxMapHeight = '85%';
      this.changeMapBig();
    },

    mapSmall() {
      this.maxMapWidth = '40%';
      this.maxMapHeight = '60%';
      this.changeMapBig();
    },
    changeMapBig() {
      this.isMapSmall = false
      this.needSmall = false;
      var element = document.getElementById("map-container")
      element.style.width = this.maxMapWidth;
      element.style.height = this.maxMapHeight;
      element.style.opacity = 1.0;
      this.map.invalidateSize();
      setTimeout(() => {
        this.map.invalidateSize();
      }, 5)
    },
    mapMouseOver() {
      if (!window.matchMedia("(hover: none)").matches && document.body.clientWidth > 678 && !this.mapPin) {
        this.changeMapBig();
      }
    },

    mapMouseOut() {
      if (!window.matchMedia("(hover: none)").matches && document.body.clientWidth > 678 && !this.mapPin) {
        this.needSmall = true;
        setTimeout(() => {
          if (this.needSmall) {
            this.needSmall = false;
            this.isMapSmall = true;
            var element = document.getElementById("map-container")
            element.style.width = '25%';
            element.style.height = '35%';
            element.style.opacity = 0.7;
            if (this.map) {
              this.map.invalidateSize();
            }
          }
        }, 750)
      }
    },
    hideEmojiSender() {
      this.sendEmoji = false;
    },
    reloadPage() {
      this.$router.go(this.$router.currentRoute);
    },
    initMap() {
      if (!this.map) {
        var map = L.map('map', {
          attributionControl: true,
          worldCopyJump: true,
          coordType: 'gcj02',
          scrollWheelZoom: false, // disable original zoom function
          smoothWheelZoom: true,  // enable smooth zoom
          smoothSensitivity: 3,   // zoom speed. default is 1
          maxBoundsViscosity: 1.0,
          maxBounds: [[-90, -540], [90, 540]]
        }).setView([38.8, 106.0], 2)
        map.scrollWheelZoom = true;
        map.attributionControl.setPosition('bottomleft');
        map.attributionControl.setPrefix('华为地图');
        map.attributionControl.addAttribution('GS（2022）2885号');

        var url = 'https://map.chao-fan.com/tile/s2_z{z}_x{x}_y{y}.png';
        if(this.ISPHONE){
          url = 'https://map.chao-fan.com/tile/s1_z{z}_x{x}_y{y}.png';
        }
        L.tileLayer(url, {
          maxZoom: 18,
          minZoom: 1,
        }).addTo(map);

        this.map = map;
        this.map.on('click', this.click);
        this.map.invalidateSize();
      }
    },

    challengeInit() {
      api.getByPath('/api/v0/tuxun/challenge/getGameInfo', {'challengeId': this.challengeId}).then(res => {
        if (res.data) {
          this.gameId = res.data.id;
          this.solveGameData(res.data, null)
          this.initWS();
          this.countDown();
        }
      })
    },
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
      this.wsSend("{\"scope\": \"tuxun\", \"data\": {\"type\": \"subscribe_solo\", \"text\": \"" + this.gameId + "\"}}");
      // 每3秒发送一次心跳
      setInterval(() => {
        this.wsSend(`{"scope": "heart_beat"}`);
      }, 15000);
    },

    wsOnMessage(e) {
      const data = JSON.parse(e.data);
      if (data.scope === 'tuxun_game') {
        this.solveGameData(data.data.game, data.data.code);
      } else if (data.scope === 'tuxun_emoji') {
        this.showEmoji(data.data)
      }
    },
    showEmoji(data) {
      if (data.teamId === this.gameData.teams[0].id) {
        this.team1Emoji = data.image;
        setTimeout(function () {
          this.team1Emoji = null;
        }.bind(this), 5000);
      } else {
        this.team2Emoji = data.image;
        setTimeout(function () {
          this.team2Emoji = null;
        }.bind(this), 5000);
      }
    },
    showMapTrue() {
      this.showMap = true;
      setTimeout(function () {
        this.map.invalidateSize();
      }.bind(this), 100);
    },
    solveGameData(data, code) {
      if (!data) {
        return;
      }

      this.gameData = data;

      if (this.gameData.health) {
        this.health = this.gameData.health;
      }

      if (this.gameData.status === 'match_fail') {
        this.$toast('匹配失败，重新匹配！');
        tuxunJump('/tuxun/solo_game')
        return;
      }

      if (code === 'game_start' && this.gameData.type === 'battle_royale') {
        this.notify("淘汰赛开始了，点击进入");
      }

      if (this.gameData.type === 'solo' && code === 'player_join' && this.$store.state.user.userInfo.userId === this.gameData.host.userId) {
        this.notify("您的邀请Solo赛已经准备就绪，可以开始了！");
      }

      if (this.gameData.rounds && this.gameData.rounds.length > 0) {
        this.lastRound = this.gameData.rounds[this.gameData.rounds.length - 1];
      }

      if (!this.gameData.player  && (code === 'game_end' || data.status === 'finish')) {
        this.showMap = false;
        this.showGameEnd = true;
        if (this.gameData.type !== 'battle_royale') {
          this.gameData.teams.forEach(v => {
            if (v.health !== 0) {
              this.winner = v.users[0];
              this.winTeam = v
            }
            if (v.users[0].userId === this.$store.state.user.userInfo.userId) {
              this.yourTeam = v;
            }
          })
          this.isWin = false;
          this.winTeam.users.forEach(v => {
            if (v.userId === this.$store.state.user.userInfo.userId) {
              this.isWin = true;
            }
          })

          if (!this.gameData.playerIds.includes(this.$store.state.user.userInfo.userId)) {
            this.isWin = true;
          }

          if (!this.yourTeam) {
            this.yourTeam = this.winTeam;
          }
        } else {
          this.gameData.teams.forEach(v => {
            if (v.health !== 0) {
              this.winner = v.users[0];
              this.isWin = true;
              this.winTeam = v
              this.yourTeam = v;
            }
          })
        }
      }

      if ((this.gameData.type === 'daily_challenge' || this.gameData.type === 'challenge') && (code === 'game_end' || data.status === 'finish')) {
        this.showMap = false;
        this.showChallengeGameEnd = true;
        if (this.gameData.type === 'daily_challenge') {
          this.getDailyChallengeRank();
        }
      }

      if ((this.gameData.type === 'country_streak' || this.gameData.type === 'province_streak') && (code === 'game_end' || data.status === 'finish')) {
        this.showMap = false;
        this.showStreakGameEnd = true;
      }

      if (data.status === 'wait_join' || data.status === 'ready' || data.status === 'ongoing' || data.status === 'finish') {
        this.status = data.status;
        if (data.status === 'ongoing' || data.status === 'finish') {
          if (this.canUseWebP() && this.lastRound.contentSpeedUp) {
            this.lastRound.content = this.lastRound.contentSpeedUp;
          }
          if (this.image !== this.lastRound.content || this.round !== this.lastRound.round) {
            var interval = 0;
            if (!this.map) {
              interval = 500;
            }
            setTimeout(() => {
              if (this.gameData.centerLat) {
                this.map.setView([this.gameData.centerLat, this.gameData.centerLng], this.gameData.mapZoom);
              } else {
                this.map.setView([38.8, 106.0], 2);
              }
            },interval);

            this.removeChooseMarker()
            this.removeTargetMarker();
            this.removeLine();
            this.clearRanksMarker();
            this.showMap = false;
            this.image = this.lastRound.content;
            this.round = this.lastRound.round;
            this.contents = this.lastRound.contents;
            this.lat = null;
            this.lng = null;
            this.targetLat = null;
            this.targetLng = null;
            this.confirmed = null;
            this.polylinePath = null;
            this.obsoleteUsers = [];

            this.heading = this.lastRound.heading;

            setTimeout(function () {
              if (!this.lastRound.move) {
                if (!this.viewer) {
                  var plugins = [];
                  plugins.push([CompassPlugin, {
                    size: '5vh',
                    position: 'left bottom'
                  }]);

                  this.viewer = new Viewer({
                    loadingImg: this.imgOrigin + 'biz/1659528755270_550cd22e10c84073a12e6f83840320bc.gif',
                    navbar: null,
                    container: document.querySelector('#viewer'),
                    panoData: {
                      poseHeading: this.heading, // 0 to 360
                    },
                    defaultZoomLvl: 0,
                    plugins: plugins
                  });
                }

                this.viewer.setPanorama(
                    this.imgOrigin + this.image, {
                      panoData: {
                        poseHeading: this.heading, // 0 to 360
                      },
                    }
                );

                this.viewer.animate({
                  zoom: 0,
                  speed: '1000rpm',
                }).then(() => {
                });

                var compassPlugin = this.viewer.getPlugin(CompassPlugin);
                if (compassPlugin) {
                  console.log(this.heading);
                  if (this.heading) {
                    compassPlugin.show();
                  } else {
                    compassPlugin.hide();
                  }
                }

                setTimeout(function () {
                  THREE.Cache.clear();
                }, 1000);

              } else {
                if (!this.viewer) {
                  document.head.insertAdjacentHTML("beforeend", `<style>a[href^="http://maps.google.com/maps"]{display:none !important}a[href^="https://maps.google.com/maps"]{display:none !important}.gmnoprint a, .gmnoprint span, .gm-style-cc {display:none;}</style>`)
                  this.sharePanoId = this.$route.query.pano;
                  loadScript('https://chaofun-test.oss-cn-hangzhou.aliyuncs.com/google/js-1.js').then(() => {
                    this.viewer = new google.maps.StreetViewPanorama(
                        document.getElementById("viewer"), {
                          fullscreenControl:false,
                          panControl:true,
                          addressControl: false,
                          imageDateControl: false,
                          motionTracking: false,
                          motionTrackingControl:false,
                          streetViewControl:false,
                          showRoadLabels: false,
                          scaleControl: false,
                          zoomControl: false,
                          panControlOptions: {
                            position: google.maps.ControlPosition.BOTTOM_LEFT,
                          },
                        }
                    );
                    this.setGoogle(this.lastRound.panoId);
                  })
                } else {
                  this.setGoogle(this.lastRound.panoId);
                }
              }
              this.initMap();
            }.bind(this), 100);
          }
        }
      }

      if ((code === 'round_end' ||
          (this.lastRound && this.lastRound.endTime))
      ) {
        if (!this.showGameEnd) {
          this.showMapTrue()
          this.showRoundResult = true;
        } else {
          this.showRoundResult = false;
        }
        if (!this.targetLng) {
          if (this.lastRound.obsoleteTeamIds) {
            this.gameData.teams.forEach(v => {
              if (this.lastRound.obsoleteTeamIds.includes(v.id)) {
                this.obsoleteUsers.push(v.users[0]);
              }
            })
          }

          this.addTargetMarker()
          this.addRanksMarker();
          this.centerView();

          this.targetLat = this.lastRound.lat;
          this.targetLng = this.lastRound.lng;
          if (this.lng) {
            this.addLine();
          }
        }
      } else {
        this.showRoundResult = false;
        // 只有没有结束的时候，采取添加队友，其余的话只添加Ranks
        this.addTeamMarker();
      }
    },

    reset() {
      this.setGoogle(this.lastRound.panoId);
    },

    setGoogle(panoId) {
      this.viewer.setPano(panoId);
      this.viewer.setVisible(true);
      setTimeout(() => {
        this.viewer.setZoom(0);
      }, 50);
    },

    wsSend(data) {
      console.log("wsSend: " + data);
      this.ws.send(data);
    },

    wsOnClose(e) {
      setTimeout(function () {
        this.initWS();
      }.bind(this), 1000);
      console.log("wsOnClose");
    },

    copyInviterLink() {
      var input = document.createElement('input');
      input.setAttribute('value', this.origin + this.$route.fullPath);
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand('copy');
      document.body.removeChild(input);
      this.$toast("复制邀请地址成功");
      return result;
    },

    getDailyChallengeRank() {
      api.getByPath('/api/v0/tuxun/challenge/getDailyChallengeRank', {'challengeId': this.challengeId, 'gameId': this.gameId}).then(res=>{
        this.dailyChallengeRank = res.data.rank;
        this.dailyChallengePercent = res.data.percent;
      })
    },

    get() {
      this.doLoginStatus().then((res) => {
      });
    },
    join() {
      this.doLoginStatus().then((res) => {
        api.getByPath("/api/v0/tuxun/game/join", {gameId: this.gameId}).then(res => {
          console.log(res.data);
          if (res.success) {
            this.solveGameData(res.data, null);
          } else if (res.errorCode === 'need_vip') {
            this.$vip();
          } else {
            this.getGameInfo()
          }
        });
      });
    },

    joinGuoqing() {
      this.doLoginStatus().then((res) => {
        api.getByPath("/api/v0/tuxun/br/join", {gameId: this.gameId}).then(res => {
          console.log(res.data);
          if (res.success) {
            this.solveGameData(res.data, null);
          } else if (res.errorCode === 'need_vip') {
            this.$vip();
          } else {
            this.getGameInfo()
          }
        });
      });
    },

    swapTeam() {
      this.doLoginStatus().then((res) => {
        api.getByPath("/api/v0/tuxun/team/swapTeam", {gameId: this.gameId}).then(res => {
          console.log(res.data);
          if (res.success) {
            this.solveGameData(res.data, undefined);
          } else {
            this.getGameInfo()
          }
        });
      });
    },

    getGameInfo() {
      this.doLoginStatus().then((res) => {
        api.getByPath("/api/v0/tuxun/solo/get", {gameId: this.gameId}).then(res => {
          console.log(res.data);
          if (res.success) {
            this.solveGameData(res.data, undefined);
          }
        });
      });
    },

    start() {
      api.getByPath("/api/v0/tuxun/solo/start", {gameId: this.gameId}).then(res => {
        if (res.success) {
          this.solveGameData(res.data, undefined);
        }  else if (res.errorCode === 'need_vip') {
          this.$vip();
        }
      });
    },

    createNew() {
      if (this.gameData.type === 'country_streak' ) {
        var tType = 'country';

        if (this.gameData.move) {
          tType = 'country_move'
        }
        api.getByPath("/api/v0/tuxun/streak/create", {type: tType}).then(res => {
          tuxunJump('/tuxun/streak_game?streakId=' + res.data.id);
        });
      } else {
        api.getByPath("/api/v0/tuxun/streak/create", {type: 'province'}).then(res => {
          tuxunJump('/tuxun/streak_game?streakId=' + res.data.id);
        });
      }
    },

    click(e) {
      if (!this.confirmed) {
        this.lng = e.latlng.wrap().lng;
        this.lat = e.latlng.wrap().lat;
        this.addChooseMarker();
        if (this.gameData.type === 'team' || this.gameData.type === 'solo' || this.gameData.type === 'solo_match' ) {
          api.getByPath("/api/v0/tuxun/game/pin", {gameId: this.gameId, lng: this.lng, lat: this.lat}).then(res => {
          });
        } else if (this.gameData.type === 'daily_challenge') {
          api.getByPath("/api/v0/tuxun/challenge/pin", {gameId: this.gameId, lng: this.lng, lat: this.lat}).then(res => {
          });
        } else if (this.gameData.type === 'battle_royale') {
          api.getByPath("/api/v0/tuxun/br/pin", {gameId: this.gameId, lng: this.lng, lat: this.lat}).then(res => {
          });
        }
      }
    },

    removeChooseMarker() {
      if (this.chooseMarker !== null) {
        this.chooseMarker.remove();
        this.chooseMarker = null;
      }
    },

    addChooseMarker() {
      if (this.chooseMarker) {
        this.chooseMarker.remove();
      }
      var marker = L.marker([this.lat, this.lng], {icon: new L.Icon.Default()}).bindTooltip("你选择了",
          {
            permanent: true,
            direction: 'auto'
          }).addTo(this.map);
      this.chooseMarker = marker;
    },

    addLine() {
      if (this.polylinePath) {
        this.polylinePath.remove();
        this.polylinePath = null;
      }

      var latlngs = [
        [this.lat, this.lng],
        [this.targetLat, this.targetLng],
      ];

      this.polylinePath = new L.Polyline(latlngs, {
        color: 'blue',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
      });
      this.polylinePath.addTo(this.map);
    },

    removeLine() {
      if (this.polylinePath) {
        this.polylinePath.remove(this.map);
      }
      this.polylinePath = null;
    },

    removeTargetMarker() {
      if (this.targetMarker) {
        this.targetMarker.remove();
      }
      this.targetMarker = null;
    },

    addTargetMarker() {
      var timeout = 0;
      if (!this.map) {
        timeout = 200;
      }

      if (this.targetMarker) {
        this.targetMarker.remove();
      }

      setTimeout(() => {
        var options = JSON.parse(JSON.stringify(L.Icon.Default.prototype.options))
        options.iconUrl = this.imgOrigin + 'biz/1662830770348_9499340182724556af66f2b42846135b_0.png';
        options.iconRetinaUrl = this.imgOrigin + 'biz/1662830707508_d7e5c8ce884a4fb692096396a5405f5b_0.png';
        var marker = L.marker([this.targetLat, this.targetLng], {icon: new L.Icon(options)}).bindTooltip("目标位置",
            {
              permanent: true,
              direction: 'auto'
            }).addTo(this.map);
        this.targetMarker = marker;

      }, timeout)

    },

    countDown() {
      setInterval(() => {
        if (this.lastRound && this.lastRound.timerStartTime && !this.lastRound.endTime) {
          this.timeLeft = Math.round((this.gameData.roundTimePeriod - ((new Date().getTime()) - this.lastRound.timerStartTime)) / 1000);
          if (this.timeLeft < 0) {
            this.timeLeft = 0;
          }
        } else {
          // if (this.gameData) {
          //   this.timeLeft = this.gameData.roundTimePeriod / 1000;
          // }
          this.timeLeft = 15;
        }

        if (this.timeLeft < 60) {
          this.timeLeftStr = this.timeLeft.toString()
        } else {
          this.timeLeftStr = Math.floor(this.timeLeft / 60).toString().padStart(2, '0') + ':' + (this.timeLeft % 60).toString().padStart(2, '0');
        }

        if (this.gameData && this.gameData.timerStartTime && this.gameData.status === "ready") {
          this.gameTimeLeft = Math.round( (this.gameData.startTimerPeriod - ((new Date().getTime()) - this.gameData.timerStartTime)) / 1000);
          if (this.gameTimeLeft < 0) {
            this.gameTimeLeft = 0;
          }
        } else {
          this.gameTimeLeft = Math.round( this.gameData.startTimerPeriod / 1000);
        }
      }, 1000);
    },

    drawTeamUser(teamUser) {
      if (teamUser.guesses && teamUser.guesses.length > 0) {
        var lastGuess = teamUser.guesses[teamUser.guesses.length - 1];
        if (lastGuess.round === this.gameData.currentRound) {
          if (teamUser.user.userId !== this.$store.state.user.userInfo.userId) {
            var marker = L.marker([lastGuess.lat, lastGuess.lng], {icon: new L.Icon.Default()}).bindTooltip(teamUser.user.userName,
                {
                  permanent: true,
                  direction: 'auto'
                }).addTo(this.map);
            this.ranksMarker.push(marker);
          } else {
            this.lat = lastGuess.lat;
            this.lng = lastGuess.lng;
            this.confirmed = true;
            this.addChooseMarker();
          }
        }
      }
    },

    centerView() {
      var timeout = 0;
      if (!this.map) {
        timeout = 200;
      }
      setTimeout(() => {
        var group = [];
        if (this.lat) {
          group.push([this.lat, this.lng]);
        }

        if (this.targetLat) {
          group.push([this.targetLat, this.targetLng]);
        }

        if (this.gameData) {
          this.gameData.teams.forEach(item => {
            item.teamUsers.forEach(teamUser => {
              var lastGuess = teamUser.guesses[teamUser.guesses.length - 1];
              if (lastGuess && lastGuess.round === this.gameData.currentRound) {
                group.push([lastGuess.lat, lastGuess.lng]);
              }
            });
          });
        }
        if (group.length === 1) {
          this.map.fitBounds(group, {maxZoom: 5});
        } else if (group.length > 1) {
          this.map.fitBounds(group);
        }
      }, timeout);
    },

    addRanksMarker() {
      var timeout = 0;
      if (!this.map) {
        timeout = 200;
      }
      setTimeout(() => {
        this.clearRanksMarker();
        if (this.gameData) {
          this.gameData.teams.forEach(item => {
            item.teamUsers.forEach(teamUser => {
              this.drawTeamUser(teamUser);
            });
          });
        }
      }, timeout);
    },

    checkInTeams(team) {
      for (let i = 0; i < team.users.length; i++) {
        if (team.users[i].userId == this.$store.state.user.userInfo.userId) {
          return true;
        }
      }
      return false;
    },

    addTeamMarker() {
      var timeout = 0;
      if (!this.map) {
        timeout = 200;
      }
      setTimeout(() => {
        this.clearRanksMarker();
        if (this.gameData) {
          this.gameData.teams.forEach(item => {
            if (this.checkInTeams(item)) {
              item.teamUsers.forEach(teamUser => {
                this.drawTeamUser(teamUser);
              });
            }
          });
        }
      }, timeout);
    },

    clearRanksMarker() {
      if (this.ranksMarker) {
        this.ranksMarker.forEach(item => {
          item.remove();
        });
      }
      this.ranksMarker = [];
    },
    keyConfirm() {
      this.confirm();
    },
    confirm() {
      if (!this.lng) {
        this.$toast('请在地图上选择位置');
        return
      }
      this.confirmed = true;
      var path = "/api/v0/tuxun/solo/guess";
      if (this.gameData.type === 'daily_challenge' || this.gameData.type === 'challenge') {
        path = "/api/v0/tuxun/challenge/guess";
      }

      if (this.gameData.type === 'battle_royale') {
        path = "/api/v0/tuxun/br/guess";
      }

      if (this.gameData.type === 'country_streak' || this.gameData.type === 'province_streak') {
        path = "/api/v0/tuxun/streak/guess";
      }

      api.getByPath(path, {gameId: this.gameId, lng: this.lng, lat: this.lat}).then(res => {
        if (this.gameData.type === 'country_streak' || this.gameData.type === 'province_streak') {
          this.solveGameData(res.data, undefined);
        }
      });
    },

    next() {
      this.confirmed = false;
      if (this.challengeId) {
        api.getByPath("/api/v0/tuxun/challenge/next", {gameId: this.gameId}).then(res => {
          if(res.success) {
            this.solveGameData(res.data, undefined);
          }
        });
      } else {
        api.getByPath("/api/v0/tuxun/streak/next", {gameId: this.gameId}).then(res => {
          if (res.success) {
            this.solveGameData(res.data, undefined);
          }
        });
      }
    },

    skip() {
      // this.$confirm('此操作会消耗 10 FBi，是否确认操作?', '换一题？', {
      //   confirmButtonText: '确认',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      api.getByPath("/api/v0/tuxun/streak/skip", {gameId: this.gameId}).then(res => {
        this.solveGameData(res.data, undefined);
      });
      // }).catch(() => {});
    },

    goTuxun() {
      tuxunJump('/tuxun/solo_game');
    },

    toNew() {
      var type = "noMove";
      if (this.gameData.move) {
        type = "move"
      }
      api.getByPath("/api/v0/tuxun/br/get", {type: type}).then(res => {
        if (res.data.gameId) {
          tuxunJump('/tuxun/guoqing_game?guoqingId=' + res.data.gameId);
        }
      });
    },
    again() {
      api.getByPath('/api/v0/tuxun/game/again', {'gameId': this.gameId}).then(res => {
        if (res.data) {
          if (res.data.type === 'team') {
            tuxunJump('/tuxun/team_game?gameId=' + res.data.id);
          } else {
            tuxunJump('/tuxun/solo_game?gameId=' + res.data.id);
          }
        }
      })
    },

    replay() {
      tuxunJump('/tuxun/replay?gameId=' + this.gameId);
    },

    challengeAgain() {
      this.doLoginStatus().then((res) => {
        if (res) {
          var type = 'noMove';
          if (this.gameData.move) {
            type = 'move'
          }
          api.getByPath('/api/v0/tuxun/challenge/create', {'mapsId': this.gameData.mapsId, 'type': type}).then(res => {
            if (res.success) {
              tuxunJump( '/tuxun/challenge?challengeId=' + res.data);
            }
          })
        }
      });
    },
    goDailyChallenge() {
      if (this.gameData.move) {
        tuxunJump('/tuxun/daily_challenge?type=move');
      } else if (this.gameData.mapsId === 9) {
        tuxunJump('/tuxun/daily_challenge?type=china');
      } else {
        tuxunJump('/tuxun/daily_challenge?type=noMove');
      }
    },

    goHome() {
      tuxunJump( '/tuxun/');
    },

    goMaps() {
      tuxunJump( '/tuxun/maps');
    },


    toReport() {
      api.getByPath('/api/v0/tuxun/game/report', {content: this.image}).then(res => {
        this.$toast("反馈成功");
      })
    },

    notify(text) {
      var Notification = window.Notification || window.mozNotification || window.webkitNotification;
      if (Notification) {
        if ("granted" !== this.notifyStatus) {
        } else {
          var notify = new Notification("图寻通知", {
            dir: 'auto',
            data: '',
            lang: 'zh-CN',
            requireInteraction: false,
            // tag: ,//实例化的notification的id
            icon: 'https://i.chao-fan.com/biz/08a2d3a676f4f520cb99910496e48b4e.png?x-oss-process=image/resize,h_80/quality,q_75',//通知的缩略图,//icon 支持ico、png、jpg、jpeg格式
            body: text
          });
          notify.onclick = function (val) {
            //如果通知消息被点击,通知窗口将被激活
            window.focus();
            notify.close();
          },
              notify.onshow = function () {
                setTimeout(notify.close.bind(notify), 5000);
              }
          notify.onerror = function () {
            console.log("HTML5桌面消息出错！！！");
          };
          notify.onclose = function () {
            console.log("HTML5桌面消息关闭！！！");
          };
        }
      } else {
        console.log("您的浏览器不支持桌面消息");
      }
    },

    match() {
      // 每3秒发送一次心跳
      this.doLoginStatus().then((res) => {
        this.continueSend = true;
        this.t = setInterval(() => {
          try {
            if (this.continueSend) {
              this.continueSend = false;
              api.getByPathLongTimeout('/api/v0/tuxun/solo/joinRandom').then(res => {
                if (res.data) {
                  this.notify("您的图寻已匹配到对手，点击开始游戏");
                  tuxunJump( '/tuxun/solo_game?gameId=' + res.data);
                  this.gameId = res.data;
                  this.init();
                  this.continueSend = false;
                  clearInterval(this.t);
                } else {
                  this.continueSend = true;
                }
              })
            }
          } catch (e) {
            this.continueSend = true;
          }
        }, 1500);
      });
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
    changeMaps(mapsId, mapsType) {
      // this.$mapsSearch();
      api.getByPath('/api/v0/tuxun/game/changeMapsId', {gameId: this.gameData.id, mapsId: mapsId, type: mapsType}).then(res=>{
        this.mapsData = res.data
      })
    },
    changeHealth() {
      api.getByPath('/api/v0/tuxun/game/changeHealth', {gameId: this.gameData.id, health: this.health}).then(res=>{
        this.health = this.gameData.health;
      })
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
.leaflet-clickable {
  cursor: crosshair !important;
}
/* Change cursor when over entire map */
.leaflet-container {
  cursor: crosshair !important;
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
    width: 40%;
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
        width: 100px;
        height: 100px;
        margin: 0 auto;
      }

      .userName {
        margin-top: 1rem;
        font-size: 16px;
      }
    }

  }
  .prepare {
    padding-bottom: 10rem;
    div {
      color: white;
    }

    .header {
      padding-top: 5rem;
      color: white;
      font-size: 32px;
    }

    .separate-line {
      margin: auto;
      width: 40%;
      height: 1px;
      background-color: grey;
    }

    .vs {
      padding-top: 3rem;
      display: block;
      width: 40%;
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
      //max-width: 80%;
      min-width: 35rem;
      .title {
        font-size: 24px;
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
        margin-left: 1rem;
      }
    }
  }
  .game {
    position: absolute;
    width: 100%;
    height: 100%;

    .top-info {
      z-index: 20000;
      width: 100%;
      position: absolute;
      margin: 0 auto;
      margin-top: 1.5rem;
      font-size: 1.2rem;
      font-weight: bold;
      pointer-events: none;
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
      text-align: center;
      justify-content: center;

    }
    .count-down {
      z-index: 5000;
      display: inline-block;
      margin: 0 auto;
      background-color: rgb(255, 255, 255, 0.7);
      padding: 0.5rem;
      border-radius: 10px;
      color: #7654DB;
    }

    .top-info-phone {
      z-index: 20000;
      width: 100%;
      position: absolute;
      margin: 0 auto;
      padding-top: 5rem;
      font-size: 1.2rem;
      font-weight: bold;
      color: #7654DB;
      pointer-events: none;
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
    }

    .topRight {
      position: absolute;
      top: 20px;
      right: 2rem;
      z-index: 100000;
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
    }
    .topRight-phone {
      position: absolute;
      top: 30px;
      right: 20px;
      z-index: 100000;
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
    }
    .topRight-info {
      font-size: 20px;
      font-weight: bold;
      color: white;
      -webkit-text-stroke: 0.8px black;
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
    }
    .topRight-info-phone {
      font-size: 20px;
      font-weight: bold;
      color: white;
      -webkit-text-stroke: 0.4px black;
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
    }

    .round_result {
      z-index: 499;
      position: absolute;
      width: 100%;
      height: 100%;
      background: #3D465B;
      display: block;
      align-items: center;
      text-align: center;
      justify-content: center;
      padding-top: 6rem;
      .country-streak-round-result {

      }
      .round_result_top {
        color: white;
        font-size: 2rem;
        font-weight: bold;
      }
      .round_result_center {
        div {
          color: white;
          font-size: 24px;
        }
        margin: auto;
        text-align: center;

        .round_result_block {
          padding: 1rem;
          background: #171829;
          margin-bottom: 1rem;
        }
      }
      .challenge_result_bottom {
        .result_rank {
          font-size: 28px;
          color: white;
          padding-bottom: 1rem;
        }
        .result_button {
          margin-top: 1rem;
          font-size: 16px;
        }
      }
    }
    .game_result {
      position: absolute;
      height: 100%;
      width: 100%;
      background: #090723;
      display: flex;
      justify-content: center;
      z-index: 5000;
      .info {
        padding-top: 20px;
        font-size: 16px;
      }
    }
    .im-view {
      position: absolute;
      width: 100%;
      height: 100%;
      bottom: 0;
      left: 0;
      text-align: center;
      overflow: hidden;
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
      transform-origin: center;
    }
    .bm-view-container {
      position: absolute;
      padding-right: 2rem;
      padding-bottom: 1.5rem;
      bottom: 0;
      right: 0;
      width: 25%;
      height: 35%;
      opacity: 0.7;
      z-index: 5000;
      display:flex;
      flex-flow:column nowrap;
      overflow:hidden;

      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;

      .bm-view {
        flex: 1;
      }
    }
    .bm-view-container-phone {
      position: absolute;
      width: 100%;
      height: 40%;
      bottom: 0;
      right: 0;
      z-index: 5000;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      .bm-view-phone {
        width: 100%;
        height: 100%;
      }
    }
    .bm-view-container-phone-hidden {
      position: absolute;
      width: 100%;
      height: 40%;
      bottom: 0;
      right: 0;
      z-index: 5000;
      visibility: hidden;

      .bm-view-phone{
        width: 100%;
        height: 100%;
      }
    }

    .confirm {
      position: absolute;
      bottom: 30px;
      right: 30px;
      width: 300px;
      z-index: 10000;
    }

    .confirm-phone {
      position: absolute;
      bottom: 20px;
      right: 20px;
      margin:auto;
      z-index: 10000;
    }

    .home {
      position: absolute;
      top: 5px;
      left: 20px;
      z-index: 10000;
    }

    .game_hud {
      pointer-events: none;
      display: flex;
      position: absolute;
      justify-content: space-between;
      top: 2rem ;
      //height: 2.5rem;
      width: 100%;
      //background-color: blue;
      z-index: 10000;
      touch-action: pan-x pan-y;
      padding-left: 20px;
      padding-right: 20px;
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
      .user_title {
        text-align: left;
        font-size: 1.5rem;
        font-weight: bolder;
        color: white;
        -webkit-text-stroke: 1px black;
      }
      .sub_user_name {
        text-align: left;
        font-size: 1rem;
        font-weight: bolder;
        color: white;
        -webkit-text-stroke: 1px black;
      }
      .user_blod_left {
        text-align: left;
        font-size: 1.5rem;
        font-weight: bolder;
        color: white;
        -webkit-text-stroke: 1px black;
      }
      .user_blod_right {
        text-align: left;
        font-size: 1.5rem;
        font-weight: bolder;
        color: white;
        -webkit-text-stroke: 1px black;
      }
      .hub_left {

      }
      .hub_right {

      }
    }
  }

  .not_support_phone {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #090723;;
    font-size: 48px;
    color: white;
    z-index: 10000;
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
          padding-left: 10px;
          padding-right: 10px;
          max-width: 100%;
        }
      }
    }

    .player {
      width: 80%;
      .avatar {
        width: 50px;
        height: 50px;
        margin: 0 auto;
      }

      .userName {
        margin-top: 1rem;
        font-size: small;
      }
    }

    .game {
      .round_result {
        display: block;
        padding-top: 5rem;
        .round_result_block {
          padding: 0.2rem;
        }
      }
      .game_hud {
        .user_title {
          font-size: medium;
        }
        .user_blod_left {
          font-size: medium;
        }
        .user_blod_right {
          font-size: medium;
        }
      }
    }
  }

}
@media  (any-hover:none) {
  .game_container {
    .game {
      .bm-view-container {
        width: 40%;
        height: 40%;
        opacity: 1;
      }
    }
  }
}
</style>
