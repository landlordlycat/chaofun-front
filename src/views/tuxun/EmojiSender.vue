<template>
  <div class="emojo_sender">
    <div class="button">
      <el-button type="cancel" @click="hide" round>
        取消发送
      </el-button>
    </div>
    <div class="grid_main">
      <div class="emoji" @click="sendEmoji(1)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1664353880684_8be0a1b6fcbb4073a1b96fb812c55b89_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(2)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1664353959634_4703ae8082f54b8798ba8afc0d45a91d_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(3)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1664353989506_96d6e463a55e40f8a930fb1d71ccf9f9_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(4)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1664354042715_16d5824fa7684b09a9a929fb6aeff393_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(5)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1664354089164_28cf0b137d4f446c850f3dfa8b754f81_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(6)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1664354129285_a8d3fe81112640459ebe708c78a3ee13_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(7)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1664354160405_d9fc4154094a4300a3c0bb7686edbc52_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(8)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1664354189671_41500ee5340f46ec88124143ffe6d6a0_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(9)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1664354242994_7ead0695a76e482ea20758e7a4a39ae1_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(10)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1664354287804_88fb3e9189ae40c091c3b15238267ab1_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(11)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1664353420512_60ba652252754bf194b74dd8ab0345f7_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(12)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1664353482548_901953257d994642946b285f9d4aa145_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(13)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1664353552095_8e415864e8e3407f85c0f41430030de1_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
      <div class="emoji" @click="sendEmoji(14)">
        <img class="emoji_img" src="https://i.chao-fan.com/biz/1664353590072_3ce4cd351d19449a9025344fb2aded04_0.png?x-oss-process=image/resize,h_120" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'

export default {
  name: "EmojiSender",
  props: {
    gameId: String,
  },
  methods: {
    hide() {
      this.$emit('hide');
    },
    sendEmoji(emojiId) {
      this.hide()
      api.getByPath('/api/v0/tuxun/solo/sendEmoji', {gameId: this.gameId, emojiId: emojiId}).then(res=>{
        if (res.success) {
          this.$toast('发送成功');
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.emojo_sender {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  justify-content: center;
  align-items: center;
  align-content: center;
  justify-content: center;
  text-align: center;
  .button {
    padding-top: 2.5rem;
    padding-bottom: 2rem ;
  }
  .grid_main {
    margin: auto;
    width: 50%;
    display: grid;
    grid-row-gap: 2rem;
    grid-column-gap: 1rem;
    grid-template-columns: repeat(4, 1fr);
    .emoji {
      margin: auto;
      width: 66px;
      height: 66px;
      justify-content: center;
      align-items: center;
      align-content: center;
      justify-content: center;
      text-align: center;
      .emoji_img {
        height: 100%;
        width: 100%;
        object-fit: contain;
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .emojo_sender {
    .grid_main {
      width: 80%;
      grid-template-columns: repeat(5, 1fr);
      .emoji {
        width: 40px;
        height: 40px;
      }
    }
  }
}

</style>
