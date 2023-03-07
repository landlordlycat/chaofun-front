<template>
  <div style="margin: 10px 0;padding: 10px 10px;min-height:80vh;background: #fff;border-radius: 5px;">

    <h1>版块规范</h1>
    <ol>
      <li v-for="item in rules">{{ item.rule }}</li>
    </ol>
    <div v-if="rules.length==0" style="margin-top:10px;color: #999;">暂无版块规范</div>

    <hr style="margin: 20px 0;background-color:#ccc;height:1px;border:none;">

    <h1 style="margin-bottom: 5px;">徽章</h1>
    <div v-for="(item,index) in badgeList" :key="index" style="cursor: pointer;margin: 8px 0;">
      <el-popover placement="right" trigger="hover" width="300">
        <badgeDetail :badgeInfo0="item" />
        <div slot="reference" style="display: inline-flex;">
          <img
            :src="imgOrigin + item.icon +  '?x-oss-process=image/resize,h_30/quality,q_75'"
            alt=""
            style="border-radius:100%;height: 30px;width: 30px;" />
          <span style="margin: auto 5px;min-width: 150px;">
          {{ item.name }}
          </span>
        </div>
      </el-popover>
    </div>
    <div v-if="badgeList.length==0" style="margin-top:10px;color: #999;">暂无徽章</div>

  </div>
</template>

<script>
import { getForumRules, listForumBadges } from "@/api/api";
import badgeDetail from "@/views/chaofun-webview/badge/badgeDetail.vue";

export default {
  name: "ForumMore",
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      rules: [],
      badgeList: []
    };
  },
  components: { badgeDetail },
  mounted() {
    this.getForumRules();
    this.getListForumBadges();
  },
  methods: {

    getForumRules() {
      if (this.forumId) {
        getForumRules({ forumId: this.forumId }).then(res => {
          if (res.success) {
            this.rules = res.data;
          }
        });
      }
    },

    getListForumBadges() {
      if (this.forumId) {
        listForumBadges({ forumId: this.forumId }).then(res => {
          if (res.success) {
            this.badgeList = res.data;
          }
        });
      }
    }

  }

};
</script>

<style lang="scss" scoped>

ol {
  padding: 0 20px;

  li {
    list-style: decimal outside;
    font-size: 14px;
    font-weight: 500;
    line-height: 15px;
    margin: 8px 0;
  }

}

</style>
