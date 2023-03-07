<template>
  <div>
    <div v-if="lists != null && lists.length > 0">
      <div  v-for="(item,index) in lists" >
        <div style="border-bottom: 1px solid #f1f1f1;" v-if="item.type === 'post'" >
          <div @click="toPost(item.postInfo.postId)" style="font-size: 20px; font-weight: bold">
            帖子: {{doType(item.postInfo)}}
          </div>
          <div @click="toPost(item.postInfo.postId)" style="font-size: 16px; font-weight: bold">
            版块: {{item.postInfo.forum.name}}
          </div>
          <div @click="toPost(item.postInfo.postId)" style="font-size: 16px">
            标题&内容：{{item.postInfo.title}}
          </div>
          <div v-if="item.postInfo.type == 'image'">
            <div  v-if="item.postInfo.images" class="comImgs">
              <viewer :images="images" ref="viewer" style="line-height: 0px" >
                <div v-for="(i,k) in item.postInfo.images" :key="k">
                      <span class="aaa">
                        <img  style="opacity:1;width:300px;height:300px;object-fit: contain" :src="imgOrigin+i+'?x-oss-process=image/resize,h_300/quality,q_75'" :data-source="imgOrigin+i" >
                      </span>
                </div>
              </viewer>
            </div>
            <div v-else-if="item.postInfo.imageName">
              <viewer :images="doImgs(item.postInfo.imageName)" ref="viewer" style="line-height: 0px" >
                <div v-for="(i,k) in item.postInfo.imageName.split(',')" :key="k">
                            <span class="aaa">
                              <img  style="opacity:1;width:300px;height:300px;object-fit: contain" :src="imgOrigin+i+'?x-oss-process=image/resize,h_300/quality,q_75'" :data-source="imgOrigin+i" >
                            </span>
                </div>
              </viewer>
            </div>
          </div>
          <div @click="toPost(item.postInfo.postId)" v-if="item.postInfo.type == 'article'">
            {{item.postInfo.article}}
          </div>
          <div v-if="item.postInfo.type == 'audio'">
            <audio
                webkit-playsinline="true"
                x-webkit-airplay="true"
                playsinline="true"
                x5-video-player-type="h5"
                x5-video-orientation="h5"
                x5-video-player-fullscreen="true"
                controls
                :src="imgOrigin+item.postInfo.audio"
                alt="">
            </audio>
          </div>
          <div v-if="item.postInfo.type == 'inner_video'">
            <video style="width: 100%; max-height: 300px"
                   webkit-playsinline="true"
                   x-webkit-airplay="true"
                   playsinline="true"
                   x5-video-player-type="h5"
                   x5-video-orientation="h5"
                   x5-video-player-fullscreen="true"
                   controls
                   :src="imgOrigin+item.postInfo.video"
                   ref="videoPlayer"
                   alt="">
            </video>
          </div>
          <div v-if="item.postInfo.type == 'gif'">
            <video style="width: 100%; max-height: 300px"
                   webkit-playsinline="true"
                   x-webkit-airplay="true"
                   playsinline="true"
                   x5-video-player-type="h5"
                   x5-video-orientation="h5"
                   x5-video-player-fullscreen="true"
                   controls
                   :src="imgOrigin+item.postInfo.imageName"
                   ref="videoPlayer"
                   alt="">
            </video>
          </div>
          <div @click="toPost(item.postInfo.postId)" style="font-size: 16px">
            用户：{{item.postInfo.userInfo.userName}}
          </div>
          <div @click="toPost(item.postInfo.postId)" style="font-size: 16px">
            举报原因：{{item.reason}}
          </div>

          <div>
            <el-button @click="dealReport(item.id, 'ignore')">忽略</el-button>
            <el-button @click="dealReport(item.id, 'delete')">删除</el-button>
            <el-button @click="dealReport(item.id, 'publish_sex')">色情+删除</el-button>
            <el-button @click="dealReport(item.id, 'punish_politic')">政治+删除</el-button>
            <el-button @click="dealReport(item.id, 'malicious')">恶意举报</el-button>
          </div>
        </div>


        <div style="border-bottom: 1px solid #f1f1f1;" v-if="item.type === 'comment'" >
          <div @click="toComment(item.postInfo.postId, item.commentInfo.id)" style="font-size: 20px; font-weight: bold">
            评论 {{doCommentType(item.commentInfo)}}
          </div>
          <div @click="toComment(item.postInfo.postId, item.commentInfo.id)" style="font-size: 16px; font-weight: bold">
            版块: {{item.postInfo.forum.name}}
          </div>
          <div @click="toComment(item.postInfo.postId, item.commentInfo.id)" style="font-size: 16px">
            内容：{{item.commentInfo.text}}
          </div>
          <span v-if="item.commentInfo.imageNames" class="comImgs">
                    <viewer :images="doImgs(item.commentInfo.imageNames)" ref="viewer" style="line-height: 0px" >
                        <div v-for="(i,k) in item.commentInfo.imageNames.split(',')" :key="k">
                            <span class="aaa">
<!--                                【附图】-->
                              <img  style="opacity:1;width:300px;height:300px;object-fit: contain" :src="imgOrigin+i+'?x-oss-process=image/resize,h_300/quality,q_75'" :data-source="imgOrigin+i" >
                            </span>
                        </div>
                    </viewer>
            <!-- <a v-for="(i,k) in item.imageNames.split(',')" :key="k" :href="imgOrigin+i" target="_blank">【附图】</a> -->
          </span>

          <span v-if="item.commentInfo.audio">
            <audio
            webkit-playsinline="true"
            x-webkit-airplay="true"
            playsinline="true"
            x5-video-player-type="h5"
            x5-video-orientation="h5"
            x5-video-player-fullscreen="true"
            controls
            :src="imgOrigin+item.commentInfo.audio"
            alt="">
            </audio>
          </span>
          <div @click="toComment(item.postInfo.postId, item.commentInfo.id)" style="font-size: 16px">
            原帖标题: {{item.postInfo.title}}
          </div>
          <div @click="toComment(item.postInfo.postId, item.commentInfo.id)" style="font-size: 16px">
            用户：{{item.commentInfo.userInfo.userName}}
          </div>
          <div @click="toComment(item.postInfo.postId, item.commentInfo.id)" style="font-size: 16px">
            举报原因：{{item.reason}}
          </div>
          <div>
            <el-button @click="dealReport(item.id, 'ignore')">忽略</el-button>
            <el-button @click="dealReport(item.id, 'delete')">删除</el-button>
            <el-button @click="dealReport(item.id, 'publish_sex')">色情+删除</el-button>
            <el-button @click="dealReport(item.id, 'punish_politic')">政治+删除</el-button>
            <el-button @click="dealReport(item.id, 'malicious')">恶意举报</el-button>
          </div>
        </div>

        <div style="border-bottom: 1px solid #f1f1f1;" v-if="item.type === 'user'" >
          <div @click="toUser(item.userInfo)" style="font-size: 20px; font-weight: bold">
            用户 {{item.userInfo.userName}}
          </div>
          <div @click="toUser(item.userInfo)" style="font-size: 16px">
            用户描述&头像：{{item.userInfo.desc}}
          </div>
          <span v-if="item.userInfo.icon" class="comImgs">
                    <viewer :images="doImgs(item.userInfo.icon)" ref="viewer" style="line-height: 0px" >
                        <div v-for="(i,k) in item.userInfo.icon.split(',')" :key="k">
                            <span class="aaa">
<!--                                【附图】-->
                              <img  style="opacity:1;width:300px;height:300px;object-fit: contain" :src="imgOrigin+i+'?x-oss-process=image/resize,h_300/quality,q_75'" :data-source="imgOrigin+i" >
                            </span>
                        </div>
                    </viewer>
            <!-- <a v-for="(i,k) in item.imageNames.split(',')" :key="k" :href="imgOrigin+i" target="_blank">【附图】</a> -->
                </span>
          <div @click="toUser(item.userInfo)" style="font-size: 16px">
            举报原因：{{item.reason}}
          </div>
          <div>
            <el-button @click="dealReport(item.id, 'ignore')">不处理</el-button>
            <el-button @click="dealReport(item.id, 'clear_user_name')">清空用户名</el-button>
            <el-button @click="dealReport(item.id, 'clear_user_desc')">清空描述</el-button>
            <el-button @click="dealReport(item.id, 'clear_user_icon')">清空头像</el-button>
            <el-button @click="dealReport(item.id, 'clear_user_thing')">清空所有</el-button>
          </div>
        </div>
      </div>


    </div>
    <div v-else>
      暂无举报
    </div>
  </div>



</template>

<script>
import * as api from '@/api/api'

import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'

export default {
  name: "report",

  data() {
    return {
      lists: [],
    }
  },

  mounted(){
    this.init()
  },

  methods: {
    init() {
      // api.getByPath('/api/v0/report/list', {desc: false}).then(res=>{
      //   this.lists = res.data
      // })

      api.getByPath('/api/v0/report/list', {desc: true}).then(res=>{
        this.lists = res.data
      })
    },
    doCommentType(item) {
      var t = item.type;
      switch (t) {
        case "media":
          return "有图";
          break;
        case "audio":
          return "音频";
          break;
        default:
          return ""
      }

    },
    doImgs(item) {
      var a = item.split(',');
      a.forEach(it => {
        it = this.imgOrigin + it;
      })
      this.is = a;
    },
    doType(item) {
      var t = item.type;
      switch (t) {
        case "link":
          return "链接";
          break;
        case "gif":
          return "GIF";
          break;
        case "image":
          return "图片";
          break;
        case "inner_video":
          return "视频";
          break;
        case "article":
          return "文章";
          break;
        case "vote":
          return "投票";
          break;
        case "prediction":
          return "竞猜";
          break;
        case "forward":
          return "转发";
          break;
        case "audio":
          return "语音";
          break;
        default:
          return "其他";
      }
    },
    toPost(id) {
      try {
        window.flutter_inappwebview.callHandler('toAppPost', {postId: id.toString()});
      } catch (e) {
        window.open('/p/' + id.toString(), "_blank");
      }
    },

    toComment(pid, cid) {
      try {
        window.flutter_inappwebview.callHandler('toAppPost', {postId: pid.toString()});
      } catch (e) {
        window.open('/p/' + pid.toString() + '?commentId=' + cid.toString(), "_blank");
      }
    },

    dealReport(id, action) {


      if (action === 'delete') {
        this.$confirm(`是否确定删除内容？`, "提示", {
          type: "warning",
        }).then(() => {
          api.getByPath('/api/v0/report/solve', {'id': id, 'action': action}).then(res => {
            this.init();
          })
        })
      } else if (action === 'malicious') {
        this.$confirm(`是否判定为恶意举报？`, "提示", {
          type: "warning",
        }).then(() => {
          api.getByPath('/api/v0/report/solve', {'id': id, 'action': action}).then(res => {
            this.init();
          })
        })
      } else if (action === 'publish_sex') {
        this.$confirm(`是否执行色情处罚(封禁3天)并删除内容？`, "提示", {
          type: "warning",
        }).then(() => {
          api.getByPath('/api/v0/report/solve', {'id': id, 'action': action}).then(res => {
            this.init();
          })
        })

      } else if (action === 'punish_politic') {
        this.$confirm(`是否执行政治处罚（永久封禁）并删除内容？`, "提示", {
          type: "warning",
        }).then(() => {
          api.getByPath('/api/v0/report/solve', {'id': id, 'action': action}).then(res => {
            this.init();
          })
        })
      } else if (action === 'clear_user_thing') {
        this.$confirm(`是否清除用户所有信息？`, "提示", {
          type: "warning",
        }).then(() => {
          api.getByPath('/api/v0/report/solve', {'id': id, 'action': action}).then(res => {
            this.init();
          })
        })
      } else if (action === 'clear_user_name') {
        this.$confirm(`是否清除用户名？`, "提示", {
          type: "warning",
        }).then(() => {
          api.getByPath('/api/v0/report/solve', {'id': id, 'action': action}).then(res => {
            this.init();
          })
        })
      } else if (action === 'clear_user_icon') {

        this.$confirm(`是否清除用户头像？`, "提示", {
          type: "warning",
        }).then(() => {
          api.getByPath('/api/v0/report/solve', {'id': id, 'action': action}).then(res => {
            this.init();
          })
        })
      } else if (action === 'clear_user_desc') {
        this.$confirm(`是否清除用户签名？`, "提示", {
          type: "warning",
        }).then(() => {
          api.getByPath('/api/v0/report/solve', {'id': id, 'action': action}).then(res => {
            this.init();
          })
        })
      } else {
        api.getByPath('/api/v0/report/solve', {'id': id, 'action': action}).then(res => {
          this.init();
        })
      }
    }
  }
}


</script>

<style scoped>

</style>

<style lang="scss">
.el-message-box{
  width: 90vw;
  max-width: 400px;
}
.subims{
  position: absolute;
  left: 0;
  top: 20px;
  a {
    + a {
      margin-left: 6px;
    }
  }
}

.aaa {

  position: relative;
  //width: 50px;
  //height: 30px;
  // background: #ddd;
  display: inline-block;
  //overflow: hidden;
  color: #1890ff;
  padding-right: 4px;
  padding-top: 2px;

  &:hover {
    color: red;

    .futu {
      opacity: 1;
      width: 300px;
      height: auto;
      left: 60px;
      top: 0;
    }
  }

  img {
    //position: absolute;
    width: initial;
    height: initial;
    right: 10px;
    top: 0;
    bottom: 0;
    left: 10px;
    opacity: 0;
    z-index: 10;
  }
}
.comImgs {
  padding-bottom: 10px !important;

  img {
    width: 100px;
    height: 100px;
    border-radius: 4px;
    margin-right: 6px;
  }

  div {
    display: inline-block;
  }
}

</style>
