<template>
  <div class="container">
    <div class="back_home">
      <el-button @click="goBack" size="small" round>←返回</el-button>
<!--      <el-button @click="goHome" size="small" round>首页</el-button>-->
    </div>
    <div class="choose-container">
      <div style="width: 100%; text-align: center; font-size: 22px;padding-top: 3em">选择创建类型</div>
      <div @click="createText" class="text-create" style="width: 100%; padding:2rem;margin-top: 2rem; background-color: #DEF5D5">
        <div style="text-align: center; font-size: 24px; font-weight: bold">
          文本
        </div>
      </div>
      <div></div>
      <div @click="createImage" class="img-create" style="width: 100%; padding:2rem;margin-top: 2rem; background-color: #027BFF">
        <div style="text-align: center; font-size: 24px; font-weight: bold">
          图片
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {tuxunJump} from "../tuxun/common";

export default {
  name: "choose-create",
  methods:{
    createText() {
      window.location.href = '/scratch/create?type=text';
    },
    createImage() {
      window.location.href = '/scratch/create?type=image';
    },
    goHome() {
      window.location.href =  '/scratch/'
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        window.location.href =  '/scratch/'
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  .choose-container{
    margin: auto;
    width: 30%;
    .input {
      width: 50%;
      //padding-top: 1rem;
      //max-width: 40%;
      //margin: auto;
    }
  }
  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }

  .text-create, .img-create {
    cursor: pointer;
    &:hover {
      transform: scale(1.03);
    }
  }


}

@media only screen and (max-width: 768px) {
  .container {
    .choose-container {
      width: 80%;
    }
  }
}

</style>
