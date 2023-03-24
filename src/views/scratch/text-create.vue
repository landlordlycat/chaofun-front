<template>
  <div>
    <div style="padding-top: 10px">是否有提示
      <el-switch
          v-model="hint"
          @change="changeHasHint"
          active-color="#13ce66"
          inactive-color="#ff4949">
      </el-switch>
    </div>
    <div>
      提示/答案:
      <div>
        注：多答案的话可以在答案框内用 / 符号分割答案，例如：新疆/新疆省/新疆维吾尔自治区 ，但是在用户答题对以后只会显示第一个「新疆」
      </div>
    </div>

    <table style="width: 100%">
      <tbody>
      <tr style="width: 100px;">
        <th v-if="hasHint" style="background-color: #eee">提示</th>
        <th style="background-color: #eee">答案</th>
      </tr>
      <tr v-for="(item, index) in dataForm">
        <td  v-if="hasHint" style=" width: 50%; border: 1px solid black; ">
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
  name: "text-create",
  data() {
    return {
      chooseIndex: null,
      hint: false,
    }
  },
  props: {
    hasHint: Boolean,
    dataForm: Array,
  },
  created() {
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
