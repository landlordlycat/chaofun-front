// 导出新组件
import Cookies from 'js-cookie'

import Vue from 'vue'
// import login from '@/components/chaofan/common/login/login.js'

// Vue.prototype.$login = login

export default {
  props: {

  },
  data() {
    return {
      imgOrigin: 'https://i.chao-fan.com/',
      defaultUserIcon: 'f58b7f52d7c801ba0806e2125a776a44.png',
      ISPHONE: document.body.clientWidth > 678 &&  document.body.clientWidth > document.body.clientHeight ? false : true,
      imgMaxWidth: document.body.clientWidth - 100,
      clientWidth: document.body.clientWidth,
      clientHeight: document.body.clientHeight,
      isiOS: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      isAndroid: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1,
      scrollHeight: document.body.clientHeight - 0,
      opened: true,
      humanizeTimeFormat: true,
      // login: login
    };
  },
  watch: {
    '$store.getters.sidebar.opened'(v, n) {
      this.opened = v;
    }
  },

  mounted() {
    // console.log(this.$store.getters.sidebar.opened,666);
    // console.log(this.ISPHONE)
    // var u = navigator.userAgent;
    // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    document.addEventListener('gesturestart', function (event) {
      event.preventDefault();
      console.log('gesturestart')
    });

    // console.log(document.getElementsByClassName('nav_con').clientHeight)
  },
  methods: {
    toPost(id, name, icon, isNew = true) { // 发帖
      // TODO: 移除旧版
      if (this.$store.state.user.islogin) {
        console.log('ssss');
        if (isNew) {
          // 新版
          const path = id ? `/f/${id}/submit` : '/f/submit';
          this.$router.push({ path });
          return;
        }
        // 旧版
        this.$router.push({ path: '/submit', query: { id: id, name: name, icon: icon } })
      } else {
        this.$login({
          callBack: () => {
            this.$store.dispatch('user/getInfo')
          }
        });
      }
    },
    showLogin(logStatus) {
      this.$login({
        logStatus: logStatus||'login',
        callBack: () => {
          this.$store.dispatch('user/getInfo')
        }
      });
    },
    reFresh() {
      location.reload()
    },
    toUser(userInfo) {
      localStorage.removeItem('storedata')
      localStorage.removeItem('spage')
      if (userInfo) {
        if (this.$route.path.includes('/user/')) {
          localStorage.setItem('whichOne', 'pub');
        }
        window.open('/user/' + userInfo.userId.toString(), '_blank')
        // this.$router.push({name: 'userhome',params:{id: userInfo.userId,userInfo}})
      }
    },
    toForum(item){
      try {
        window.flutter_inappwebview.callHandler('toAppForum',{forumId: item.id+''})
      } catch (e) {
        window.open(location.origin + '/f/'+item.id,"_blank");
      }
    },
    toUserById(userInfo) {
      localStorage.removeItem('storedata')
      localStorage.removeItem('spage')
      if (userInfo) {
        if (this.$route.path.includes('/user/')) {
          localStorage.setItem('whichOne', 'pub');
        }
        window.open('/user/' + id, '_blank')
        // this.$router.push({name: 'userhome',params:{id: userInfo.userId,userInfo}})
      }
    },

    toSearch() {
      if (this.$route.path == 'search') {

      } else {
        this.$router.push({ name: 'search', query: { q: this.keyword } })
      }
    },
    // doSpan(t) {
    //   // 1024
    // },
    toPosition() {
      if (this.$route.query.time) {
        this.$('.infinite-list').animate({ scrollTop: localStorage.getItem('storedata') ? JSON.parse(localStorage.getItem('storedata')).top : 0 }, 0);
        setTimeout(() => {
          localStorage.removeItem('storedata')
          localStorage.removeItem('spage')
        }, 1000)
      } else {
        localStorage.removeItem('storedata')
        localStorage.removeItem('spage')
      }
    },
    doTheme(v) {
      let obj = {}
      let styles = this.$store.state.settings.styles
      if (styles.bodyStyle.type == 'open') {
        obj.backgroundColor = 'transparent';
      }
      if (v == 'bodyStyle' && styles.bodyStyle.type == 'open') {
        return Object.assign(obj, styles.bodyStyle);
      } else if (v == 'contentStyle') {
        if (styles.contentStyle.type == 'open') {
          return Object.assign({}, styles.contentStyle)
        } else {
          return Object.assign(obj)
        }
      } else if (v == 'sidebarStyle') {
        if (styles.sidebarStyle.type == 'open') {
          return Object.assign({}, styles.sidebarStyle)
        } else {
          return Object.assign(obj)
        }
      } else if (v == 'navbarStyle') {
        if (styles.navbarStyle.type == 'open') {
          return Object.assign({}, styles.navbarStyle)
        } else {
          return Object.assign(obj)
        }
      }

    },
    canUseWebP() {
      if(window.MSStream){
        // There is some iOS in Windows Phone...
        // https://msdn.microsoft.com/en-us/library/hh869301(v=vs.85).aspx
        return true;
      }

      var match = (navigator.userAgent).match(/OS (\d+)_(\d+)_?(\d+)?/),
          version;

      if (match !== undefined && match !== null) {
        version = [
          parseInt(match[1], 10),
          parseInt(match[2], 10),
          parseInt(match[3] || 0, 10)
        ];
        // console.log( parseFloat(version.join('.')))
        return parseFloat(version.join('.')) >= 13.9999;
      }

      return true;
    },
    doLoginStatus() { // 判断是否登录
      return new Promise((resolve, reject) => {
        if (this.$store.state.user.islogin) {
          resolve(true)
        } else {
          this.$login({
            callBack: () => {
              this.$store.dispatch('user/getInfo')
            }
          });
          resolve(false)
        }
      })
    },
    doSsoLogin() {
      return new Promise((resolve, reject) => {
        if (this.$store.state.user.islogin) {
          resolve(true)
        } else {
          this.$login({
            callBack: () => {
              this.$store.dispatch('webview/oauth')
            },
          });
          resolve(false)
        }
      })
    },
    toUrl(query) {
      if (query.routeType == 1) {
        window.open(query.url, '_blank')
      } else {
        this.$router.push(query);
      }
    },
    doSpan() { // 主区域布局
      let winWidth = document.body.clientWidth
      if (winWidth > 1200 && winWidth < 1500) {

      }
    },
    doSpanMain() {
      // let opened = Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true
      let opened = this.opened;
      let winWidth = document.body.clientWidth
      let sideBarWidth = opened ? 240 : 54
      let contentWidth = winWidth - sideBarWidth;
      return Math.ceil(contentWidth / winWidth * 24)
      // return Math.floor(((winWidth - this.doWidth() / 24.0 * contentWidth) / 2 - sideBarWidth) / (contentWidth) * 24)
    },
    doOffSet() {
      let opened = Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true
      let winWidth = document.body.clientWidth
      let sideBarWidth = opened ? 240 : 54
      let contentWidth = winWidth - sideBarWidth;
      return Math.floor(((winWidth - this.doWidth() / 24.0 * contentWidth) / 2 - sideBarWidth) / (contentWidth) * 24)
    },
    doWidth() {
      // let opened = Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true
      // let sideBarWidth = opened ? 240 : 54
      // let winWidth = document.body.clientWidth - sideBarWidth
      // return Math.ceil(640.0 / winWidth  * 24)
      let opened = this.$store.getters.sidebar.opened;
      let winWidth = (opened ? document.body.clientWidth : (document.body.clientWidth - 54))
      let sideBarWidth = opened ? 240 : (54)
      let contentWidth = winWidth - sideBarWidth;
      return Math.ceil(contentWidth / winWidth * 24)
    },
    doRightStyle() {
      // let opened = Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true
      let winWidth = document.body.clientWidth;
      let right = (winWidth - 640) / 2 - 350 + 80;
      return {
        'right': right + 'px'
      }
    },
    doLeftStyle() {
      // let opened = Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true
      let opened = this.$store.getters.sidebar.opened;
      let winWidth = document.body.clientWidth;
      let right = (winWidth - 640) / 2 - (opened ? 310 : 290) - 70;
      return {
        'left': right + 'px'
      }
    },
    doTagLeftStyle() {
      // let opened = Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true
      let opened = this.$store.getters.sidebar.opened;
      let winWidth = document.body.clientWidth;
      let right = (winWidth - 640) / 2;

      return {
        'left': right - 170 + 'px'
      }
    },
    doRightOffset() {
      return (this.doOffSet() + this.doWidth())
    }
  }
};
