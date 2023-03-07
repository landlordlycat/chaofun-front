<template>
  <div>
    <div v-for="(item,index) in lists" :key="index" class="item">
      <div style="max-width: 80vw;cursor: pointer;">
        <el-popover placement="right" trigger="hover" width="300">
          <badgeDetail :badgeInfo0="item.badge" />
          <span slot="reference" style="display: flex;">
            <img
              :src="imgOrigin + item.badge.icon +  '?x-oss-process=image/resize,h_24/quality,q_75'"
              alt=""
              style="border-radius:100%;height: 24px;width: 24px;" />
            <span style="margin: auto 5px;min-width: 100px;">
            {{ item.badge.name }}
            </span>
          </span>
        </el-popover>
      </div>

      <div style="display: flex; justify-content: space-between;width: 90px;">
        <el-switch v-model="item.show" class="drawer-switch" @change="switchBadgeShow($event, item)" />
      </div>

    </div>
  </div>
</template>

<script>
import * as api from "@/api/api";
import badgeDetail from "@/views/chaofun-webview/badge/badgeDetail.vue";

export default {
  name: "badgeDetail.vue",
  data() {
    return {
      "lists": [],
      "badgeId": null,
      "badgeInfo": {}
    };
  },
  props: {
    badgeInfo0: {
      type: Object,
      default() {
        return null;
      }
    },
  },
  components: { badgeDetail },
  created() {
    if (this.badgeInfo0) {
      this.badgeInfo = this.badgeInfo0;
    } else {
      this.badgeId = this.$route.query.badgeId;
      this.getBadgeInfo();
    }
  },

  mounted() {

  },

  methods: {
    toDetail(item) {
      window.open("/webview/badge?badgeId=" + item.badge.id, "_blank");
    },
    switchBadgeShow(event, item) {
      api.getByPath("/api/v0/badge/setShow", { badgeId: item.badge.id, show: event }).then(res =>
        this.getBadgeInfo()
      );
    },
    getBadgeInfo() {
      api.getByPath("/api/v0/badge/list?settingPage=true").then(
        res => {
          if (res.success) {
            this.lists = res.data;
          } else {
            this.$toast(res.errorMessage);
          }
        }
      );
    }
  }
};
</script>

<style scoped>

.item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f1f1f1;
  overflow: hidden;
}
</style>
