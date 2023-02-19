<template>
  <div class="container">
    <div class="back_home">
      <el-button size="small" @click="goBack" round>←返回</el-button>
      <el-button @click="goHome" size="small" round>首页</el-button>
      <el-button size="small" v-if="modify" @click="deleteGame" round>删除测验</el-button>
    </div>
    <div style="text-align: center; width: 100%; font-size: 24px;font-weight: bold; padding-top: 3rem; padding-bottom: 2rem">
      <div v-if="!modify">创建测验</div>
      <div v-else>修改测验</div>
      <div style="font-size: 16px; font-weight: normal; text-align: center">建议添加标签，创建之前请通过搜索查看是否有重复测验，如果重复创建管理员会删除</div>
    </div>
    <div class="input-container">
      <div class="title">设置封面(可选)</div>
      <div>
        <el-upload
            :before-upload="beforeAvatarUpload"
            :data="filedata"
            :on-success="handleAvatarSuccess"
            :show-file-list="false"
            action="/api/upload_image"
            class="avatar-uploader"
            name="file">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i style="border: 1px solid black;" v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div>
        标题:
      </div>
      <el-input v-model="name"></el-input>
      <div>
        描述:
      </div>
      <el-input v-model="desc"></el-input>
      <div>
        标签(可选，多标签请用逗号分隔):
      </div>
      <el-input v-model="tags"></el-input>
      <div>
        限时（秒）：
      </div>
      <el-input-number :min=5 v-model="countdown"></el-input-number>
      <div style="padding-top: 10px">是否有提示
        <el-switch
            v-model="hasHint"
            active-color="#13ce66"
            inactive-color="#ff4949">
        </el-switch>
      </div>
      <div>
        提示/答案:
      </div>
<!--      <el-input v-model="answers" type="textarea"-->
<!--                :autosize="{ minRows: 10, maxRows: 10}"-->
<!--      ></el-input>-->

      <table style="width: 100%">
        <tbody>
        <tr style="width: 100px;">
          <th v-if="hasHint" style="background-color: #eee">提示</th>
          <th style="background-color: #eee">答案</th>
        </tr>
        <tr v-for="(item, index) in dataForm">
          <td  v-if="hasHint" style=" width: 50%; border: 1px solid black; ">
<!--            <div>123</div>-->
            <input @focus="columnChoose(index)" @blur="cleanChoose" v-model="item.hint" style="width: 100%" ></input>
          </td>
          <td style=" width: 50%; border: 1px solid black;">
            <input @focus="columnChoose(index)" @blur="cleanChoose" v-model="item.answer" style="width: 100%" ></input>
          </td>
        </tr>
        </tbody>
      </table>
      <el-button  size="mini" @click="addColumn">加一行</el-button>
      <el-button  size="mini" @click="deleteColumn">删除最后一行</el-button>
      <el-button  v-if="chooseIndex != null" size="mini" @click="deleteChooseColumn">删除选中行</el-button>
      <div></div>
      <el-button type="primary" style="margin-top: 20px" @click="submit">提交测验</el-button>
    </div>

  </div>
</template>

<script>
import * as api from '../../api/api'

export default {
  name: "Create",
  data() {
    return {
      name: '',
      desc: '',
      answers: '',
      filedata: {},
      dataForm: [{}, {}, {}, {}, {}, {}],
      modify: false,
      imageUrl: null,
      countdown: 120,
      chooseIndex: null,
      hasChoose: false,
      cleanTimer: null,
      tags: '',
      hasHint: false,
      coverOssName: 'biz/1667921710402_beb8f2eaccb1482d87deb7816fd3baef_0.jpeg',
      id: null
    }
  },
  mounted() {
    this.id =  this.$route.query.id;
    if (this.id && this.id !== '') {
      this.modify = true;
      this.getGuess();
    }
  },
  methods: {
    columnChoose(index) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.chooseIndex = index
    },
    cleanChoose() {
      this.cleanTimer = setTimeout(()=> {
        this.chooseIndex = null;
      }, 200)
    },
    deleteChooseColumn() {
      if (this.chooseIndex !== null) {
        this.dataForm.splice(this.chooseIndex, 1);
        this.chooseIndex = null;
      }
    },
    deleteColumn() {
      this.dataForm.pop();
    },
    addColumn() {
      this.dataForm.push({});
    },
    handleAvatarSuccess(res, file) {
      console.log(this.filedata);
      console.log(res);
      if (res.success) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.coverOssName = res.data;
      } else if (res.errorCode == "invalid_content") {
        // this.imageUrl = ''
        this.$toast(res.errorMessage);
      }

      console.log()
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
    getGuess() {
      api.getByPath('/api/v0/scratch/game/get', {'id': this.id}).then(res=>{
        this.name = res.data.name;
        this.desc = res.data.desc;
        this.countdown = res.data.countdown;
        this.answers = res.data.data.answers.join("\n");
        this.dataForm = res.data.data.data;
        this.hasHint = res.data.data.hasHint;
        this.coverOssName = res.data.cover;
        this.imageUrl = this.imgOrigin + this.coverOssName + '?x-oss-process=image/resize,h_300/quality,q_75';
        if (res.data.tags) {
          this.tags = res.data.tags.join(",");
        }
      })
    },
    goBack() {
      try {
        this.$router.go(-1);
      } catch (e) {
        window.location.href = '/scratch'
      }
    },
    submit() {
      if (this.name === '') {
        this.$toast('测验名称不能为空');
        return;
      }

      if (this.desc === '') {
        this.$toast('测验描述不能为空')
        return;
      }

      // if (this.answers === '') {
      //   this.$toast('测验的答案不能为空')
      //   return;
      // }

      var data = {'version': 1.0,'hasHint': this.hasHint, data: this.dataForm};
      api.postByPath('/api/v0/scratch/game/create', {id: this.id, countdown: this.countdown, name: this.name, tags: this.tags, desc: this.desc, cover: this.coverOssName, hasHint: this.hasHint, data: JSON.stringify(data)}).then((res) => {
        window.location.href = '/scratch/guess?id=' + res.data.id;
      })
    },
    goHome() {
      window.location.href = '/scratch';
    },
    deleteGame() {
      this.$confirm(`是否确定删除该小测验？`, "提示", {
        type: "warning",
        // position: center,
      }).then(() => {
        api.getByPath('/api/v0/scratch/game/delete', {'id': this.id}).then(res=>{
          if (res.success) {
            window.location.href = '/scratch';
          }
        })
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
  .input-container {
    width: 40%;
    margin: auto;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    margin-bottom: 0;
  }
  table, th, td {
    border-collapse:collapse;
    border: 1px solid black;
  }
}

@media only screen and (max-width: 679px) {
  .container {
    .input-container {
      width: 90%;
    }



  }
}
</style>
