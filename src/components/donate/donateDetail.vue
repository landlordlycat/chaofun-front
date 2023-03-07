<template>
  <div style="margin: 5px 10px;text-align: center;">

    <div style="position: relative;float: right; right: 10px;top: 0px;width: 100px;">
      <el-button style="display: block;float: right;" type="warning" @click="donateDialogVisible=true;">我要捐赠</el-button>
      <el-button style="display: block;float: right;margin-top: 5px;" type="primary" @click="historyDialogVisible=true;">流水记录
      </el-button>
    </div>

    <div style="margin: 0 auto;padding-top: 5px; display: flex;justify-content: center;">
      <div style="margin-right: 2px;">
        <img
          :src="imgOrigin + 'biz/a7a11ce394ec3bad0f25f4aead7855ec.png'"
          alt="" style="width: 50px;height: 50px;border-radius: 100%;" />
      </div>
      <div class="box" style="display: flex;flex-direction: column;">
        <div class="front" style="min-width: 42px;">
          <div style="color: #e85827;font-size: 24px;">{{ remainFbi }}</div>
          <div style="color: #999;font-size: 12px;">剩余FBi</div>
        </div>
        <div class="back_info" style="min-width: 42px;">
          <div style="color: #ffba00;font-size: 24px;">{{ totalFbi }}</div>
          <div style="color: #999;font-size: 12px;">总捐赠</div>
        </div>
      </div>
    </div>

    <div class="selectDisable" style="margin: 15px 0 20px 0;">

      <el-table :data="donateFbiList" :highlight-current-row="true" :row-class-name="tableRowClassName"
                style="width: 100%;max-width: 600px;margin: 0 auto;">

        <!-- rank -->
        <el-table-column align="center" label="排名" width="100">
          <template slot-scope="item">
            <span v-if="item.row.rankImg">
             <img
               :src="item.row.rankImg"
               alt="" style="width: 40px;height: 40px;" />
            </span>
            <span v-else> {{ item.row.rank }}</span>
          </template>
        </el-table-column>


        <!-- userInfo -->
        <el-table-column align="left" header-align="left" label="用户">
          <template slot-scope="item">
            <span style="cursor: pointer;" @click="toUser(item.row.userInfo.userId)">
               <span v-if="item.row.rankImg" style="display: flex;">
                  <img
                    :src="imgOrigin + item.row.userInfo.icon+ '?x-oss-process=image/resize,h_40/quality,q_75'"
                    alt="" style="width: 40px;height: 40px;border-radius: 100%;" />
                  <span
                    style="margin:auto 0 auto 10px;font-weight: bold;">{{ item.row.userInfo.userName }}</span>
               </span>
               <span v-else style="display: flex;">
                  <img
                    :src="imgOrigin + item.row.userInfo.icon+ '?x-oss-process=image/resize,h_24/quality,q_75'"
                    alt="" style="width: 24px;height: 24px;border-radius: 100%;" />
                  <span
                    style="margin:auto 0 auto 10px;">{{ item.row.userInfo.userName }}</span>
               </span>
            </span>
          </template>
        </el-table-column>

        <!-- totalDonate -->
        <el-table-column align="right" header-align="right" label="FBi" prop="totalDonate"
                         width="80"></el-table-column>

        <!-- empty -->
        <div slot="empty" style="cursor: pointer;" @click="donateDialogVisible=true">点我！当榜一大哥！</div>

      </el-table>
    </div>


    <!-- 流水记录 -->
    <el-dialog v-if="historyDialogVisible" :append-to-body="true"
               :visible.sync="historyDialogVisible" custom-class="el-dialog-history" title="流水记录"
    >
      <donate-history :forum-id="forumId"></donate-history>
    </el-dialog>

    <!-- 捐赠 -->
    <el-dialog v-if="donateDialogVisible" :append-to-body="true" :visible.sync="donateDialogVisible"
               custom-class="el-dialog-donate"
               title="捐赠">
      <div style="text-align: center;">
        <div style="font-weight: bold;width: 100%;">金额</div>
        <div style="">
          <el-input-number v-model="fbi" :min=5 :step=5 />
        </div>
        <div style="margin-top: 20px;">
          <div style="font-weight: bold;width: 100%;">赠言(违规会封号)</div>
          <el-input v-model="reason" autocomplete="off" style="width: 200px;"></el-input>
        </div>

        <div style="margin-top: 20px">
          <el-button type="primary" @click="donateFbi">捐赠</el-button>

          <!--  助力卷王！  -->
          <el-button style="position: absolute;right: 5px;" @click="isShowDonateAssist=!isShowDonateAssist">小助手
          </el-button>
        </div>

        <div v-if="isShowDonateAssist">
          <hr style="margin-top: 20px;background-color:#ccc;height:1px;border:none;">

          <div style="margin-top: 20px;text-align: center;">

            <div style="font-weight: lighter;width: 100%;">我的捐赠</div>
            <table style="margin: 5px auto 0 auto;text-align: right;">
              <tr>
                <td>已捐赠：</td>
                <td>{{ myDonate ? myDonate.totalDonate : 0 }}</td>
              </tr>
              <tr>
                <td>当前排名：</td>
                <td style="text-align: center;">{{ myDonate ? myDonate.rank : "无" }}</td>
              </tr>
            </table>

            <div style="margin-top: 20px;font-weight: lighter;width: 100%;">捐赠预估</div>
            <table style="margin: 5px auto 0 auto;text-align: right;">
              <tr>
                <td>捐赠后总额：</td>
                <td>{{ (myDonate ? myDonate.totalDonate : 0) + fbi }}</td>
              </tr>
              <tr>
                <td>捐赠后排名：</td>
                <td style="text-align: center;">{{ rankAfterDonate }}</td>
              </tr>
            </table>
          </div>
        </div>

      </div>
    </el-dialog>

  </div>
</template>

<script>

import * as api from "@/api/api";
import donateHistory from "_c/donate/donateHistory";

export default {
  props: {
    forumId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      historyDialogVisible: false,
      donateDialogVisible: false,
      fbi: 100,
      reason: "",

      totalFbi: 0,
      remainFbi: 0,

      donateFbiList: [],

      isShowDonateAssist: false,
      myUserId: null,
      myDonate: null,
      rankAfterDonate: 0
    };
  },
  watch: {
    fbi(newValue) {
      this.assistCalcRank(newValue);
    },
    donateDialogVisible() {
      this.fbi = 100;
      this.reason = "";
      this.assistCalcRank(this.fbi);
    }
  },
  components: { donateHistory },
  created() {
    this.myUserId = this.$store.state.user.userInfo.userId;
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {

      //
      api.getDonateFbi({
        forumId: this.forumId
      }).then(res => {
        if (res && res.success && res.data) {
          this.totalFbi = res.data.totalFbi;
          this.remainFbi = res.data.remainFbi;
        }
      });

      //
      api.getDonateOrder({
        forumId: this.forumId
      }).then(res => {

        // 数据处理
        if (res && res.success && res.data) {

          let currentRank = 0;
          let currentTotalDonate = -1;
          res.data.forEach((row, index) => {

            // 排名
            if (row.totalDonate === currentTotalDonate) {
              row.rank = currentRank;
            } else {
              row.rank = index + 1;
            }
            currentTotalDonate = row.totalDonate;
            currentRank = row.rank;

            // 我的
            if (this.myUserId && row.userInfo.userId == this.myUserId) {
              this.myDonate = row;
            }

            // 图片
            if (row.rank === 1 || row.rank === 2 || row.rank === 3) {
              let image;
              if (row.rank === 1) {
                image = "biz/5bc9173a1a4dd54120e0083893d524c9.png";
              } else if (row.rank === 2) {
                image = "biz/4f7e167e5ee7594626a43fbc93020dbf.png";
              } else {
                image = "biz/32b3f8bba180e2256489ec4ecd9c1dc9.png";
              }
              if (image) {
                row.rankImg = this.imgOrigin + image + "?x-oss-process=image/resize,h_40/quality,q_75";
              }
            }

          });

          this.donateFbiList = res.data;
        }

      });

    },

    assistCalcRank(newValue) {
      if (this.donateFbiList && this.donateFbiList.length) {
        let fbiAfterDonate = (this.myDonate ? this.myDonate.totalDonate : 0) + newValue;

        let rankAfterDonateTemp = 0;
        this.donateFbiList.forEach((row, index) => {
          if (!rankAfterDonateTemp && fbiAfterDonate >= row.totalDonate) {
            rankAfterDonateTemp = row.rank;
          }
        });
        this.rankAfterDonate = rankAfterDonateTemp;
      } else {
        this.rankAfterDonate = 1;
      }
    },

    donateFbi() {

      api.donateFbi(
        {
          forumId: this.forumId,
          fbi: this.fbi,
          reason: this.reason
        }
      ).then(res => {
        this.donateDialogVisible = false;

        if (res && res.success) {
          this.$toast("捐赠成功！");
        }
        this.init();
      });

    },

    toUser(userId) {
      try {
        window.flutter_inappwebview.callHandler("toAppUser", { userId: userId + "" });
      } catch (e) {
        window.open(location.origin + "/user/" + userId, "_blank");
      }
    },

    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2) {
        return "noRankStyle2";
      }
      return "";

      // if (row.rank === 1) {
      //  return "rank1Style";
      // } else if (row.rank === 2) {
      //  return "rank2Style";
      // } else if (row.rank === 3) {
      //  return "rank3Style";
      // } else if (rowIndex % 2) {
      //  return "noRankStyle1";
      // }
      // return "noRankStyle2";
      //
      // if (rowIndex % 2) {
      //  return "noRankStyle";
      // }
      // return "";
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

.box {
  transform-style: preserve-3d;
}

.box .front {
  text-align: center;
  position: absolute;
  transform: perspective(150px) rotateY(0deg);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: all 800ms ease;
}

.box .back_info {
  text-align: center;
  position: absolute;
  transform: rotateY(150deg);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: all 800ms ease;
}

.box:hover .front {
  transform: perspective(150px) rotateY(150deg);
}

.box:hover .back_info {
  transform: perspective(150px) rotateY(0deg);
}

::v-deep .el-button {
  padding: 8px 10px;
}

::v-deep .el-dialog-donate {
  width: 350px !important;
  max-width: 95vw !important;
  border-radius: 5px;

  .el-dialog__header {
    background-color: #f0f0f0;
    padding: 10px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    text-align: center;
  }

  .el-dialog__body {
    padding: 10px 10px 30px 10px;
  }
}

::v-deep .el-dialog-history {
  width: 98vw !important;
  max-width: 640px !important;

  height: 90vh !important;
  margin-top: 5vh !important;

  border-radius: 5px;

  .el-dialog__header {
    background-color: #f0f0f0;
    padding: 10px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    text-align: center;
  }

  .el-dialog__body {
    padding: 5px 2px 10px 10px;
  }


  .el-table__body-wrapper {

    &::-webkit-scrollbar {
      width: 6px !important;
      height: 6px !important;
    }

    &::-webkit-scrollbar-thumb {
      width: 6px !important;
      height: 6px !important;
    }

  }

}

::v-deep .el-table .rank1Style {
  background: #edf1fd;
}

::v-deep .el-table .rank2Style {
  background: #fff;
}

::v-deep .el-table .rank3Style {
  background: #edf1fd;
}

::v-deep .el-table .noRankStyle1 {
  background: #fff;
}

::v-deep .el-table .noRankStyle2 {
  background: #f6f6f6;
}

</style>
