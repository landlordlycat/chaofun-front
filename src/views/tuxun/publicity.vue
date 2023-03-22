<template>
  <div class="container">
      <div class="back_home" @click="goHome">
        <el-button round>←首页</el-button>
      </div>
      <div class="nav">
        直播/视频/教程
      </div>
    <section class="game_entrance">
      <div class="first_session_head" v-if="recommendPagedata && recommendPagedata.length >= 1">推荐</div>
      <div class="line" v-if="recommendPagedata && recommendPagedata.length >= 1"></div>
      <div class="grid_main" v-if="recommendPagedata && recommendPagedata.length >= 1">
        <div v-for="(item, index) in recommendPagedata" @click="toLink(item.url)"  :style="{'background-image': 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.6)), url('+ imgOrigin + (item.cover ?? 'biz/1659323781589_7d19c33667a54a4dabb0405ee5aec20f.jpeg') + '?x-oss-process=image/resize,h_400)','background-size':'cover'}" class="card">
          <div class="title">
            {{item.name}}
          </div>
          <div class="describe">
            {{item.desc}}
          </div>
        </div>
      </div>
    </section>
      <section class="game_entrance">
        <div class="first_session_head" v-if="recentPagedata && recentPagedata.length >= 1">最新</div>
        <div class="line" v-if="recentPagedata && recentPagedata.length >= 1"></div>
        <div class="grid_main" v-if="recentPagedata && recentPagedata.length >= 1">
          <div v-for="(item, index) in recentPagedata" @click="toLink(item.url)"  :style="{'background-image': 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.6)), url('+ imgOrigin + (item.cover ?? 'biz/1659323781589_7d19c33667a54a4dabb0405ee5aec20f.jpeg') + '?x-oss-process=image/resize,h_400)','background-size':'cover'}" class="card">
            <div class="title">
              {{item.name}}
            </div>
            <div class="describe">
              {{item.desc}}
            </div>
          </div>
        </div>
      </section>
    <section class="game_entrance">
      <div class="first_session_head" v-if="coursePagedata && coursePagedata.length >= 1">教程</div>
      <div class="line" v-if="coursePagedata && coursePagedata.length >= 1"></div>
      <div class="grid_main" v-if="coursePagedata && coursePagedata.length >= 1">
        <div v-for="(item, index) in coursePagedata" @click="toLink(item.url)"  :style="{'background-image': 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.6)), url('+ imgOrigin + (item.cover ?? 'biz/1659323781589_7d19c33667a54a4dabb0405ee5aec20f.jpeg') + '?x-oss-process=image/resize,h_400)','background-size':'cover'}" class="card">
          <div class="title">
            {{item.name}}
          </div>
          <div class="describe">
            {{item.desc}}
          </div>
        </div>
      </div>
    </section>
    </div>
</template>

<script>
// @ is an alias to /src
// import Header from '@/components/common/Header.vue'
import * as api from '@/api/api'
import {tuxunJump, tuxunOpen} from "./common";
export default {
  name: 'tuxunRank',
  components: {

  },
  data(){
    return {
      recentPagedata: [
        {name: '小伙根据照片推理地点（11月22日图寻每日挑战）', cover: 'biz/1669135863485_4591de99f8234a7e888bc0f2f7233723_0.png', url: 'https://www.bilibili.com/video/BV1DP4y1R7Ch'},
        {name: '挑战地理大神！', cover: 'biz/1669135820792_683cb8fed8d040a7b4b6d218a7cb0ae5_0.png', url: 'https://www.bilibili.com/video/BV1c24y1178K'},
        {name: '目标是俄语大师（11月21日图寻每日挑战）', cover: 'biz/1669135764486_679197078fb24b0e900651edfc43e4c8_1.png', url: 'https://www.bilibili.com/video/BV1LG4y1Z7kE'},
        {name: '我的家乡，美丽的千岛湖（11月20日图寻每日挑战）', cover: 'biz/1669135637531_27a7780292cd473696b006a6714bb280_0.png', url: 'https://www.bilibili.com/video/BV1XG4y1R7se'},
        {name: '图寻每日挑战（11.20记录）', cover: 'biz/1669135606633_3de5d0d989ca4cd88b2ed5da04c4d5bd_0.png', url: 'https://www.bilibili.com/video/BV1pv4y1U7rY'},
        {name: '杭州山水甲天下（11月19日图寻每日挑战）', cover: 'biz/1669135555673_98e2f0f5ce534b7bac22fd7ee7074b96_0.png', url: 'https://www.bilibili.com/video/BV1Pg411i7u2'},
        {name: '图寻-每日挑战-2022.11.19', cover: 'biz/1669134796095_c2001da232e249f9a574db7948c5b43c_0.png', url: 'https://www.bilibili.com/video/BV1K24y1172f'},
        {name: '最简单的____，最极致的享受（11月18日图寻每日挑战）', cover: 'biz/1669134589482_5968350cba6542b89966775958ba1e51_0.png', url: 'https://www.bilibili.com/video/BV1EP4y117Uv'},
        {name: '【图寻第3集】3分钟完成的5轮挑战', cover: 'biz/1669134502802_b2fd026847a44813843f55c37f99b553_0.png', url: 'https://www.bilibili.com/video/BV1fP4y1y7FR'},
        {name: '2分钟高能挑战20000分 图寻每日挑战', cover: 'biz/1669134431744_f965df9d9e03486895f479f3b88c9eb6_0.png', url: 'https://www.bilibili.com/video/BV1Zg411q7fm'},
        {name: '【图寻第2集】美帝凤凰城、土耳其山城神直觉。。。别的都是笑话', cover: 'biz/1669134384956_e3ae4f91866d429e8b0deda488619a73_0.png', url: 'https://www.bilibili.com/video/BV1V24y1m7DN'},
        {name: '回归正轨,新人主播,请喷（11月16日图寻每日挑战）', cover: 'biz/1669134299657_eacdbf866ef04274b75a0b6ccc07ed2a_1.png', url: 'https://www.bilibili.com/video/BV19P4y1y7jZ'},
        {name: '谁知盘中餐，粒粒皆辛苦', cover: 'biz/1669134212741_4cf565a6189142cf9dacfd789247df37_0.png', url: 'https://www.bilibili.com/video/BV1h8411879f'},
        {name: '晕了（11月16日图寻每日挑战）', cover: 'biz/1669133993913_57125b82e18b4074a9513412ed1abc34_0.png', url: 'https://www.bilibili.com/video/BV1jP4y117jb'},
        {name: '网络谜踪世界名胜特辑', cover: 'biz/1669133915086_71464538e68846ef9374d805343b9ee1_0.png', url: 'https://www.bilibili.com/video/BV1D841187La'},
        {name: '图寻2每日挑战解说第二弹', cover: 'biz/1669133874689_b7c3364ffb2c412a994e7b78a3095c7c_0.png', url: 'https://www.bilibili.com/video/BV1XW4y1s78E'},
        {name: '小伙被关密室80分钟，最后疯了', cover: 'biz/1669133804959_1c0f82e09b324503a857537534bb81c5_0.png', url: 'https://www.bilibili.com/video/BV1T84y117dt'},
        {name: 'I THREW my game（11月15日图寻每日挑战）', cover: 'biz/1669133748277_d4102c07a19744708353b57b0f0b2ac7_0.png', url: 'https://www.bilibili.com/video/BV1B8411j73B'},
        {name: '【图寻】我终于来了！！！结果第1、2题离我住过的地方都是50km内!', cover: 'biz/1669133696093_33c269d7293e4b61a993ee3832549a3f_0.png', url: 'https://www.bilibili.com/video/BV1V24y1m7DN'},
        {name: '每日挑战来啦，感谢虎扑老哥（11月14日图寻每日挑战)', cover: 'biz/1669133518608_423f7da27ad3418eae586d080e86434b_0.png', url: 'https://www.bilibili.com/video/BV1Gd4y1k7K5'},
        {name: '发烧的小伙继续网络谜踪（11月13日图寻每日挑战）', cover: 'biz/1669133409324_ac8d7e2763c14ab3b0d3a361dfe66468_0.png', url: 'https://www.bilibili.com/video/BV1wK411Z7w6'},
        {name: '重发）系好安全带 我要装逼了（11月12日图寻每日挑战）', cover: 'biz/1668270500288_fa8b273872e34e2ea0ce3f4b9832851a_0.png', url: 'https://www.bilibili.com/video/BV1Pd4y1b7Qi'},
        {name: '如何优雅的证明你是单身狗这件小事', cover: 'biz/1668183939910_7f5295dfbdc94476b8e20d6f5a048e0c_0.png', url: 'https://www.bilibili.com/video/BV1TG4y1t7Mv'},
        {name: 'aslghf;lyweoityafhdlk（11月11日图寻每日挑战', cover: 'biz/1668183799021_cb0256561daf45dbb923fcd6ccf348e9_0.png', url: 'https://www.bilibili.com/video/BV1W14y1p7GE'},
        {name: '不认识山西是我的错吗？！', cover: 'biz/1668104654887_6e710c4c79e14690b2b4f6358337118f_0.png', url: 'https://www.bilibili.com/video/BV12W4y147tq'},
        {name: '五个判断国家的妙招', cover: 'biz/1668104621854_156f518865eb42dbaae850ae267ac282_0.png', url: 'https://www.bilibili.com/video/BV1qG4y1Z7QJ/'},
        {name: '网络谜踪：小伙根据一张图片推理出地点', cover: 'biz/1668104565687_4e3a6af57ffb452a86eb808df9758d5a_0.png', url: 'https://www.bilibili.com/video/BV1114y1p78F'},
        {name: '不认识广东是我的错吗？图寻每日挑战 ', cover: 'biz/1668104507742_7d476a4a7e4a4aa7a2010331ce93b160_0.png', url: 'https://www.bilibili.com/video/BV1vd4y1F7GU'},
        {name: '解说地理达人如何用一张照片判断国家', cover: 'biz/1668104466140_b93dd2fb3b704ef0a9a88272b4d59140_0.png', url: 'https://www.bilibili.com/video/BV1gP4y127mp'},
        {name: '燃烧自己，照亮他人（11月7日图寻每日挑战）', cover: 'biz/1668104400851_565d923c4b4a427ebf9363c785f55ac1_0.png', url: 'https://www.bilibili.com/video/BV1V8411a7bZ'},
        {name: '图寻挑战：如何根据道路车辆信息及房屋风格判断所处国家', cover: 'biz/1667842793516_73b95f2af3df4b3093932202b0716027_0.png', url: 'https://www.bilibili.com/video/BV11t4y1K76d'},
        {name: '如何根据照片分析出地点？', cover: 'biz/1667842750216_dff9682676fa4ac6a344f00490af9b27_0.png', url: 'https://www.bilibili.com/video/BV1Je411F7kr'},
        {name: '尝试每日挑战解说第一弹', cover: 'biz/1667842652615_10b6449e10bb44faa65a96102b113874_1.png', url: 'https://www.bilibili.com/video/BV1vV4y137Ry'},
        {name: '你能根据照片推理位置吗？主播最后疯了', cover: 'biz/1667842483557_32828e8a88314daebf0a4ae850c3346b_0.png', url: 'https://www.bilibili.com/video/BV1Gd4y1w72Y'},
        {name: '【图寻】 国家连胜移动87连胜', cover: 'biz/1667760336015_8ef96c7ab24b4bada0df99a45eb5e0be_0.png', url: 'https://www.bilibili.com/video/BV1gP4y1U7Be'},
        {name: '你能根据照片推理位置吗？炒饭图寻', cover: 'biz/1667760307022_8058bb1693b640399b93d5dc315b5968_0.png', url: 'https://www.bilibili.com/video/BV1Ae411F77B'},
        {name: '小伙挑战看图猜省份，结局意想不到', cover: 'biz/1667760203332_f301972455bd45c0931c6ec427d4b8e1_0.png', url: 'https://www.bilibili.com/video/BV1o8411h7Ji'},
        {name: '大家秋天快乐（11月5日图寻每日挑战）', cover: 'biz/1667760119385_74b2f0d189c24f21beb8cfa154a38eff_0.png', url: 'https://www.bilibili.com/video/BV1xv4y1U7Qh'},
        {name: '图寻挑战：图寻竟然有人40连胜 挑战世界街景，分辨出是哪个国家', cover: 'biz/1667672178243_dcdba9b1c4034abfbffa8ff715c2e21f_0.png', url: 'https://www.bilibili.com/video/BV1at4y1K7Pp'},
        {name: '今天题目质量很高（11月4日图寻每日挑战）', cover: 'biz/1667672137743_83e6fde7780e4897ae503045ec079740_0.png', url: 'https://www.bilibili.com/video/BV1Q8411h7kH'},
        {name: '网络迷踪：如何根据道路车辆信息判断所处国家', cover: 'biz/1667671971425_5b42b9a4446241b5be069291ba23753e_0.png', url: 'https://www.bilibili.com/video/BV1u84y1v7Dw'},
        {name: '你能根据照片推理位置吗？', cover: 'biz/1667671858488_ade022f18f5f4a819cb7c6f8f19aead6_0.png', url: 'https://www.bilibili.com/video/BV1qm4y1c7Fo'},
        {name: '你能不穿衣服根据照片推理位置吗？', cover: 'biz/1667671755525_2deeeec3d2b64389afc5f3ccb861b42b_0.png', url: 'https://www.bilibili.com/video/BV1qm4y1c7Fo'},
        {name: '你能根据照片推理位置吗？', cover: 'biz/1667671688674_c3e5b3205aa24de3ba30b564d61515a5_0.png', url: 'https://bilibili.com/video/BV1KD4y187q2'},
        {name: '你能根据照片推理位置吗？（11月2日图寻每日挑战）', cover: 'biz/1667670151387_0c4a117c8a9e4d77829920d259f6e7ae_0.png', url: 'https://www.bilibili.com/video/BV1Ne4y1t7LB'},
        {name: '你能根据照片推理位置吗？（1月11日图寻每日挑战）', cover: 'biz/1667404794368_31c2729e95dc411c95013452ac3290dc_0.png', url: 'https://www.bilibili.com/video/BV1bm4y1c7T5'},
        {name: '【图寻每日挑战】第一次尝试解说，节目效果有了', cover: 'biz/1667315860054_b7aa2bbdd3c945cc9a94b8449dc0f9bd_0.png', url: 'https://www.bilibili.com/video/BV19e4y1y7a4'},
        {name: '你能根据照片推理位置吗？（31月10日图寻每日挑战）', cover: 'biz/1667315813323_3b2c26b8dd3743b1ba7e132ccf750bed_0.png', url: 'https://www.bilibili.com/video/BV1EK411S7x4'},
        {name: '小伙挑战图寻每日挑战，直呼好爽！（10月31日挑战）', cover: 'biz/1667315764462_c387b3fbd08a4f0a8ebae598b62ea914_0.png', url: 'https://www.bilibili.com/video/BV1eD4y1478j'},
        {name: '根据照片推理国家首都', cover: 'biz/1667315721194_d87c9aa855d744f9974a4d0dba4a88a1_0.png', url: 'https://www.bilibili.com/video/BV1NG411A7m6'},
        {name: '图寻实况1', cover: 'biz/1667315653758_f15c884f808b46b29def6da870ed8c9e_0.png', url: 'https://www.bilibili.com/video/BV1TP411P7x3'},
        {name: '好久不见！根据照片推理位置（30月10日图寻每日挑战）', cover: 'biz/1667315579123_4ff18ed739564a87b12ec089813dbdae_0.png', url: 'https://www.bilibili.com/video/BV12D4y1b73A'},
        {name: '小伙终于发现了必胜的法则，居然扶摇直上17000分！', cover: 'biz/1667315524093_03c1f9c4d2954320a011bc32d27c187f_0.png', url: 'https://www.bilibili.com/video/BV1eP4y1m7pc'},
        {name: '3分钟挑战图寻10月29月日每日挑战20000分（成功了，但没完全成功）', cover: 'biz/1667059784925_2a85829fe2864560b7e3271125b1baea_0.png', url: 'https://www.bilibili.com/video/BV12m4y1F7gv'},
        {name: '【图寻】国家挑战移动街景44连胜（暂无解说）', cover: 'biz/1667059727103_d6cc23b981604e73bccb58558d748267_0.png', url: 'https://www.bilibili.com/video/BV1uV4y1V765'},
        {name: '10.29图寻每日挑战', cover: 'biz/1667059577008_c07e8348a7484aabaedd99f2ce098c31_1.png', url: 'https://www.bilibili.com/video/BV12K411U7PE'},
        {name: '我终于发现了必胜的法则 Geoguessr/溯景寻踪/图寻/周游盖世', cover: 'biz/1667059495867_08c2a6e7ed1940739cda00437ce0fa05_0.png', url: 'https://www.bilibili.com/video/BV1NV4y1V7PP'},
        {name: '请遵守交通规则!！根据照片推理位置（10月92日图寻每日挑战）', cover: 'biz/1667059435196_b16be93f861b441f81c22623d69adb0a_0.png', url: 'https://www.bilibili.com/video/BV1ie4y14758'},
        {name: '图寻10月2日淘汰赛，用手机玩的教训太深刻了', cover: 'biz/1666984713933_f9ccb6a6818d4758921bbe93dee95d39_1.png', url: 'https://www.bilibili.com/video/BV1Kt4y1M7Xo'},
        {name: '10.28图寻每日挑战', cover: 'biz/1666984607034_661134c1781846728f88b67280fc33b7_1.png', url: 'https://www.bilibili.com/video/BV1vG4y1h7Yj'},
        {name: '按图索骥泰姬陵！根据照片猜测所在地（10月82日图寻每日挑战）', cover: 'biz/1666984491574_13be72c05beb46e0bcbc80bb4df31e41_0.png', url: 'https://www.bilibili.com/video/BV1GG4y1b7yd/'},
        {name: '这是那个地方的鸟瞰图？根据鸟瞰图推理位置', cover: 'biz/1666896789446_c1a60f835e6c481eb556d1587ae6a516_0.png', url: 'https://www.bilibili.com/video/BV1Ym4y1F7pL'},
        {name: '开局一张图，你能看出国家吗 (系列)', cover: 'biz/1666896756739_69513bcd1938430aa411f0394388caf6_0.png', url: 'https://www.bilibili.com/video/BV1ym4y1w7cW'},
        {name: '在密室里如何判断自己在哪？', cover: 'biz/1666896699551_f4aed9720af74d22bb3e6a40fb58baa2_0.png', url: 'https://www.bilibili.com/video/BV1qe4y177iR'},
        {name: '给你机会你不中用啊！根据照片猜测所在地（10月72日图寻每日挑战）', cover: 'biz/1666896546173_d0a421fa85bd42e19d0f656ee78e23b2_0.png', url: 'https://www.bilibili.com/video/BV1et4y1u7NE'},
        {name: '震惊！这个小伙居然每天震惊！（10月62日图寻每日挑战）', cover: 'biz/1666799453267_debf9ecc5356485e8aa1438e57312046_0.png', url: 'https://www.bilibili.com/video/BV1GR4y1Q7QV'},
        {name: '震惊！小伙居然用眼球追踪做这种事', cover: 'biz/1666768356432_92fc9d6c3a4145d2a1bfc6f494fca254_1.png', url: 'https://www.bilibili.com/video/BV1x14y157Qx'},
        {name: '震惊！小伙用一张图定位错误地点（10月52日图寻每日挑战', cover: 'biz/1666768287038_651f59dc96d6422aab61aabe79289351_0.png', url: 'https://www.bilibili.com/video/BV1CR4y1Q7tW'},
        {name: '10.24每日挑战', cover: 'biz/1666625741761_7333a9d939664d8fafc249fe49fb5ffc_1.png', url: 'https://www.bilibili.com/video/BV1a84y1B7Ks'},
        {name: '震惊！小伙用一张图精确定位路口（10月42日图寻每日挑战）', cover: 'biz/1666625698999_3d94bd88fdfd4021943fdeafbf466071_0.png', url: 'https://www.bilibili.com/video/BV1sm4y1w7DM'},
        {name: '10.23图寻每日挑战', cover: 'biz/1666546512018_081aa1446cb145698480f56f9db19fc1_1.png', url: 'https://www.bilibili.com/video/BV1bD4y1r7RF'},
        {name: '震惊！小伙用一张图判断所在国家（10月32日图寻每日挑战）', cover: 'biz/1666546440990_1828cfb5e62a4e0481aeeb77108fc7d7_0.png', url: 'https://www.bilibili.com/video/BV1xG4y1H7eA'},
        {name: '小伙根据一张图判断国家（10月22日图寻每日挑战)', cover: 'biz/1666455338595_c06e4d7ab2f147f9a86e418a8e15363c_0.png', url: 'https://www.bilibili.com/video/BV1ze411V74b'},
        {name: '[炒饭图寻] 东南亚的野外题真的是让人十分为难', cover: 'biz/1666369895706_34bb231901e04d26bbd83499b8ba5c1b_0.png', url: 'https://www.bilibili.com/video/BV1aP4y1U72K'},
        {name: '【炒饭图寻solo】靠纯记忆5000分？', cover: 'biz/1666368152871_587ac6d6814a4138b5904cf75affc192_0.png', url: 'https://www.bilibili.com/video/BV19g41187Bo'},
        {name: '双倍快乐，听我说谢谢你（10月21日图寻每日挑战）', cover: 'biz/1666368016766_96ca8435e1d64bee8fad6346b52a57c1_0.png', url: 'https://www.bilibili.com/video/BV1Nm4y1P7Sz'},
        {name: '震惊！小伙竟分不清泰语与柬埔寨语，这究竟是道德的沦丧还是人性的扭曲', cover: 'biz/1666282434580_3803702ca639468683179e66082e1549_1.png', url: 'https://www.bilibili.com/video/BV1D8411e7Gz'},
        {name: '大数据，你干嘛～啊哈～哎呦～你好烦～ （10月19日图寻每日挑战）', cover: 'biz/1666282381420_fb2fb2f03ebe4489bfa5b5cf64743fa8_1.png', url: 'https://www.bilibili.com/video/BV1ud4y127cH'},
        {name: '10月18日图寻每日挑战 露脸初解说，勉强2万分', cover: 'biz/1666105306246_113c97b1527645be98d69ba0f8140e47_0.png', url: 'https://www.bilibili.com/video/BV1Nm4y1P7Sz'},
        {name: '哼，运气游戏！（10月18日图寻每日挑战）', cover: 'biz/1666105386447_5ce6961ac26c4673b53df36bd8b972c4_0.png', url: 'https://www.bilibili.com/video/BV1g14y1j7J1'},
        {name: '一个正直的小伙不认识邪教很合理吧（10月17日图寻每日挑战）', cover: 'biz/1666036967147_b9cb9c4a47fe418aa25127d0671bf9b4_1.png', url: 'https://www.bilibili.com/video/BV1xt4y1F7PY'},
        {name: '炒饭图寻每日挑战10/16', cover: 'biz/1666037132615_62682012bee744a792692f55b26c25c5_0.png', url: 'https://www.bilibili.com/video/BV11m4y1c7df'},
        {name: '非著名小丑来了（10月16日图寻每日挑战）', cover: 'biz/1666036673496_04e8f0d6fdce4842b9a88d21f1e5702d_0.png', url: 'https://www.bilibili.com/video/BV1pd4y117Lc'},
        {name: '图寻 每日挑战 | 15分钟内找出五个地点 2分钟速答20000分', cover: 'biz/1665856527702_704ac3a286da44289caf4ec194317f1a_0.webp', url: 'https://www.bilibili.com/video/BV1u84y1z7Tq'},
        {name: '原形毕露？回光返照？图寻国家streak挑战！', cover: 'biz/1665856408307_c8fbf37ca1be439cb530d1d6c1cf3510_0.webp', url: 'https://www.bilibili.com/video/BV1ie411L7W9'},
        {name: '不认识上海是我的错吗？！（10月15日图寻每日挑战）', cover: 'biz/1665856318382_c9018e95887047dba224a96281902d71_0.webp', url: 'https://www.bilibili.com/video/BV1XD4y1k7eH'},
        {name: '小伙首次挑战图寻，直呼好爽！（10月14日挑战）', cover: 'biz/1665770090636_e23d05e6e25848e0a99c5a26bc5eaed4_0.webp', url: 'https://www.bilibili.com/video/BV1M8411s7ug'},
        {name: '10月12日图寻每日挑战3分钟速答2万分', cover: 'biz/1665579980139_302b8010aa6e4a69a530b014981b7bfc_0.webp', url: 'https://www.bilibili.com/video/BV1A14y1E71P'},
        {name: '每日五题地理挑战游戏2022年10月10号【炒饭图寻】', cover: 'biz/1665574383610_dcd05466fdcb49b18de214a9c976ef42_0.webp', url: 'https://www.bilibili.com/video/BV1FR4y1R7jB'},
        {name: '炒饭图寻  随机传送到世界上的某地，如何选出大概位置？', cover: 'biz/1665574863776_f56f0bfff84a45d7ba2b1e47bdc9f681_0.webp', url: 'https://www.bilibili.com/video/BV1ee4y1i7em'},
        {name: '当你做了一道地球人都会的题后， 一定会有一道地球人都不会的题等着你', cover: 'biz/1665575510613_fcb281887a3c4b1c970e7b654ae48f0f_0.webp', url: 'https://www.bilibili.com/video/BV1He411j79D'}
      ],
      recommendPagedata: [
        {name: '炒饭网络迷踪 图寻第四届个人赛录播', cover: 'biz/1669133467716_8a2dee97067045af9b2bfa5b3fb4c7c7_0.png', url: 'https://www.bilibili.com/video/BV1E24y1272D'},
        {name: '图寻第三届团体锦标赛录播', cover: 'biz/1667672031165_bafac27ddc8f4d99a5ea004913c99d05_0.png', url: 'https://www.bilibili.com/video/BV1VP411A7b5'},
        {name: 'H.M-炒饭图寻大神，猜国家地址游戏，倾情直播！（录播上）', cover: 'biz/1666799535958_996733eebf9a4834a3f7cc025db3d5dc_0.png', url: 'https://www.bilibili.com/video/BV1hg411z7nT'},
        {name:'街景挑战：图寻竟然有人40连胜 你也来挑战试试',cover: 'biz/1666625855777_9fd11e1920bf468f88c698d0f9c5c410_0.png', url: 'https://www.bilibili.com/video/BV1ig411z7iC' },
        {name:'挑战世界街景，分辨出是哪个国家',cover: 'biz/1666546562290_0ff5cd41cf0b417888ade23e57ddb62c_0.png', url: 'https://www.bilibili.com/video/BV1Ee4y1e7B3' },
        {name:'随机将你扔在世界任何一个地方，你知道自己在哪里吗？——探索世界',cover: 'biz/1666200760653_621b3846c53a45008601ad6c2decbfb2_0.png', url: 'https://www.bilibili.com/video/BV1284y1z786' },
        {name:'非官方解说图寻第三届个人锦标赛（恭喜HM）Pt. 1',cover: 'biz/1666036564211_7cfdf16e1f68425787bcd57f8bfd2732_0.png', url: 'https://bilibili.com/video/BV1Qe4y1j7R1' },
        {name:'图寻第三届个人锦标赛录播',cover: 'biz/1666036472357_1ecdc1dd6d24498bae0d11affb1acb58_0.png', url: 'https://www.bilibili.com/video/BV1AW4y1n7wf' },
        {name:'图寻第二届个人锦标赛录播',cover: 'biz/1665575107534_a7506b339de4404b89ad4ed17258b69c_0.webp', url: 'https://www.bilibili.com/video/BV19e4y1871Q' },
        {name:'图寻第一届个人锦标赛录播1',cover: 'biz/1665575321286_9f85c32bccd2401191aed9e468129888_0.webp', url: 'https://www.bilibili.com/video/BV1Ma41137zr' },
      ],
      coursePagedata: [
        {name: '【图寻小技巧】语言识别： 日耳曼语族（一）', cover: 'biz/1667760389459_e41d6ff239dd4e659fdba8f835e7de06_0.png', url: 'https://www.bilibili.com/video/BV17D4y1s7Hw'},
        {name: '揭秘）最有用也最没用的新手教程', cover: 'biz/1669133595299_06e1299610a54af6865c9203e98dce22_0.png', url: 'https://www.bilibili.com/video/BV1Gd4y1k7K5'},
        {name: '【图寻小技巧】语言识别：罗曼语族（二）', cover: 'biz/1667760389459_e41d6ff239dd4e659fdba8f835e7de06_0.png', url: 'https://www.bilibili.com/video/BV1cd4y1F78U'},
        {name: '【教程】图寻/Geoguessr 海外属地特殊街景车', cover: 'biz/1667672068671_4478361375d24aa9991970ca4d1cd577_0.png', url: 'https://www.bilibili.com/video/BV1TP411A7o2'},
        {name: '【图寻小技巧】语言识别：罗曼语族（一）', cover: 'biz/1667059619190_aeba12ec6fb044158d5273307cb57ba1_0.png', url: 'https://www.bilibili.com/video/BV1b84y1i7iP'},
        {name:'图寻总笔记1.0',cover: 'biz/1665574727065_92d546eddc4a427d9eb503077a34fd06_0.webp', url: 'https://www.bilibili.com/video/BV1Xg411a78m' },
        {name:'这个视频将会双倍你的Geoguessr/图寻能力 历史地理人文知识问答Jetpunk',cover: 'biz/1665856643354_58dc7397ce96424fb1ac053b07cb8737_0.webp', url: 'https://www.bilibili.com/video/BV1VD4y1C7Mr' },
        {name:'美国加拿大独门秘笈（不完全教程） Geoguessr图寻游戏教学',cover: 'biz/1665573905878_ab983dfaa6b14416be4085e1bd63c99c_0.webp', url: 'https://www.bilibili.com/video/BV1sR4y1R7J1' },
      ],
      timer: 0
    }
  },
  created(){
  },
  mounted(){
    let _this = this;
  },
  methods:{
    toLink(url) {
      window.open(url, '_blank');
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
  },
}
</script>
<style scoped lang="scss">
.container{
  position: absolute;
  width: 100%;
  min-height: 120%;
  text-align: center;
  background-color: #090723;
  .nav {
    color: white;
    font-size: 48px;
    font-weight: bold;
    padding-top: 3rem;
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
  section {
    padding-top: 3rem;
    display: block;
  }

  .game_entrance {
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 0 2rem;
    margin: 0 auto;
    max-width: 80rem;
    margin-top: 3rem;
    margin-bottom: 5rem;

    .line {
      width: 100%;
      height: 2px;
      background-color: white;
      margin-bottom: 2rem;
      margin-top: 1rem;
    }
    .first_session_head {
      font-size: 24px;
      color: whitesmoke;
      font-weight: bolder;
    }
    .session_head {
      font-size: 24px;
      color: whitesmoke;
      padding-top: 2rem;
      font-weight: bolder;
    }
    .grid_main {
      display: grid;
      grid-row-gap: 1.5rem;
      grid-column-gap: 1.5rem;
      grid-template-columns: repeat(3, 1fr);

      .card {
        border-radius: 1rem;
        background-color: rgb(25,26,46, 0.9);
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: 100%;
        box-sizing: border-box;
        box-radius: 1rem;
        flex-direction: column;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        padding: 4rem;
        min-height: 110px;
        .title {
          font-size: 20px;
          color: white;
          font-weight: 700;
          padding-bottom: 0.2rem;
        }
        .describe {
          color: yellow;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .players {
          color: white;
          font-size: 1px;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
      }
    }
  }
}


@media only screen and (max-width: 768px) {
  .container {
    .game_entrance {
      .grid_main {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  }
}
</style>
