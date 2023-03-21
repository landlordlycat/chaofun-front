<template>
  <div>

  </div>
</template>

<script>
import * as api from "../../api/api";
import {tuxunJump} from "./common";

export default {
  name: "join",
  data() {
    return {
      joinCode: null
    }
  },
  mounted() {
    if (this.$route.query.code) {
      api.getByPath('/api/v0/tuxun/party/join', {joinCode: this.$route.query.code}).then(res=>{
        if (res.success) {
          tuxunJump('/tuxun/party')
        } else if (res.errorCode === 'need_login') {
          this.doLoginStatus().then((res) => {
          });
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
