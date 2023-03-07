<template>
  <div>
    <div v-for="(item,index) in manageForumsList" :key="index"
         class="item">

      <span style="margin: auto 0; cursor: pointer;" @click="toForum(item.id)">
        <img :src="imgOrigin + item.imageName+ '?x-oss-process=image/resize,h_40/quality,q_75'" alt=""
             style="width: 40px;height: 40px;border-radius: 100%;" />
      </span>

      <span style="margin: auto 5px;cursor: pointer;" @click="toForum(item.id)">
        <span style="font-size: 16px;display: block;"> {{ item.name }} </span>
        <span style="font-size: 12px;color: #999;display: block;">帖子数量： {{ item.posts }}</span>
      </span>

      <div style="flex: 1;text-align: right;">
        <el-popconfirm :title="`是否确定辞任【${item.name}】版主？`" @onConfirm="resign(item)">
          <el-button slot="reference" type="warning">辞任</el-button>
        </el-popconfirm>
      </div>

    </div>

    <div v-if="manageForumsList.length===0" style="color: #999;text-align: center;">暂未担任版主~</div>

  </div>
</template>

<script>

import * as api from "@/api/api";
import { listManageForums } from "@/api/api";

export default {
  name: "listManageForums",
  data() {
    return {
      manageForumsList: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    toForum(forumId) {
      window.open("/f/" + forumId, "_blank");
    },

    getList() {
      listManageForums().then(res => {
        if (res.success) {
          this.manageForumsList = res.data;
        }
      });
    },

    resign(item) {
      api.forumRemoveMod({ forumId: item.id, userId: this.$store.state.user.userInfo.userId }).then(() => {
        this.getList();
      });
    }

  }
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;

  &:hover {
    background: #f9f9f9;
  }
}

::v-deep.el-button--medium {
  padding: 6px 10px;
}
</style>
