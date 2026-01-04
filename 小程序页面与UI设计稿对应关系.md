# 小程序页面与UI设计稿对应关系

## 页面对应表

| 页面名称 | 页面路径 | UI设计稿 (default) | UI设计稿 (dark) |
|---------|----------|-------------------|-----------------|
| **最新** | `pages/index/index` | `最新-default.svg/png` | `最新-dark.svg/png` |
| **合集** | `pages/topics/topics` | `合集1-default.svg/png`<br>`合集2-default.svg/png`<br>`合集3-default.svg/png`<br>`合集4-搜索-default.svg/png` | `合集2-dark.svg/png`<br>`合集3-dark.svg/png`<br>`合集4-搜索-dark.svg/png` |
| **提问/社区** | `pages/community/community` | `提问1-default.svg/png`<br>`提问2-筛选-default.svg/png` | `提问1-dark.svg/png`<br>`提问2-筛选-dark.svg/png` |
| **我的** | `pages/profile/profile` | `我的-default.svg/png` | `我的-dark.svg/png` |
| **文章阅读** | `pages/article/article` | `文章阅读1-default.svg/png`<br>`文章阅读2-default.svg/png`<br>`文章阅读3-default.svg/png`<br>`文章阅读4-default.svg/png`<br>`文章阅读5-default.svg/png`<br>`文章阅读6-default.svg/png` | `文章阅读1-dark.svg/png`<br>`文章阅读2-dark.svg/png`<br>`文章阅读3-dark.svg/png`<br>`文章阅读4-dark.svg/png`<br>`文章阅读5-dark.svg/png`<br>`文章阅读6-dark.svg/png` |
| **登录** | `pages/auth/auth` | `登录1.svg/png`<br>`登录2.svg/png`<br>`登录3.svg/png`<br>`登录4.svg/png`<br>`登录5.svg/png`<br>`登录6.svg/png` | - |
| **消息** | `pages/messages/messages` | `我的消息1-评论-default.svg/png`<br>`我的消息2-评论-default.svg/png`<br>`我的消息3-系统消息-default.svg/png`<br>`我的消息4-系统消息-default.svg/png` | `我的消息1-评论-dark.svg/png`<br>`我的消息2-评论-dark.svg/png`<br>`我的消息3-系统消息-dark.svg/png`<br>`我的消息4-系统消息-dark.svg/png` |
| **我的收藏** | `pages/favorites/favorites` | `我的收藏1-default.svg/png`<br>`我的收藏2-default.svg/png`<br>`随缘-收藏-default.svg/png` | `我的收藏1-dark.svg/png`<br>`随缘-收藏-dark.svg/png` |
| **浏览历史** | `pages/history/history` | `浏览记录-default.svg/png` | `浏览记录-dark.svg/png` |
| **支付/购买** | `pages/payments/payments` | `购买卡片1-default.svg/png`<br>`购买卡片2-default.svg/png`<br>`购买卡片3-default.svg/png`<br>`购买卡片4-default.svg/png`<br>`购买卡片5-default.svg/png` | `购买卡片1-dark.svg/png`<br>`购买卡片2-dark.svg/png`<br>`购买卡片3-dark.svg/png`<br>`购买卡片4-dark.svg/png`<br>`购买卡片5-dark.svg/png` |
| **个人信息** | `pages/profile-info/profile-info` | `我的信息-default.svg/png` | `我的信息-dark.svg/png` |
| **设置** | `pages/profile-settings/profile-settings` | `设置-default.svg/png` | `设置-dark.svg/png` |
| **付款记录** | `pages/profile-payments/profile-payments` | `付款记录-default.svg/png` | `付款记录-dark.svg/png` |
| **关于** | `pages/profile-about/profile-about` | `关于-default.svg/png` | `关于-dark.svg/png` |
| **启动页** | `pages/splash/splash` | - | - |
| **阅读统计** | `pages/profile-reading/profile-reading` | - | - |

## 公共组件对应表

| 组件名称 | 组件路径 | UI设计稿 |
|---------|----------|----------|
| **底部Tab栏** | `components/tab-bar/` | `Component 6.svg` |

### Component 6.svg 底部Tab栏说明

包含4个标签图标（已开发）：

| 序号 | 标签名 | 图标 | 跳转页面 | 图标文件 |
|-----|-------|------|---------|---------|
| 1 | 启发 | 闪电 | `pages/index/index` | `tab-inspire-active/inactive.svg` |
| 2 | 消息 | 铃铛 | `pages/messages/messages` | `tab-message-active/inactive.svg` |
| 3 | 我的 | 多用户 | `pages/community/community` | `tab-users-active/inactive.svg` |
| 4 | 我的 | 单用户 | `pages/profile/profile` | `tab-profile-active/inactive.svg` |

## 其他UI资源

| 类型 | 文件 |
|------|------|
| **Logo** | `logo.svg`, `logo-white.svg`, `logo_horizontal_black.png`, `logo_horizontal_white.png`, `logo_vertical_black.png`, `logo_vertical_white.png` |
| **分享卡片** | `分享卡片1.svg`, `分享卡片2.svg`, `分享卡片-1~4.png` |
| **小程序卡片** | `小程序卡片.svg/png`, `小程序卡片-1~3.svg` |
| **分享尺寸** | `3：4竖版 适合图片分享.png`, `5：4横版 适合文字分享.png` |

## 目录说明

- **页面目录**: `/Users/changpengcheng/MT/moti-miniprogram/pages/`
- **UI设计稿目录**: `/Users/changpengcheng/MT/ui/`

## 命名规则

- `xxx-default.svg/png`: 浅色模式设计稿
- `xxx-dark.svg/png`: 深色模式设计稿
- 数字后缀 (如 `文章阅读1`, `文章阅读2`): 表示同一页面的不同状态或场景
