<template>
  <div>
    <div class="grid-main">
      <div v-for="(item, index) in dataForm"  class="card" @click="cardClass='card-choose'">
              <el-upload
                  :before-upload="beforeAvatarUpload"
                  :data="filedata"
                  :on-success="function (response) {return handleAvatarSuccess(response, item) }"
                  :show-file-list="false"
                  action="/api/upload_image"
                  class="avatar-uploader"
                  name="file">
                <img v-if="item.image" :src="imgOrigin + item.image + '?x-oss-process=image/resize,h_300/quality,q_75'" class="test-image">
                <div v-else class="upload-click">
                  <div>
                    点击上传
                  </div>
                </div>
              </el-upload>
          <el-input placeholder="答案" v-model="item.answer"></el-input>
      </div>

    </div>
    <el-button  size="mini" @click="addColumn">加一张</el-button>
    <el-button  size="mini" @click="deleteColumn">删除最后一行</el-button>
  </div>
</template>

<script>
export default {
  name: "img-create",
  data() {
    return {
      chooseIndex: null,
      filedata: {},
      cardClass: 'card',
    }
  },
  props: {
    hasHint: Boolean,
    dataForm: Array,
  },
  methods: {
    handleAvatarSuccess(res, item) {
      console.log(res);
      console.log(item);

      if (res.success) {
        item.image = res.data;
        this.dataForm.__ob__.dep.notify();
      } else if (res.errorCode == 'invalid_content') {
        // this.imageUrl = ''
        this.$toast(res.errorMessage)
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 20MB!");
        return false;
      }
      this.filedata.fileName = file.name;
      return true;
    },
    deleteColumn() {
      this.dataForm.pop();
    },
    addColumn() {
      if (this.dataForm.length >= 16) {
        this.$toast('图片小测验最多支持16个题')
      } else {
        this.dataForm.push({});
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.el-upload--picture-card {

}
.grid-main {
  display: grid;
  grid-row-gap: 0rem;
  grid-column-gap: 0rem;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  position: relative;
  .card {
    margin: auto;
    justify-content: center;
    align-items: center;
    align-content: center;
    text-align: center;
    padding: 2px;
    position: relative;
    justify-items: center;

    .avatar-uploader  {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      //overflow: hidden;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      ::v-deep .el-upload {
        width: 100%;
        height: 0;
        padding-bottom: 100%;

      }
      .test-image {
        display: flex;
        width: 100%;
        aspect-ratio: 1 / 1;
        object-fit: contain;
        //max-height: 100%;
        //height: 0;
        //padding-bottom: 100%;
      }
      .upload-click {
        display: flex;
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        div {
          margin: 0;
          position: absolute;
          top: 50%;
          left: 50%;
          -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          width: 100%;
        }
      }
    }

  }
}
@media only screen and (max-width: 679px) {
  .grid-main {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
