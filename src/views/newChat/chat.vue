<template>
  <div style="background: #FFF;padding: 20px;min-width: 650px;min-height: 650px;">

    <div
      style="width: 800px;height: 800px;margin: 0 auto;box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3); border-radius:5px;overflow: hidden;resize: both;
      min-width: 600px;min-height: 600px;
      max-width: calc(100vw - 50px);max-height: calc(100vh - 50px)">

      <!--  left 聊天列表、操作  -->
      <div class="selectDisable" style="float: left;width: 250px;height: 100%;background: #EFEFEF;">

        <!--  聊天列表  -->
        <div class="scrollbar_4_1" style="height: calc(100% - 40px);overflow-x: hidden;overflow-y:scroll;">

          <div v-for="channel in chatHistoryMap.values()" :key="channel.id"
               :style="{ background: channel.id === currentChannelId ? '#C6C6C6' : '' }" class="chatListItem"
               style="height: 60px;margin: 5px; padding: 10px 5px;border-radius:4px;cursor:default;"
               @click="switchChannel(channel.id)">

            <!-- 头像 -->
            <img :src="imgOrigin+channel.avatar + '?x-oss-process=image/resize,w_40,h_40/format,webp/quality,q_75'"
                 alt="" style="float: left;width: 40px;height: 40px;border-radius: 100%;" />

            <!-- 信息 -->
            <div style="position: relative;float:left;width: 180px; margin-left:5px;height: 100%;">

              <!-- 最后发言时间 -->
              <span style="position: absolute; right: 0;font-size: 12px;line-height:20px;color: #999;">{{
                  calcMessageTime(channel.lastMessageTime)
                }}</span>

              <!-- 昵称 -->
              <div style="height: 26px;font-size: 16px;line-height:20px;font-weight: bold;white-space: nowrap;">
                {{ channel.name }}
              </div>

              <!-- 最后发言内容 -->
              <div
                style="height: 14px; font-size: 14px;line-height:14px;color: #777;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                {{
                  calcLastMessageContent(channel.type, channel.lastMessageType, channel.lastMessageContent, channel.lastMessageSender)
                }}
              </div>

            </div>

          </div>

          <!--  无可用channel时  -->
          <div v-if="chatHistoryMap.size===0"
               style="text-align: center;color: #999;margin-top: 20px;">
            暂无聊天，请先加入
          </div>
        </div>

        <!-- 操作  -->
        <div class="selectDisable" style="height: 40px;background: #e9e9e9;">
          <i class="el-icon-setting" style="line-height:40px;font-size: 20px;margin-left: 15px;cursor: pointer;"
             @click="onClickSetting"></i>
        </div>

      </div>

      <!--  right 当前聊天  -->
      <div style="float: left;width: calc(100% - 250px);height: 100%;">

        <!--  聊天对象  -->
        <div
          class="selectDisable"
          style="height: 50px;background: #F5F5F5;border-width: 0 0 1px 0;border-style: solid;border-color: #e0e0e0;text-align: center;padding-top: 4px;">
          <span v-if="chatHistoryMap.get(currentChannelId)"
                style="cursor: pointer;"
                @click.stop="toForumOrUser(chatHistoryMap.get(currentChannelId))">
            <img
              :src="imgOrigin+chatHistoryMap.get(currentChannelId).avatar + '?x-oss-process=image/resize,w_40,h_40/format,webp/quality,q_75'"
              alt="" style="width: 40px;height: 40px;border-radius: 100%;vertical-align: middle;">
            <span
              style="font-size: 20px;font-weight: bold;margin-left: 5px;vertical-align: middle;">{{ chatHistoryMap.get(currentChannelId).name
              }}</span>
          </span>
        </div>

        <!--  聊天记录  -->
        <div style="height: calc(100% - 200px);background: #f6f6f6;">
          <div v-if="chatHistoryMap.get(currentChannelId)" ref="chatMessageDiv"
               class="scrollbar_4_2"
               style="height: 100%;overflow-x: hidden;overflow-y:scroll;scroll-behavior: smooth;padding: 5px 5px 67px 5px;">
            <div v-for="(chatMessage,index) in chatHistoryMap.get(currentChannelId).chatMessagesArr" :key="index"
                 style="margin-bottom: 10px;">

              <!--  他人  -->
              <div v-if="$store.state.user.userInfo.userId !== chatMessage.sender.userId">

                <!--  头像、昵称、时间  -->
                <div style="height:28px;">
                  <img
                    :src="imgOrigin+chatMessage.sender.icon + '?x-oss-process=image/resize,w_24,h_24/format,webp/quality,q_75'"
                    alt="" style="width: 24px;height: 24px;border-radius: 100%;vertical-align: middle;" />
                  <span v-if="'group'===chatHistoryMap.get(currentChannelId).type"
                        style="color: #999;margin-left: 5px;vertical-align: middle;">{{
                      chatMessage.sender.userName
                    }}</span>
                  <span style="color: #aaa;margin-left: 5px;vertical-align: middle;">{{
                      calcMessageTime(chatMessage.time)
                    }}</span>
                </div>

                <!--  图片/文字  -->
                <div
                  style="background: #e5e5e5;border-radius: 4px; padding: 7px 10px;margin-left: 20px;margin-right: 100px;display: inline-block;word-wrap: break-word;word-break: break-all;position: relative;">

                  <!--  聊天框角  -->
                  <div class="triangle_left" style="position: absolute;left: 5px;top:-8px;" />

                  <viewer v-if="'image'===chatMessage.type" :images="[imgOrigin+chatMessage.content]">
                    <img :data-source="imgOrigin +chatMessage.content"
                         :src="imgOrigin+chatMessage.content+ '?x-oss-process=image/resize,w_190/format,webp/quality,q_75'"
                         alt=""
                         style="vertical-align: middle;max-height: 200px;" />
                  </viewer>
                  <pre v-else style="white-space: pre-wrap;word-wrap: break-word;font-size: 14px;">{{
                      chatMessage.content
                    }}</pre>
                </div>
              </div>

              <!--  自己  -->
              <div v-else style="text-align: right;">

                <!--  头像、昵称、时间  -->
                <div style="height:28px;">
                   <span style="color: #aaa;margin-right:5px;vertical-align: middle;">{{
                       calcMessageTime(chatMessage.time)
                     }}</span>
                  <img
                    :src="imgOrigin+chatMessage.sender.icon + '?x-oss-process=image/resize,w_24,h_24/format,webp/quality,q_75'"
                    alt="" style="width: 24px;height: 24px;border-radius: 100%;vertical-align: middle;" />
                </div>
                <!--  图片/文字  -->
                <div
                  style="background: #12b7f5;border-radius: 4px; padding: 7px 10px;margin-right: 20px;margin-left: 100px;display:inline-block;word-wrap: break-word;word-break: break-all;position: relative;">

                  <!--  聊天框角  -->
                  <div class="triangle_right" style="position: absolute;right: 5px;top:-8px;" />

                  <viewer v-if="'image'===chatMessage.type" :images="[imgOrigin+chatMessage.content]">
                    <img :data-source="imgOrigin +chatMessage.content"
                         :src="imgOrigin+chatMessage.content+ '?x-oss-process=image/resize,w_190/format,webp/quality,q_75'"
                         alt=""
                         style="vertical-align: middle;max-height: 200px;" />
                  </viewer>
                  <pre v-else
                       style="white-space: pre-wrap;word-wrap: break-word;font-size: 14px;color: #fff;text-align: left;">{{
                      chatMessage.content
                    }}</pre>
                </div>

              </div>

            </div>
          </div>
        </div>

        <!--  输入框  -->
        <div class="selectDisable" style="height: 150px;position: relative;">

          <!--  发送图片  -->
          <div style="height: 30px; display: flex">
            <emoji-select ref="emojiSelect" :callback="emojiSelectCallback">
              <div class="button-bar" style="height: 26px;margin: 2px 8px;padding: 3px;">
                发送表情</div>
<!--              <img-->
<!--                :src="imgOrigin+'biz/bf4754f99db4f735f42f3dd29e7cafd1.png?x-oss-process=image/resize,h_40/format,webp/quality,q_75'"-->
<!--                alt="" class="button-bar" style="width: 26px;height: 26px;margin: 2px 5px;padding: 3px;">-->
            </emoji-select>
            <el-upload
              ref="imageUpload"
              :before-upload="beforeImageUpload"
              :data="fileData"
              :disabled="imagesUploading"
              :limit="imagesLimit"
              :on-exceed="handleImageUploadExceed"
              :on-success="handleImageUploadSuccess"
              :show-file-list="false"
              accept="image/*"
              action="/api/upload_image"
              multiple
              name="file"
              style="display: inline-block;height: 100%;"
            >
            <div class="button-bar" style="height: 26px;margin: 2px 8px;padding: 3px;">
              发送图片
            </div>
            </el-upload>
          </div>

          <!--  文字输入框  -->
          <div v-loading="imagesUploading" style="width: 100%;height: 115px;">
            <el-input ref="textInputMark" v-model="inputText" placeholder="请输入内容" resize="none"
                      rows="4" style="width: 100%;height: 115px;border: 0;" type="textarea"></el-input>
          </div>

          <!--  发送按钮  -->
          <div style="position: absolute;width: 65px;height: 35px;bottom: 0;right: 0;" title="Shift+Enter：换行
            Enter：发送">
            <el-button @click.stop="onClickSendButton">发送</el-button>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script lang="js">
import { getJoinedChatList } from "@/api/api";
import { Message } from "element-ui";
import emojiSelect from "@/views/newChat/emojiSelect.vue";

export default {
  name: "chat",
  data() {
    return {
      chatHistoryMap: new Map(),
      currentChannelId: 0,
      inputText: "",

      url: `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/v0/all`,
      ws: null,

      fileData: {},
      imagesNum: 0,
      imagesLimit: 9,
      imagesUploading: false
      // images: [],
    };
  },
  components: { emojiSelect },
  created() {

    document.title = "炒饭 - 聊天";

    Date.prototype.format = function(fmt) {
      const o = {
        "M+": this.getMonth() + 1,                 //月
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds()                 //秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (const k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    };

    // 判断登录状态
    if (!this.$store.state.user.islogin) {
      this.handleNeedLogin();
      return;
    }

    //
    getJoinedChatList().then(({ data, success }) => {

      if (success) {

        // 新建的聊天
        let newSingleChatChannelStr = localStorage.getItem("chao.fun.chat.newSingleChatChannel");
        let newSingleChatChannel = JSON.parse(newSingleChatChannelStr);

        if (newSingleChatChannel && newSingleChatChannel.id && !this.chatHistoryMap.has(newSingleChatChannel.id)) {
          // 添加到第一个
          newSingleChatChannel.chatMessagesArr = [];
          this.chatHistoryMap.set(newSingleChatChannel.id, newSingleChatChannel);
        }

        if (data) {
          for (let i = 0; i < data.length; ++i) {
            let item = data[i];
            // 聊天记录
            item.chatMessagesArr = [];
            // 头像有为空的情形，做特殊处理
            if (!item.avatar) {
              item.avatar = "biz/08a2d3a676f4f520cb99910496e48b4e.png";
            }
            this.chatHistoryMap.set(item.id, item);
          }

        }

        // currentChannel
        if (this.$route.query && this.$route.query.id && this.$route.query.id.toString() && this.chatHistoryMap.has(parseInt(this.$route.query.id.toString()))) {
          this.currentChannelId = parseInt(this.$route.query.id.toString());
        } else if (data) {
          this.currentChannelId = data[0].id;
        }

        // title
        this.modifyDocumentTitle();

        //
        this.wsInit();

      } else {
        this.showMessageError();
      }

    }).catch(() => {
      this.showMessageError();
    });

  },
  mounted() {
    // 添加监听事件
    addEventListener("keydown", this.keyDown);
    addEventListener("paste", this.toPaste);

    // 输入框获取焦点
    this.$refs.textInputMark.focus();
  },
  destroyed() {
    // 移除监听事件
    removeEventListener("keydown", this.keyDown);
    removeEventListener("paste", this.toPaste);

    // 关闭ws连接
    this.ws.close();
  },
  methods: {

    //
    emojiSelectCallback(emoji) {
      this.inputText += emoji;
    },
    //
    toForumOrUser(item) {
      if (!item.userId1 || !item.userId2) {
        return;
      }
      if (this.$store.state.user.userInfo.userId != item.userId1.userId) {
        this.toUser(item.userId1.userId);
      } else if (this.$store.state.user.userInfo.userId != item.userId2.userId) {
        this.toUser(item.userId2.userId);
      }
    },

    //
    toUser(userid) {
      window.open(location.origin + "/user/" + userid, "_blank");
    },

    // 上传图片处理
    handleImageUploadSuccess(res, file) {
      if (res.success) {
        this.imageUrl = URL.createObjectURL(file.raw);
        // this.images.push(res.data);

        // 发送图片
        this.onSendImage(res.data);

      } else if (res.errorCode == "invalid_content") {
        // this.imageUrl = ''
        this.$toast(res.errorMessage);
      }
      this.imagesNum--;
      if (!this.imagesNum) {
        this.imagesUploading = false;
        this.$refs.imageUpload.clearFiles();
      }
    },
    beforeImageUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 20MB!");
        return false;
      }
      this.imagesNum++;
      this.imagesUploading = true;
      this.fileData.fileName = file.name;
      return true;
    },
    handleImageUploadExceed(files, fileList) {
      this.$message.warning({
        message: `当前限制选择 ${this.imagesLimit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`,
        duration: 2500
      });
    },

    // 粘贴图片
    toPaste(e) {
      const cbd = e.clipboardData;
      const ua = window.navigator.userAgent;
      // console.log(this.$refs.imageUpload)
      if (!(e.clipboardData && e.clipboardData.items)) {
        return;
      }
      if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" && cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" && ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
        return;
      }
      const item = cbd.items[cbd.items.length - 1];
      if (item.kind == "file" && (/^image\/[a-z]*$/.test(item.type))) {
        const blob = item.getAsFile();
        if (blob.size === 0) {
          return;
        }
        this.$refs.imageUpload.$children[0].uploadFiles([blob]);
      }
    },

    // 键盘监听事件
    keyDown(e) {
      // 回车：输入框无焦点时获取焦点，有焦点时发送信息
      if (e.keyCode === 13) {
        if (e.shiftKey || e.ctrlKey || e.altKey) {
          return;
        }
        if (this.$refs.textInputMark) {
          if (this.$refs.textInputMark.focused) {
            // 有焦点
            this.onClickSendButton();
            e.preventDefault();
          } else {
            //无焦点
            this.$refs.textInputMark.focus();
            e.preventDefault();
          }
        }
      }
    },

    // 滚动到底部
    chatMessageDivScrollToEnd() {
      // TODO 滚动效果不好，有bug，偶尔能复现
      setTimeout(() => {
        this.$refs.chatMessageDiv.scrollTop = 9999999;
      }, 300);
    },

    onClickSetting() {
      Message.info("暂未开放");
    },

    // 发送图片
    onSendImage(imageUrl) {
      if (!this.currentChannelId || this.currentChannelId === 0) {
        Message.info("暂无聊天，请先加入");
        return;
      }

      // 直接发送图片，暂不加确认
      this.sendImage(this.currentChannelId, imageUrl);

    },

    // 点击发送按钮
    onClickSendButton() {

      // 关闭表情选择框
      if (this.$refs.emojiSelect) {
        this.$refs.emojiSelect.closePopover();
      }

      if (!this.currentChannelId || this.currentChannelId === 0) {
        Message.info("暂无聊天，请先加入");
        return;
      }

      let text = this.inputText.trim();
      if (!text) {
        return;
      }
      this.sendText(this.currentChannelId, text);
      this.inputText = "";
    },

    // 处理最新消息内容
    calcLastMessageContent(type, lastMessageType, lastMessageContent, lastMessageSender) {
      if (!lastMessageContent) {
        lastMessageContent = "";
      }

      let returnStr = "";
      if ("group" === type && lastMessageSender) {
        returnStr = lastMessageSender.userName + ":";
      }

      if ("image" === lastMessageType) {
        returnStr += "[图片]";
      } else if ("text" === lastMessageType) {
        returnStr += lastMessageContent.replaceAll(" ", "").replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n\n", "\n").replaceAll("\n", " ").trim();
      } else {
        returnStr += "";
      }

      // if (returnStr.length > 11) {
      //   returnStr = returnStr.substring(0, 11) + "...";
      // }

      return returnStr;
    },

    // 处理最新消息时间
    calcMessageTime(lastMessageTime) {
      if (!lastMessageTime) {
        return "";
      }

      const date = new Date(lastMessageTime);
      const dateNow = new Date();

      if (date.getMonth() === dateNow.getMonth() && date.getDay() === dateNow.getDay()) {
        return date.format("hh:mm");
      } else {
        return date.format("MM-dd hh:mm");
      }

    },

    // 切换
    switchChannel(id) {
      this.currentChannelId = id;

      // 滚动到最新消息
      this.chatMessageDivScrollToEnd();

      //
      this.modifyDocumentTitle();
    },

    modifyDocumentTitle() {
      setTimeout(() => {
        if (this.currentChannelId && this.chatHistoryMap.get(this.currentChannelId)) {
          document.title = "炒饭 - 聊天 - " + this.chatHistoryMap.get(this.currentChannelId).name;
        }
      }, 1);
    },

    // 弹出错误提示
    showMessageError() {
      Message.error("未知错误！");
    },

    // 发送心跳
    sendHeartBeat() {
      this.wsSend(`{"scope": "heart_beat"}`);
    },

    // 发送文字
    sendText(channelId, text) {
      this.wsSend("{\"scope\": \"chat\", \"data\": {\"type\": \"text\", \"channelId\": " + channelId + ", \"content\": \"" + text + "\"}}");
    },

    // 发送图片
    sendImage(channelId, imageUrl) {
      this.wsSend("{\"scope\": \"chat\", \"data\": {\"type\": \"image\", \"channelId\": " + channelId + ", \"content\": \"" + imageUrl + "\"}}");
    },

    // 发送：加载聊天记录
    sendLoadChatHistory(channelId) {
      this.wsSend("{\"scope\": \"chat\", \"data\": {\"type\": \"load\", \"channelId\":" + channelId + "}}");
    },

    // 发送权限验证信息
    // 需权限验证直接跳转登录页面，应该不需要该方法
    //     sendAuth() {
    // TODO
    // let cookie = null;
    // wsSend("{\"scope\": \"auth\", \"data\": \"" + cookie + "\"}")
    // },

    // 发送数据
    wsSend(data) {
      console.log("wsSend: " + data);
      this.ws.send(data);
    },

    // 接收数据
    handleReceiveMessage: function(data) {
      if ("chat" !== data.scope) {
        return;
      }

      const dataType = data.data.type.toString();
      if ("load_result" === dataType) {
        const { channelId, chatMessages } = data.data.data;
        this.handleLoadResult(channelId, chatMessages);
      } else if ("message" === dataType) {
        this.handleNewMessage(data.data.data);
      } else if ("need_login" === dataType) {
        this.handleNeedLogin();
      } else {
        this.showMessageError();
      }

    },

    // 需登录
    handleNeedLogin() {
      this.$login({
        callBack: () => {
          this.$store.dispatch("user/getInfo");
        }
      });
    },

    // 处理接收的新消息
    handleNewMessage(chatMessage) {
      let channelData = this.chatHistoryMap.get(chatMessage.channelId);
      if (!channelData) {
        this.showMessageError();
        return;
      }

      // 将新消息添加到聊天记录列表
      channelData.chatMessagesArr.push(chatMessage);

      // 更新lastMessage
      channelData.lastMessageContent = chatMessage.content;
      channelData.lastMessageTime = chatMessage.time;
      channelData.lastMessageType = chatMessage.type;
      channelData.lastMessageSender = chatMessage.sender;

      // 强制渲染
      this.viewForceUpdate();

      // 滚动到最新消息
      if (this.currentChannelId === chatMessage.channelId) {
        this.chatMessageDivScrollToEnd();
      }
    },

    // 处理接受的历史聊天记录
    handleLoadResult(channelId, chatMessages) {
      // 保存聊天记录到 chatHistoryMap[channelId].chatMessagesArr
      this.chatHistoryMap.get(channelId).chatMessagesArr.push(...chatMessages.reverse());

      //
      if (this.currentChannelId === channelId) {
        // 强制渲染
        this.viewForceUpdate();

        // 滚动到最新消息
        this.chatMessageDivScrollToEnd();
      }
    },

    // 强制页面渲染
    viewForceUpdate() {
      console.log("viewForceUpdate...");
      this.$forceUpdate();
    },

    //
    wsOnMessage(e) {
      console.log("wsOnMessage");
      // console.log(e);
      const data = JSON.parse(e.data);
      // console.log(data);
      this.handleReceiveMessage(data);
    },

    wsOnOpen(e) {
      console.log("wsOnOpen");
      // console.log(e);

      // 每3秒发送一次心跳
      setInterval(() => {
        this.sendHeartBeat();
      }, 3000);

      // 加载聊天记录
      for (const channelId of this.chatHistoryMap.keys()) {
        this.sendLoadChatHistory(channelId);
      }

    },

    wsOnError(e) {
      console.log("wsOnError");
      // console.log(e);

      // TODO
      // wsInit();
    },

    wsOnClose(e) {
      console.log("wsOnClose");
    },

    // 初始化
    wsInit() {
      console.log("wsInit");

      if (this.ws) {
        this.ws.close();
      }
      this.ws = new WebSocket(this.url);
      this.ws.onopen = this.wsOnOpen;
      this.ws.onmessage = this.wsOnMessage;
      this.ws.onerror = this.wsOnError;
      this.ws.onclose = this.wsOnClose;
    }

  }
};
</script>

<style lang="scss" scoped>

.selectDisable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.scrollbar_4_1 {

  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    width: 4px;
    background: #e0e0e0;
  }
}

.scrollbar_4_2 {

  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    width: 4px;
    background: #999;
  }
}

::v-deep .el-textarea__inner {
  border: none;
  font-size: 16px;
  padding-left: 10px;
  padding-right: 10px;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    width: 4px;
    background: #999;
  }
}

::v-deep .el-button {
  border: none;
  background: #eee;
  height: 30px;
  padding: 10px 15px;
  margin: 0;

  span {
    position: relative;
    top: -2px;
  }
}

.chatListItem {
  &:hover {
    background: #e1e1e1;
  }
}

.triangle_left {
  width: 0;
  height: 0;
  line-height: 0;
  font-size: 0;
  border: 5px solid transparent;
  border-left-color: #e5e5e5;
  border-bottom-color: #e5e5e5;
}

.triangle_right {
  width: 0;
  height: 0;
  line-height: 0;
  font-size: 0;
  border: 5px solid transparent;
  border-right-color: #12b7f5;
  border-bottom-color: #12b7f5;
}

.button-bar {
  background: #fff;
  cursor: pointer;

  &:hover {
    border-radius: 5px;
    background-color: #f1f1f1;
  }
}
</style>
