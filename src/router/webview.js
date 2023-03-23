let routes = [];
routes = [
  {
    path: '/webview/contact',
    component: () => import('@/views/chaofun-webview/contact'),
    name: 'contact',
    meta: { title: '联系我们&意见反馈'},
    hidden: true
  },
  {
    path: '/webview/cancelAccount',
    component: () => import('@/views/chaofun-webview/cancelAccount'),
    name: 'contact',
    meta: { title: '注销账号'},
    hidden: true
  },
  {
    path: '/webview/buttonGame',
    component: () => import('@/views/chaofun-webview/buttonGame'),
    name: 'buttonGame',
    meta: { title: 'buttonGame'},
    hidden: true
  },
  {
    path: '/webview/forum/seting',
    component: () => import('@/views/chaofun-webview/forum/setting'),
    name: 'forumseting',
    meta: { title: 'forumseting'},
    hidden: true
  },
  {
    path: '/webview/forum/mod_manager',
    component: () => import('@/views/chaofun-webview/forum/ModManager'),
    name: 'mod_manager',
    meta: { title: '版主管理'},
    hidden: true
  },
  {
    path: '/webview/forum/ban_manager',
    component: () => import('@/views/chaofun-webview/forum/BanManager'),
    name: 'ban_manager',
    meta: { title: '用户封禁'},
    hidden: true
  },
  {
    path: '/webview/forum/sensitive_word_manager',
    component: () => import('@/views/chaofun-webview/forum/SensitiveWord'),
    name: 'sensitive_word_manager',
    meta: { title: '敏感词管理'},
    hidden: true
  },
  {
    path: '/webview/forum/table_manager',
    component: () => import('@/views/chaofun-webview/forum/TableManager'),
    name: 'TableManager',
    meta: { title: '表格管理'},
    hidden: true
  },
  {
    path: '/webview/forum/analytics',
    component: () => import('@/views/chaofun-webview/forum/analytics'),
    name: 'forumanalytics',
    meta: { title: 'forumanalytics'},
    hidden: true
  },
  {
    path: '/webview/forum/log',
    component: () => import('@/views/chaofun-webview/forum/ForumLog'),
    name: 'ForumLog',
    meta: { title: '版块日志'},
    hidden: true
  },
  {
    path: '/webview/forum/tag',
    component: () => import('@/views/chaofun-webview/forum/tag'),
    name: 'forumtag',
    meta: { title: 'forumtag'},
    hidden: true
  },
  {
    path: '/webview/forum/user_tag',
    component: () => import('@/views/chaofun-webview/forum/userTag'),
    name: 'forumUsertag',
    meta: { title: 'forumUsertag'},
    hidden: true
  },
  {
    path: '/webview/forum/auto_replay',
    component: () => import('@/views/chaofun-webview/forum/AutoReply'),
    name: 'auto_replay',
    meta: { title: '自动回复设置'},
    hidden: true
  },
  {
    path: '/webview/forum/badge',
    component: () => import('@/views/chaofun-webview/forum/BadgeManager'),
    name: 'badge',
    meta: { title: '徽章管理'},
    hidden: true
  },
  {
    path: '/webview/forum/rule',
    component: () => import('@/views/chaofun-webview/forum/rule'),
    name: 'forumRule',
    meta: { title: '版块规范设置'},
    hidden: true
  },
  {
    path: '/webview/forum/show_rule',
    component: () => import('@/views/chaofun-webview/forum/showRule'),
    name: 'forumRule',
    meta: { title: '版块规范设置'},
    hidden: true
  },
  {
    path: '/webview/thx',
    component: () => import('@/views/chaofun-webview/thx/thx'),
    name: 'forumthx',
    meta: { title: 'forumthx'},
    hidden: true
  },
  {
    path: '/webview/forum/notify',
    component: () => import('@/views/chaofun-webview/forum/notify'),
    name: 'forumnotify',
    meta: { title: 'forumnotify'},
    hidden: true
  },
  {
    path: '/webview/activity/index',
    component: () => import('@/views/chaofun-webview/activity/index'),
    name: 'activityindex',
    meta: { title: 'activityindex'},
    hidden: true
  },
  {
    path: '/webview/prediction/rank',
    component: () => import('@/views/chaofun-webview/prediction/rank'),
    name: 'prediction_rank',
    meta: { title: '竞猜活动'},
    hidden: true
  },
  {
    path: '/webview/badge',
    component: () => import('@/views/chaofun-webview/badge/badgeDetail'),
    name: 'badge',
    meta: { title: '徽章介绍'},
    hidden: true
  },
  {
    path: '/webview/badge/setting',
    component: () => import('@/views/chaofun-webview/badge/BadgeSetting'),
    name: 'badge_setting',
    meta: { title: '徽章显示设置'},
    hidden: true
  },
  {
    path: '/webview/fbi',
    component: () => import('@/views/chaofun-webview/fbi/fbi'),
    name: 'fbi',
    meta: { title: 'Fbi'},
    hidden: true
  },
  {
    path: '/webview/report',
    component: () => import('@/views/chaofun-webview/report/report'),
    name: 'report',
    meta: { title: '举报处理'},
    hidden: true
  },
  {
    path: '/webview/donate',
    component: () => import('@/views/chaofun-webview/donate/donate'),
    name: 'donate',
    meta: { title: '众筹'},
    hidden: true
  },
  {
    path: '/webview/fbi/order',
    component: () => import('@/views/chaofun-webview/fbi/order'),
    name: 'order',
    meta: { title: '下单'},
    hidden: true
  },
  {
    path: '/webview/fbi/history',
    component: () => import('@/views/chaofun-webview/fbi/FBiHistory'),
    name: 'fbi',
    meta: { title: 'Fbi'},
    hidden: true
  },

  {
    path: '/webview/fbi/redPacket',
    component: () => import('@/views/chaofun-webview/fbi/RedPacket'),
    name: 'FBi 红包',
    meta: { title: 'FBi 红包'},
    hidden: true
  },

  {
    path: '/webview/fbi/redPackt',
    component: () => import('@/views/chaofun-webview/fbi/RedPackt'),
    name: 'FBi 红包',
    meta: { title: 'FBi 红包'},
    hidden: true
  },

  {
    path: '/webview/fbi/redPacket/create',
    component: () => import('@/views/chaofun-webview/fbi/RedPacketCreate'),
    name: 'FBi 红包创建',
    meta: { title: 'FBi 红包创建'},
    hidden: true
  },
  // {
  //   path: '/webview/fbi/redPacket/password',
  //   component: () => import('@/views/chaofun-webview/fbi/RedPacketPassword'),
  //   name: 'FBi 红包',
  //   meta: { title: 'FBi 红包'},
  //   hidden: true
  // },
  {
    path: '/webview/OAuth',
    component: () => import('@/views/chaofun-webview/OAuth'),
    name: '登录-炒饭',
    meta: { title: '登录-炒饭'},
    hidden: true
  },
  {
    path: '/webview/Year2021',
    component: () => import('@/views/chaofun-webview/year2021/year2021'),
    name: 'year2021',
    meta: { title: '我的炒饭2021'},
    hidden: true
  },
  {
    path: '/webview/buttonGame/rank',
    component: () => import('@/views/chaofun-webview/buttonGame/rank'),
    name: 'rank',
    meta: { title: 'rank'},
    hidden: true
  },
  {
    path: '/webview/secret',
    component: () => import('@/views/chaofun-webview/secret/index'),
    name: 'webViewSecret',
    meta: { title: 'secret'},
    hidden: true
  },
  {
    path: '/tuxun/random',
    component: () => import('@/views/tuxun/RandomStreetView'),
    name: 'tuxun-random',
    meta: { title: '图寻-随机街景'},
    hidden: true
  },
  {
    path: '/tuxun/wonders',
    component: () => import('@/views/tuxun/wonders'),
    name: 'tuxun-wonders',
    meta: { title: '图寻-街景奇观'},
    hidden: true
  },

  {
    path: '/tuxun/wonders-filter',
    component: () => import('@/views/tuxun/wonders-filter'),
    name: 'tuxun-wonders-filter',
    meta: { title: '图寻-街景奇观审核'},
    hidden: true
  },
  {
    path: '/tuxun/my_maps',
    component: () => import('@/views/tuxun/MyMaps'),
    meta: { title: '自建题库-图寻'},
    hidden: true
  },
  {
    path: '/tuxun/maps_create',
    component: () => import('@/views/tuxun/MapsCreate'),
    meta: { title: '创建题库-图寻'},
    hidden: true
  },
  {
    path: '/tuxun/maps_modify',
    component: () => import('@/views/tuxun/MapsModify'),
    meta: { title: '修改题库-图寻'},
    hidden: true
  },
  {
    path: '/tuxun',
    component: () => import('@/views/tuxun/TXNewHome'),
    name: '图寻首页',
    meta: { title: '图寻首页'},
    hidden: true
  },
  {
    path: '/tuxun/streak',
    component: () => import('@/views/tuxun/TXStreak'),
    name: '图寻首页',
    meta: { title: '图寻首页'},
    hidden: true
  },
  {
    path: '/tuxun/guoqing',
    component: () => import('@/views/tuxun/TuxunGuoQing'),
    name: '图寻国庆活动',
    meta: { title: '图寻国庆活动'},
    hidden: true
  },
  {
    path: '/tuxun/streak_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻连胜',
    meta: { title: '图寻连胜'},
    hidden: true
  },
  {
    path: '/tuxun/guoqing_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻国庆活动',
    meta: { title: '图寻国庆活动'},
    hidden: true
  },
  {
    path: '/tuxunNewMap',
    component: () => import('@/views/tuxun/TXNewMap'),
    name: '图寻首页',
    meta: { title: '图寻首页'},
    hidden: true
  },
  {
    path: '/tuxun/main_game',
    component: () => import('@/views/tuxun/TXHome'),
    name: '图寻',
    meta: { title: '图寻'},
    hidden: true
  },
  {
    path: '/tuxun/daily_challenge',
    component: () => import('@/views/tuxun/DailyChallenge'),
    name: '图寻每日挑战',
    meta: { title: '图寻-每日挑战'},
    hidden: true
  },
  {
    path: '/tuxun/solo_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻邀请PK',
    meta: { title: '图寻邀请PK'},
    hidden: true
  },
  {
    path: '/tuxun/party',
    component: () => import('@/views/tuxun/party'),
    name: '图寻派对',
    meta: { title: '图寻派对'},
    hidden: true
  },
  {
    path: '/tuxun/join',
    component: () => import('@/views/tuxun/join'),
    name: '图寻派对',
    meta: { title: '图寻派对'},
    hidden: true
  },
  {
    path: '/solo_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻邀请PK',
    meta: { title: '图寻邀请PK'},
    hidden: true
  },
  {
    path: '/team_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻邀请PK',
    meta: { title: '图寻邀请PK'},
    hidden: true
  },
  {
    path: '/tuxun/team_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻邀请PK',
    meta: { title: '图寻邀请PK'},
    hidden: true
  },
  {
    path: '/challenge',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻挑战',
    meta: { title: '图寻挑战'},
    hidden: true
  },
  {
    path: '/tuxun/challenge',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻挑战',
    meta: { title: '图寻挑战'},
    hidden: true
  },
  {
    path: '/maps_game',
    component: () => import('@/views/tuxun/TXHome'),
    name: '练习赛',
    meta: { title: '练习赛'},
    hidden: true
  },
  {
    path: '/tuxun/maps_game',
    component: () => import('@/views/tuxun/TXHome'),
    name: '练习赛',
    meta: { title: '练习赛'},
    hidden: true
  },
  {
    path: '/scratch/home',
    component: () => import('@/views/scratch/HomePage'),
    name: 'scratch',
    meta: { title: '小测验-炒饭'},
    hidden: true
  },
  {
    path: '/scratch/tag',
    component: () => import('@/views/scratch/TagPage'),
    name: 'TagPage',
    meta: { title: 'TagPage'},
    hidden: true
  },
  {
    path: '/scratch',
    component: () => import('@/views/scratch/HomePage'),
    name: 'scratch',
    meta: { title: '小测验-炒饭'},
    hidden: true
  },
  {
    path: '/scratch/guess',
    component: () => import('@/views/scratch/GamePage'),
    name: 'scratch_game',
    meta: { title: '小测验-炒饭'},
    hidden: true
  },
  {
    path: '/scratch/create',
    component: () => import('@/views/scratch/Create'),
    name: 'scratch_create',
    meta: { title: '小测验创建-炒饭'},
    hidden: true
  },
  {
    path: '/scratch/search',
    component: () => import('@/views/scratch/SearchPage'),
    name: 'scratch_search',
    meta: { title: '小测验搜索-炒饭'},
    hidden: true
  },
  {
    path: '/scratch/choose-create',
    component: () => import('@/views/scratch/choose-create'),
    name: 'choose-create',
    meta: { title: '小测验创建-炒饭'},
    hidden: true
  },
  {
    path: '/scratch/modify',
    component: () => import('@/views/scratch/Create'),
    name: 'scratch_modify',
    meta: { title: '小测验修改-炒饭'},
    hidden: true
  },
  {
    path: '/tuxun/home',
    component: () => import('@/views/tuxun/TXNewHome'),
    name: 'tuxun',
    meta: { title: 'tuxun'},
    hidden: true
  },
  {
    path: '/live',
    component: () => import('@/views/live/test'),
    name: 'live',
    meta: { title: 'live'},
    hidden: true
  },
  {
    path: '/tuxun/rank',
    component: () => import('@/views/tuxun/rank'),
    name: 'rank',
    meta: { title: '积分排行-图寻'},
    hidden: true
  },
  {
    path: '/tuxun/maps',
    component: () => import('@/views/tuxun/maps'),
    name: 'maps',
    meta: { title: '练习赛-图寻'},
    hidden: true
  },
  {
    path: '/tuxun/maps_distribute',
    component: () => import('@/views/tuxun/MapsDistribute'),
    name: 'maps_distribute',
    meta: { title: '题库题目分布'},
    hidden: true
  },
  {
    path: '/tuxun/replay',
    component: () => import('@/views/tuxun/Replay'),
    name: 'maps',
    meta: { title: '复盘-图寻'},
    hidden: true
  },
  {
    path: '/tuxun/replay_pano',
    component: () => import('@/views/tuxun/ReplayPanorama'),
    name: 'maps',
    meta: { title: '复盘街景-图寻'},
    hidden: true
  },
  {
    path: '/tuxun/maps_detail',
    component: () => import('@/views/tuxun/MapsDetail'),
    name: 'maps',
    meta: { title: '题库详情-图寻'},
    hidden: true
  },
  {
    path: '/tuxun/publicity',
    component: () => import('@/views/tuxun/publicity'),
    name: '外宣',
    meta: { title: '图寻-直播/视频/教程'},
    hidden: true
  },
  {
    path: '/tuxun/wxPay',
    component: () => import('@/views/tuxun/pay'),
    name: '图寻-支付',
    meta: { title: '图寻-支付'},
    hidden: true
  },
  {
    path: '/wxPay',
    component: () => import('@/views/tuxun/pay'),
    name: '图寻支付',
    meta: { title: '图寻-支付'},
    hidden: true
  },
  {
    path: '/tuxun/wxRedirect',
    component: () => import('@/views/tuxun/WXRedirect'),
    name: '图寻重定向',
    meta: { title: '图寻重定向'},
    hidden: true
  },
  {
    path: '/tuxun/random',
    component: () => import('@/views/tuxun/RandomStreetView'),
    name: '随机街景',
    meta: { title: '随机街景'},
    hidden: true
  },
  {
    path: '/tuxun/googleTest',
    component: () => import('@/views/tuxun/GoogleTest'),
    name: '',
    meta: { title: ''},
    hidden: true
  },
  {
    path: '/tuxun/user/:id',
    component: () => import('@/views/tuxun/profile'),
    name: 'tuxunProfile',
    meta: { title: '',keepAlive: true,},
    hidden: true
  },
  {
    path: '/scratch/user/:id',
    component: () => import('@/views/scratch/profile'),
    name: 'scratch-profile',
    meta: { title: '用户首页',keepAlive: true,},
    hidden: true
  },
  {
    path: '/tuxun/admin',
    component: () => import('@/views/tuxun/admin-console'),
    name: 'tuxun-admin-console',
    meta: { title: '图寻-管理'},
    hidden: true
  },
  {
    path: '/tuxunAdmin',
    component: () => import('@/views/tuxun/admin-console'),
    name: 'tuxun-admin-console',
    meta: { title: '图寻-管理'},
    hidden: true
  },
  {
    path: '/tuxun/pano-filter',
    component: () => import('@/views/tuxun/TXAdmin'),
    name: 'tuxun-pano-filter',
    meta: { title: '图寻-街景审核'},
    hidden: true
  },
  {
    path: '/tuxunFilter',
    component: () => import('@/views/tuxun/TuxunFilter'),
    name: 'tuxunFilter',
    meta: { title: 'tuxunFilter'},
    hidden: true
  },

  {
    path: '/webview/forumIntro',
    component: () => import('@/views/activity/help/forumIntro'),
    name: 'webViewForumIntro',
    meta: { title: '版主介绍'},
    hidden: true
  },
  {
    path: '/webview/agreement',
    component: () => import('@/views/chaofun-webview/agreement/agreement'),
    name: 'webViewForumIntro',
    meta: { title: '炒饭隐私政策'},
    hidden: true
  },
  {
    path: '/webview/useragree',
    component: () => import('@/views/chaofun-webview/agreement/useragree'),
    name: 'webViewForumIntro',
    meta: { title: '炒饭用户协议'},
    hidden: true
  },
]

export default  routes;
