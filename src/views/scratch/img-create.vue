<template>
  <div>
    <div>
      注：多答案的话可以在答案框内用 / 符号分割答案，例如：新疆/新疆省/新疆维吾尔自治区 ，但是在用户答题对以后只会显示第一个「新疆」
    </div>
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
                <img v-if="item.image" :src="imgOrigin + item.image + '?x-oss-process=image/resize,h_300/format,jpeg/quality,q_75'" class="test-image">
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
    <el-button  size="mini" @click="deleteColumn">删除最后一张</el-button>
    <el-button  size="mini" @click="shuffle">打乱顺序</el-button>

    <div style="padding-top: 20px">幻灯片模式
      <el-switch
          v-model="slideshow"
          @change="changeSlideshow"
          active-color="#13ce66"
          inactive-color="#ff4949">
      </el-switch>
    </div>
    <div style="color: grey">注：幻灯片模式为有顺序的分页一张一张的图片，用户在回答时需要回答当前次序的图片</div>
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
      // innerSlideshow: false,
    }
  },
  props: {
    hasHint: Boolean,
    slideshow: Boolean,
    dataForm: Array,
  },
  created() {
  },
  methods: {
    shuffle() {
      this.$confirm('你确定要打乱顺序吗？', '', {
        confirmButtonText: '确定',
        callback: action => {
          if (action == 'confirm') {
            this.dataForm.sort(() => Math.random() - 0.5);
          }
        }
      });
    },
    changeSlideshow() {
      this.$emit('update:slideshow', this.slideshow);
    },
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
@media only screen and (max-width: 768px) {
  .grid-main {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
