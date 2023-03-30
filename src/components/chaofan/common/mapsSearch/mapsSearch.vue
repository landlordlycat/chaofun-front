<template>
  <div v-if="show" class="cover">
    <section class="section" style="display: block;overflow:scroll; overscroll-behavior: contain; height: 100%;    scrollbar-width: none;">
      <div style="font-size: 20px; color: white; padding-top: 2rem">练习赛搜索<el-button type="primary" style="margin-left: 10px" @click="show=false" round>关闭</el-button></div>
      <el-input v-model="keyword"
                :autofocus="true"
                @input="search"
                placeholder="搜索练习赛"
                style="margin-top: 2rem; max-width: 100%; margin-bottom: 20px"></el-input>
      <div v-for="(item, index) in this.pagedata" >
        <div @click.stop="toMapsDetail(item)" style="display: flex;  justify-content: space-between;">
          <div style="height: 100%;display: flex; color: white">
            <div>
              {{item.name}}
              <div>
                <span style="font-size: 6px;bottom: 0px; color: grey">(<span v-if="item.pcount">地点: {{item.pcount}} | </span>人次: {{item.players}})</span>
              </div>
            </div>
          </div>
          <div>
            <el-button style="background-color: unset; color: white" @click.stop="toMaps(item, 'noMove')" type="primary"round>固定</el-button>
            <el-button style="background-color: unset; color: white" @click.stop="toMaps(item, 'move')" type="primary" v-if="item.canMove" round>移动
              <span style="color: gold">(VIP)</span> </el-button>
            <div  v-if="!item.canMove" style="width: 180px"></div>
          </div>
        </div>
        <div style="margin-top: 1px; width: 100%;height: 1px; background-color: white;margin-bottom: 8px"></div>
      </div>
    </section>
  </div>
</template>

<script>
import * as api from '@/api/api'
import {tuxunJump} from "../../../../views/tuxun/common";
export default {
  name: "mapsSearch",
  data() {
    return {
      show: false,
      keyword: '',
      pagedata: null
    }
  },
  mounted() {
    this.getHotMaps();
  },
  methods: {
    getHotMaps(){
      api.getByPath('/api/v0/tuxun/maps/list').then(res=>{
        this.pagedata = res.data
      })
    },
    search() {
      api.getByPath('/api/v0/tuxun/maps/search', {keyword: this.keyword}).then(res=>{
        this.pagedata = res.data
      })
    },
    toMapsDetail(item) {
      // console.log(this.callBack)
      if (!this.callBack) {
        tuxunJump('/tuxun/maps_detail?mapsId=' + item.id)
      }
    },
    toMaps(item, type) {
      if (!this.callBack) {
        api.getByPath('/api/v0/tuxun/game/enterMap', {mapsId: item.id}).then(res => {
        })

        api.getByPath('/api/v0/tuxun/challenge/create', {'mapsId': item.id, 'type': type}).then(res => {
          if (res.success) {
            tuxunJump('/tuxun/challenge?challengeId=' + res.data);
          } else {
            if (res.errorCode === 'need_vip') {
              this.$vip({})
            }
          }
        })
      } else {
        this.show=false
        this.callBack(item.id, type)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  background-color: rgba(255, 255, 255, 0.247);
  color: white;
}
.cover {
  position: fixed;
  z-index: 2012;
  height: 100%;
  width: 100%;
  //color: ;
  top: 0;
  background-color: #090723;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;


  .back_home {
    position: fixed;
    padding-top: 1rem;
    padding-left: 1rem;
    z-index: 500;
  }

  .section{
    width: 60%;
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
  }
  .section::-webkit-scrollbar {
    display: none;  /* Safari and Chrome */
  }


}

@media only screen and (max-width: 768px) {
  .cover{
    .section {
      width: 90%;
    }
  }
}
</style>
