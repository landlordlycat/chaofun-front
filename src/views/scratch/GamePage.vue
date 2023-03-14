<template>
  <div class="container">
    <div class="back_home">
      <el-button v-if="history && history.length !== 1" @click="goBack" size="small" round>←返回</el-button>
      <el-button @click="goHome" size="small" round>←首页</el-button>
      <el-button @click="share" size="small"  round>分享</el-button>
      <el-button @click="random" size="small"  round>随机下一个</el-button>
      <el-button size="small"  v-if="guessInfo &&  this.$store.state.user && this.$store.state.user.userInfo  && this.$store.state.user.userInfo.userId === this.guessInfo.userId" @click="modify" round>修改</el-button>
    </div>
    <div v-if="guessInfo" :class="nameClass">
      {{this.guessInfo.name}}
    </div>
    <div v-if="guessInfo" style="padding-bottom: 10px;margin: auto; text-align: center; font-size: 16px">
      {{this.guessInfo.desc}}
    </div>
    <div v-if="giveUp || !start">
      <div v-if="guessInfo && guessInfo.user" style="margin: auto; text-align: center; font-size: 16px">
        作者: <span @click="goUser(guessInfo.user.userId)" style="color: #333fff; text-decoration:underline;cursor: pointer;font-weight: bold">{{guessInfo.user.userName}}</span>
      </div>
      <div v-if="guessInfo && guessInfo.gmtCreate" style="margin: auto; text-align: center; font-size: 16px;">
        创建时间: {{moment(guessInfo.gmtCreate).format('YYYY年MM月DD日 HH:mm')}}
      </div>
      <div v-if="guessInfo && guessInfo.tags" style="align-items: center;justify-items: center;margin: auto; text-align: center; font-size: 16px; display: flex;justify-content: center;text-align: center;">
        标签：
        <div v-for="(item, index) in guessInfo.tags" @click="goTag(item)" style="padding: 2px; margin-right: 10px; color: #333fff; text-decoration:underline;cursor: pointer;">
          {{item}}
        </div>
      </div>
      <div v-if="guessInfo" style="margin: auto; text-align: center; font-size: 16px">
        测验次数: {{guessInfo.start}}
      </div>
      <div v-if="guessInfo" style="margin: auto; text-align: center; font-size: 16px;">
        <div style="display: flex; align-items: center;justify-content: center">
          评分( {{guessInfo.rateCount}} 人评价)：
          <div>
            <StarRating :read-only="true" :increment="0.01" :rating="guessInfo.rate" :star-size="25"></StarRating>
          </div>
        </div>
      </div>
      <div v-if="guessInfo" style="margin: auto; text-align: center; font-size: 16px;">
        <div style="display: flex; align-items: center;justify-content: center">
          我的打分：
          <div>
            <StarRating @rating-selected ="setRating" :show-rating="false" v-model:rating="rating" :star-size="25"></StarRating>
          </div>
        </div>
      </div>
    </div>

    <div :class="inputClass">
      <div style="display: flex">
        <div v-if="start || this.giveUp">
          <div class="tiktok" style="color: #52B323;  padding-right: 20px; text-align: center; align-items: center">
            {{timeLeftStr}}
          </div>
          <el-button v-if="ISPHONE && start" size="mini" type="warning" style="margin: auto; text-align: center;" @click="endGame">放弃</el-button>
        </div>

        <div v-if="start && guessInfo && guessInfo.type !== 'click'" class="input" style="height: 100%">
          <div v-if="guessInfo">
            猜对：<span style="color: green"> {{this.right}} </span> / {{this.guessInfo.data.answers.length}}
          </div>
          <el-input ref="input" autofocus @input="match" v-model="inputResult">
            点击输入答案
          </el-input>
        </div>

        <div v-if="start && guessInfo && guessInfo.type === 'click'" class="input" style="height: 100%; display: flex; flex-grow: 1">
          <div style="display: flex">
            <el-button type="primary" @click="clickPrev">上一个</el-button>
            <el-button type="primary" @click="clickNext">下一个</el-button>
          </div>
          <div style="display: block">
            <div v-if="guessInfo">
              猜对：<span style="color: green"> {{this.right}}  </span> / {{this.guessInfo.data.answers.length}}
            </div>
            <div v-if="guessInfo">
              猜错：<span style="color: red"> {{this.wrong}} </span> / {{this.guessInfo.data.answers.length}}
            </div>
            <div v-if="guessInfo">
              剩余： {{this.left}}  / {{this.guessInfo.data.answers.length}}
            </div>
          </div>
        </div>

      </div>
      <div v-if="!showResult">
        <div v-if="!start && guessInfo && !giveUp" style="margin: auto; text-align: center; padding-top: 1rem">
          <el-button type="primary" style="margin: auto; text-align: center;" @click="startGuess">开始</el-button>
        </div>
        <div v-if="start && guessInfo && !ISPHONE" style="margin: auto; text-align: center; padding-top: 1rem">
          <el-button type="warning" style="margin: auto; text-align: center;" @click="endGame">放弃</el-button>
        </div>
      </div>
      <div v-else class="result">
        恭喜你，已经全部答对
      </div>
    </div>

    <div v-if="endStatus" class="end-container">
      <div> 你的得分 {{endStatus.score }} / {{guessInfo.data.answers.length}} = {{ Number(endStatus.rightPercentage * 100).toFixed(2) }} % </div>
      <div> 超过/等于 了 {{Number((endStatus.abovePercentage) * 100).toFixed(2) }} % 人</div>
      <div> 该题的平均分是 {{Math.round(endStatus.avgScore)}}</div>
      <div> 你的最高分是 <span v-if="endStatus.yourHighestScore !== null">{{endStatus.yourHighestScore}}</span><span v-else style="color: #333fff;cursor: pointer;" @click="login()">需要登录记录</span> </div>
    </div>
    <div v-if="!start && guessInfo && giveUp" style="margin: auto; text-align: center; padding-top: 1rem">
      <el-button type="primary" style="margin: auto; text-align: center; margin-bottom: 10px" @click="startGuess" round>再来一次</el-button>
    </div>
    <section v-if="guessInfo" style="width: 100%;">
      <div v-if="guessInfo.type === 'text'" class="table">
        <table v-if="guessInfo" style="width: 100%">
          <tr style="width: 100px;">
            <th v-if="guessInfo.data.hasHint" style="background-color: #eee">提示</th>
            <th style="background-color: #eee">答案</th>
          </tr>
          <tr v-for="(item, index) in guessInfo.data.data">
            <td v-if="guessInfo.data.hasHint" style="width: 50%">
              <div style="text-align: center;">
                {{item.hint}}
              </div>
            </td>
            <td style="width: 50%; border: 1px solid black;">
              <div v-if="matched.has(item.answer)" style="text-align: center; color: green">
                {{item.answer}}
              </div>
              <div v-if="!matched.has(item.answer) && giveUp" style="text-align: center; color: red">
                {{item.answer}}
              </div>
              <div v-if="!matched.has(item.answer) && !giveUp" style="text-align: center">
                {{'-'}}
              </div>
            </td>
          </tr>
        </table>
      </div>
      <viewer v-else-if="guessInfo && guessInfo.type === 'image' && !guessInfo.data.slideshow" class="grid-main">
        <div v-for="(item,index) in guessInfo.data.data" class="card">
          <div class="card-image-contain">
            <img :data-source="imgOrigin + item.image" :src="imgOrigin + item.image + '?x-oss-process=image/resize,h_300/format,jpeg/quality,q_75'" class="test-image" ></img>
          </div>
          <div style="width: 100%; border: 1px solid black;">
            <div v-if="matched.has(item.answer)" style="text-align: center; color: green">
              {{item.answer}}
            </div>
            <div v-if="!matched.has(item.answer) && giveUp" style="text-align: center; color: red">
              {{item.answer}}
            </div>
            <div v-if="!matched.has(item.answer) && !giveUp" style="text-align: center">
              {{'-'}}
            </div>
          </div>
        </div>
      </viewer>
      <div v-else-if="guessInfo && guessInfo.type === 'image' && guessInfo.data.slideshow" class="slide-table">
        <el-pagination
            background
            layout="prev, pager, next"
            :pager-count="ISPHONE ? 3 : 6"
            style="padding-bottom: 20px;"
            :current-page.sync="innerCurrent"
            :page-size="1"
            @current-change="slideChangeCurrent"
            :total="guessInfo.data.data.length">
        </el-pagination>
        <viewer style="border: 1px dashed black;">
          <img :data-source="imgOrigin + guessInfo.data.data[innerCurrent-1].image" :src="imgOrigin + guessInfo.data.data[innerCurrent-1].image + '?x-oss-process=image/format,jpeg/quality,q_30'" class="slideshow-img"  ></img>
        </viewer>
        <div style="width: 100%; border: 1px solid black; margin-bottom: 5px">
          <div v-if="matched.has(innerCurrent-1)" style="font-size: 24px; text-align: center; color: green">
            {{guessInfo.data.data[innerCurrent-1].answer}}
          </div>
          <div v-if="!matched.has(innerCurrent-1) && giveUp" style="font-size: 24px;text-align: center; color: red">
            {{guessInfo.data.data[innerCurrent-1].answer}}
          </div>
          <div v-if="!matched.has(innerCurrent-1) && !giveUp" style="font-size: 24px;text-align: center">
            {{'-'}}
          </div>
        </div>
        <el-pagination
            background
            layout="prev, pager, next"
            :pager-count="ISPHONE ? 3 : 6"
            style="padding-bottom: 20px;"
            :current-page.sync="innerCurrent"
            :page-size="1"
            @current-change="slideChangeCurrent"
            :total="guessInfo.data.data.length">
        </el-pagination>
      </div>
      <div v-else-if="guessInfo && guessInfo.type === 'click'" class="table">
        <div class="title">
          {{guessInfo.data.data[clickIndex].hint}}
        </div>
        <div class="answer-grid" >
          <div v-for="(item, index) in shuffleAnswers"  @click="clickMatch(index)">
            <div v-if="rightClickIndex === index" class="answer-right">
              {{item}}
            </div>
            <div v-else-if="wrongClickIndex === index"  class="answer-wrong">
              {{item}}
            </div>
            <div v-else  class="answer">
              {{item}}
            </div>
          </div>
        </div>
        <div v-if="showClickRight" style="color: green; font-size: 20px; font-weight: bold">✅ 正确</div>
        <div v-if="showClickWrong" style="color: red; font-size: 20px; font-weight: bold">X 错误</div>
        <table v-if="guessInfo && endStatus" style="width: 100%; margin-top: 1rem">
          <tr style="width: 100px;">
            <th style="background-color: #eee">问题</th>
            <th style="background-color: #eee">答案</th>
          </tr>
          <tr v-for="(item, index) in guessInfo.data.data">
            <td v-if="guessInfo.data" style="width: 50%">
              <div style="text-align: center;">
                {{item.hint}}
              </div>
            </td>
            <td style="width: 50%; border: 1px solid black;">
              <div v-if="guessInfo.data.data[index].right" style="text-align: center; color: green">
                {{item.answer}}
              </div>
              <div v-else style="text-align: center; color: red">
                {{item.answer}}
              </div>
            </td>
          </tr>
        </table>
      </div>

    </section>
    <div v-if="ISPHONE" style="height: 30rem"></div>
    <div v-if="!ISPHONE" style="height: 10rem"></div>
  </div>
</template>

<script>
import * as api from '../../api/api'
import moment from 'moment'
import StarRating from 'vue-star-rating'


export default {
  name: "GamePage",
  components: {
    StarRating,
  },
  data() {
    return {
      history: null,
      showResult: false,
      inputResult: '',
      guessInfo: null,
      giveUp: false,
      showClickRight: null,
      showClickWrong: null,
      rightClickIndex: null,
      wrongClickIndex: null,
      matched: new Set(),
      id: null,
      moment: moment,
      right: 0,
      wrong: 0,
      left: 0,
      start: false,
      end: false,
      countdownTimer: null,
      timeLeftStr: '00:00',
      rating: null,
      timeLeft: null,
      endStatus: null,
      inputClass: 'input-container',
      nameClass: 'name',
      clickIndex: 0,
      shuffleAnswers: [],
      innerCurrent: 1,
    }
  },
  mounted() {
    this.history = history;
    document.title = '炒饭小测验 - 一起来做小测验吧'
    this.id =  this.$route.query.id;
    this.getGuessInfo();
    this.getRate();
  },
  methods: {
    goUser(userId) {
      window.location.href = '/scratch/user/' + userId
    },
    modify() {
      window.location.href = '/scratch/modify?id=' + this.id
    },
    endGame() {
      if (!this.giveUp) {
        api.getByPath('/api/v0/scratch/game/end', {'id': this.id, 'score': this.right}).then(res => {
          this.endStatus = res.data;
        })
      }

      this.inputClass='input-container'
      this.nameClass = 'name'
      this.start = false;
      this.giveUp = true;
    },
    startGuess() {
      this.giveUp = false;
      this.start = true;
      if (this.ISPHONE) {
        this.inputClass = "input-container-phone"
        this.nameClass = 'name-phone-click'
      }
      this.right = 0;
      this.wrong = 0;
      this.clickIndex = 0;
      this.left = this.guessInfo.data.data.length;
      // 重新开始的时候标记一下
      this.guessInfo.data.data.forEach(item => {
        item.guessd = false;
        item.right = false;
      })
      this.showResult = false;
      this.right = 0;
      this.endStatus = null;
      this.matched = new Set();
      this.timeLeft = this.guessInfo.countdown;
      this.inputResult = '';
      this.timeLeftStr = Math.floor(this.timeLeft / 60).toString().padStart(2, '0') + ':' + (this.timeLeft % 60).toString().padStart(2, '0');
      clearInterval(this.countdownTimer);
      api.getByPath('/api/v0/scratch/game/start', {'id': this.id}).then(res=>{
      })

      if (this.guessInfo.countdown) {
        this.countdownTimer =  setInterval(() => {
          this.timeLeft = this.timeLeft - 1;
          this.timeLeftStr = Math.floor(this.timeLeft / 60).toString().padStart(2, '0') + ':' + (this.timeLeft % 60).toString().padStart(2, '0');
          if (this.giveUp || this.timeLeft <= 0 || this.showResult) {
            clearInterval(this.countdownTimer);
            this.endGame();
          }
        }, 1000);
      }
      this.focus();
    },
    slideChangeCurrent() {
      this.inputResult = '';
      this.focus();
    },
    focus() {
      setTimeout(() => {
        this.$refs.input.focus();
      }, 200);
    },
    getGuessInfo() {
      api.getByPath('/api/v0/scratch/game/get', {'id': this.id}).then(res=>{
        this.guessInfo = res.data;
        this.left = this.guessInfo.data.data.length;
        this.shuffleAnswers = Array.from(new Set(this.guessInfo.data.answers)).sort();
      })
    },
    getRate() {
      api.getByPath('/api/v0/scratch/game/getRate', {'id': this.id}).then(res=>{
        this.rating = res.data;
      })
    },
    goHome() {
      window.location.href = '/scratch'
    },
    goTag(item) {
      window.location.href = '/scratch/tag?tagName=' + item;
    },
    login() {
      this.$login({
        callBack: () => {
          this.$store.dispatch("user/getInfo");
        },
      });
    },
    clickMatch(index) {
      if (!this.start) {
        this.startGuess();
      }
      if (this.shuffleAnswers[index] === this.guessInfo.data.data[this.clickIndex].answer) {
        this.right = this.right + 1;
        this.rightClickIndex = index;
        this.showClickRight = true;
        this.guessInfo.data.data[this.clickIndex].right = true;
      } else {
        this.wrongClickIndex = index;
        this.wrong = this.wrong + 1;
        this.showClickWrong = true;
        this.guessInfo.data.data[this.clickIndex].right = false;
      }
      this.guessInfo.data.data[this.clickIndex].guessd = true;
      this.left = this.left - 1;
      if (this.right === this.guessInfo.data.data.length) {
        this.showResult = true;
        this.clickIndex = 0;
      } else if (this.left === 0) {
        this.endGame();
        this.clickIndex = 0;
      }

      this.clickNext();
    },
    cleanClickStatus() {
      this.showClickRight = false;
      this.showClickWrong = false;
      this.rightClickIndex = null;
      this.wrongClickIndex = null;
    },
    clickNext() {
      setTimeout(() => {
        this.cleanClickStatus();
      }, 500);
      console.log(this.clickIndex)
      for (let i = this.clickIndex + 1; i < this.guessInfo.data.data.length; i++) {
        if (!this.guessInfo.data.data[i].guessd) {
          this.clickIndex = i;
          console.log(this.clickIndex)
          return;
        }
      }
      for (let i = 0; i < this.clickIndex; i++) {
        if (!this.guessInfo.data.data[i].guessd) {
          this.clickIndex = i;
          return;
        }
      }
    },
    clickPrev() {
      setTimeout(() => {
        this.cleanClickStatus();
      }, 500);
      for (let i = this.clickIndex - 1; i >= 0; i--) {
        if (!this.guessInfo.data.data[i].guessd) {
          this.clickIndex = i;
          return;
        }
      }
      for (let i = this.guessInfo.data.data.length - 1; i > this.clickIndex; i--) {
        if (!this.guessInfo.data.data[i].guessd) {
          this.clickIndex = i;
          return;
        }
      }
    },
    match(e) {

      if (this.guessInfo.data.slideshow) {
        var v = this.guessInfo.data.answers[this.innerCurrent - 1];
        if (this.palindrome(v) === this.palindrome(e) && !this.matched.has(this.innerCurrent - 1)) {
          this.matched.add(this.innerCurrent -1)
          this.right = this.right + 1;
          this.inputResult = '';
          if (this.innerCurrent !== this.guessInfo.data.data.length) {
            this.innerCurrent = this.innerCurrent + 1;
          }
          if (this.right === this.guessInfo.data.answers.length) {
            this.showResult = true;
          }
        }
      } else {
        var matchValue = null;
        this.guessInfo.data.answers.forEach(v => {
          if (this.palindrome(v) === this.palindrome(e) && !this.matched.has(v)) {
            this.right = this.right + 1;
            this.inputResult = '';
            matchValue = v;
            if (this.right === this.guessInfo.data.answers.length) {
              this.showResult = true;
            }
          }
        });
        if (matchValue || (!matchValue && !e)) {
          this.matched.add(matchValue);
        }
      }
    },
    share() {
      var input = document.createElement('input');
      input.setAttribute('value','邀请你来炒饭做「' + this.guessInfo.name + '」小测验, 你能答出来吗？ https://choa.fun/scratch/guess?id=' + this.id);
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand('copy');
      document.body.removeChild(input);
      this.$toast("复制测验地址成功");
      return result;
    },
    palindrome(str) {
      return str.replace(/[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/g, '');
    },
    random() {
      api.getByPath('/api/v0/scratch/game/random').then(res=>{
        window.location.href = '/scratch/guess?id=' + res.data;
      })
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        window.location.href = '/scratch'
      }
    },
    setRating(rating) {
      this.doLoginStatus().then(res => {
        console.log(res)
        if (res) {
          this.rating = rating;
          api.getByPath('/api/v0/scratch/game/rate', {id: this.id, rate: this.rating}).then(res=>{
            this.pagedata = res.data
          })

        } else {
          this.rating = null;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  position: relative;
  .name {
    padding-top: 4rem;
    margin: auto;
    text-align: center;
    font-size: 32px
  }
  .name-phone-click {
    padding-top: 6rem;
    margin: auto;
    text-align: center;
    font-size: 32px
  }
  .input-container {
    background-color: white;
    z-index: 20;
    position: sticky;
    top: 0;
    margin: auto;
    width: 30%;
    .tiktok {
      font-size: 36px;
    }
    .input {
      width: 50%;
      //padding-top: 1rem;
      //max-width: 40%;
      //margin: auto;
    }
  }
  .input-container-phone {
    position: fixed;
    top: 0;
    vertical-align: top;
    width: 100%;
    background-color: white;
    border: 1px dashed black;
    z-index: 100;
    .input {
      width: 50%;
    }
    .tiktok {
      font-size: 24px;
    }
  }
  .end-container {
    background-color: #F3EAE1;
    position: relative;
    margin: auto;
    width: 30%;
  }
  .table {
    margin-top: 2rem;
    width: 30%;
    margin-left: auto;
    margin-right: auto;

    .title {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 1rem;
    }
    .answer-grid {
      display: flex;
      flex-wrap: wrap;
      .answer {
        border: 1px solid #c7ccd1;
        padding: 4px 8px;
        font-size: 20px;
        margin: 0 8px 8px 0;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          border: 2px solid green;
        }
      }
      .answer-wrong {
        border: 1px solid #c7ccd1;
        padding: 4px 8px;
        font-size: 20px;
        margin: 0 8px 8px 0;
        border-radius: 4px;
        cursor: pointer;
        background-color: red;
      }

      .answer-right {
        border: 1px solid #c7ccd1;
        padding: 4px 8px;
        font-size: 20px;
        margin: 0 8px 8px 0;
        border-radius: 4px;
        cursor: pointer;
        background-color: green;
      }
    }
  }
  .slide-table {
    margin-top: 2rem;
    width: 30%;
    margin-left: auto;
    margin-right: auto;
    .slideshow-img {
      width: 100%; height: 25vw; object-fit: contain;
    }
  }
  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
  .result {
    width: 100%;
    text-align: center;
    padding-top: 1rem;
  }
  .grid-main {
    margin-top: 2rem;
    width: 40vw;
    margin-left: auto;
    margin-right: auto;
    display: grid;
    grid-row-gap: 0rem;
    grid-column-gap: 0rem;
    grid-template-columns: repeat(4, 1fr);
    position: relative;

    .card {
      margin: auto;
      justify-content: center;
      align-items: center;
      align-content: center;
      text-align: center;
      padding: 2px;
      position: relative;
      justify-items: center;
      .card-image-contain {
        height: 10vw;
        width: 10vw;
        position: relative;
        .test-image {
          height: 100%;
          width: 100%;
          //position: relative;
          object-fit: contain;
        }
      }
    }
  }
}

table, th, td {
  border-collapse:collapse;
  border: 1px solid black;
}

@media only screen and (max-width: 768px) {
  .container {
    .input-container {
      width: 90%;
      .input {
        width: 50%;
        //padding-top: 1rem;
        //max-width: 40%;
        //margin: auto;
      }
    }
    .input-container-phone  {
      width: 100%;
      .input {
        width: 50%;
        //padding-top: 1rem;
        //max-width: 40%;
        //margin: auto;
      }
    }
    .end-container {
      width: 90%;
    }

    .table {
      width: 90%;
    }
    .slide-table {
      width: 90%;
      .slideshow-img {
        width: 100%; height: 50vw; object-fit: contain;
      }
    }

    .grid-main {
      width: 90vw;
      grid-template-columns: repeat(2, 1fr);
      .card {
        .card-image-contain {
          height: 45vw;
          width: 45vw;
        }
      };
    }

  }


}
</style>
