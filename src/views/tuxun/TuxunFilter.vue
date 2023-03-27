<template>
<div class="container">
  <div class="image_container" v-for="(item, index) in panos">
    <img class="image" :src="imgOrigin+item.content">
    <div style="position: absolute; top: 0; left: 0; font-size: 24px">{{item.nation}} </div>
  </div>
</div>
</template>

<script>
import * as api from '../../api/api'

export default {

  name: "TuxunFilter",
  data() {
    return {
      type: null,
      exceptNations: null,
      panos: [],
    }
  },

  mounted() {
    this.type = this.$route.query.type;
    this.exceptNations = this.$route.query.exceptNations;
    this.expectNations = this.$route.query.expectNations;
    this.create();
  },
  methods: {
    create() {
      api.getByPath('/api/v0/tuxun/challenge/adminCreate', {type: this.type, mapsId: 4, exceptNations: this.exceptNations, expectNations: this.expectNations}).then(res=>{
        if (res.data) {
          this.panos = res.data.rounds;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .image_container {
    position: relative;
    width: 100%;
    .image {
      width: 100%;
      object-fit: contain;
    }
  }
}
</style>
