<template>
 <div>
    <div @click.stop="openLink(item)" class="item_link">
      <div v-if="item.tags.length" class="tags">
        <div v-for="(it, ins) in item.tags" :key="ins">
                  <span :style="{'backgroundColor': (it.backgroundColor||'#ff9300'),'color': it.fontColor||'#fff'}"
                  ># {{ it.name }}</span>
        </div>
      </div>
        <div class="right_content">
        {{item.title}}
        </div>
        <div :class="['left_img',{'left_img_display': item.cover}]">
          <i v-if="!item.cover" class="el-icon-link"></i>
          <img v-if="item.cover" :src="imgOrigin+item.cover+(item.cover.includes('.ico')?'':'?x-oss-process=image/resize,h_100/quality,q_75')" alt="">
        </div>
    </div>
 </div>
</template>

<script>
 export default {
   name: '',
   data(){
     return {

     }
   },
   props: {
       item: {
           type: Object,
           default(){
               return {}
           }
       },
   },
   components: {

   },
   created() {
   },
   mounted() {

   },
   methods: {
     openLink(item){
       window.open(item.link,"_blank");
     },
    toUrls(item,params){
       this.postBehavior(item.postId,'jump');
       this.toUrl(params)
    },
   }
 }
</script>

<style type='text/scss' lang='scss' scoped>
.el-icon-link{
  padding: 10px;
}
.item_link{
      position: relative;
      min-height: 80px;
      // padding-right: 10px;
      &:hover{
        color: $linkcolor;
      }
      cursor: pointer;
      display: flex;
      border: $border;
      border-radius: 6px;
      align-items: center;

      .left_img{
        flex: 0 0 80px;
        text-align: center;
        // padding: 10px 0;
        // border-right: $border;
        // margin-right: 10px;
        // padding-right: 10px;
        i{
          font-size: 40px;
          color: #666;
        }
        img{
          max-width: 100%;
          min-height: 80px;
          max-height: 120px;
          vertical-align: middle;
        }
      }
      .left_img_display{
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
      .right_content{
        flex: 1;
        font-size: 15px;
        padding: 10px 10px;
        //display: flex;
        justify-content: space-around;
        font-weight: 600;
        display:block;
        word-break: break-all;
        word-wrap: break-word;
        line-height: 26px;
      }
    }
.phone-item{
    padding-right: 20px;
    .item_link{
      padding: 0;
      .left_img{
        margin-right: 10px;
      }
    }
    .item_image{
      max-width: 100%;
    }
    .item_video{
        .video{
            height: 240px;
        }
    }
  }
.tags {
  display: inline-block;
  position: absolute;
  top:2px;
  left: 2px;
  span {
    display: inline-block;
    vertical-align: middle;
    padding: 2px 6px;
    background: #ff9300;
    border-radius: 4px;
    font-size: 13px;
    color: #fff;
  }
}
</style>
