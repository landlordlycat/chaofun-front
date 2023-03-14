<template>
<div class="container">
  <div class="choose-container">
    <div @click="toPano" class="text-create" style="width: 100%; padding:2rem;margin-top: 2rem; background-color: #DEF5D5">
      <div style="text-align: center; font-size: 24px; font-weight: bold">
        街景审核
      </div>
      <div>
        余量: {{restPano}}
      </div>
    </div>
    <div></div>
    <div @click="toWonders" class="img-create" style="width: 100%; padding:2rem;margin-top: 2rem; background-color: #027BFF">
      <div style="text-align: center; font-size: 24px; font-weight: bold">
        街景奇观审核
      </div>
      <div>
        余量: {{restWonders}}
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {tuxunJump, tuxunOpen} from "./common";
import {init} from "../../components/game/snake/snake3";
import * as api from "../../api/api";

export default {
  name: "admin-console",
  data() {
    return {
      restPano: 0,
      restWonders: 0
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      api.getByPath("/api/v0/tuxun/admin/getTotalUncheckWonders", {tuxunPid: this.tuxunPid}).then(res => {
        if (res.success) {
          this.restWonders = res.data;
        }
      });
      api.getByPath("/api/v0/tuxun/admin/getTotalUncheckPano", {tuxunPid: this.tuxunPid}).then(res => {
        if (res.success) {
          this.restPano = res.data;
        }
      });
    },
    toPano() {
      tuxunJump('/tuxun/pano-filter')
    },
    toWonders() {
      tuxunJump('/tuxun/wonders-filter')
    },
  }
}
</script>

<style lang="scss" scoped>

.container {
  height: 100%;
  width: 100%;

  .choose-container {
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

  .text-create, .img-create .click-create {
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
