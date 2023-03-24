<template>
  <div>
    <div>
      问题/答案:
      <div>
        注：点击中问目会按顺序展示，答案会去重以后按字母序展示
      </div>
    </div>

    <table style="width: 100%">
      <tbody>
      <tr style="width: 100px;">
        <th style="background-color: #eee">问题</th>
        <th style="background-color: #eee">答案</th>
      </tr>
      <tr v-for="(item, index) in dataForm">
        <td style=" width: 50%; border: 1px solid black; ">
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
    <el-button  size="mini" @click="shuffle">打乱顺序</el-button>
    <div></div>
  </div>
</template>

<script>
export default {
  name: "click-create",
  data() {
    return {
      chooseIndex: null,
      hint: false,
    }
  },
  props: {
    // hasHint: Boolean,
    dataForm: Array,
  },
  created() {
    this.hasHint = true;
    this.updatehin
    this.hint = this.hasHint;
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
    deleteChooseColumn() {
      if (this.chooseIndex !== null) {
        this.dataForm.splice(this.chooseIndex, 1);
        this.chooseIndex = null;
      }
    },
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
    deleteColumn() {
      this.dataForm.pop();
    },
    addColumn() {
      this.dataForm.push({});
    },
    changeHasHint(e) {
      this.$emit('update:hasHint', e);
    }
  }
}
</script>

<style lang="scss" scoped>
table, th, td {
  border-collapse:collapse;
  border: 1px solid black;
}
</style>
