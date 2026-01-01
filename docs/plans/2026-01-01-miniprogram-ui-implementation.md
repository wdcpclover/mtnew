# 小程序 UI 重构实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 根据 ui_design 设计稿重构小程序 UI，保留 API 逻辑，支持深色/浅色双主题。

**Architecture:** 使用 CSS 变量实现主题切换，抽取 11 个通用组件供页面复用，保留现有 utils/api.js 不动。

**Tech Stack:** 微信小程序原生开发（WXML/WXSS/JS）

---

## 阶段 1：基础设施

### Task 1: 更新主题变量系统

**Files:**
- Modify: `moti-miniprogram/app.wxss:1-30`

**Step 1: 扩展 CSS 变量定义**

将 `app.wxss` 开头的变量定义替换为更完整的版本：

```css
/* 全局样式 */
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

/* 浅色主题变量（默认） */
page {
  /* 背景色 */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --bg-tertiary: #FAFAFA;
  --bg-card: #FFFFFF;

  /* 文字色 */
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --text-placeholder: #CCCCCC;

  /* 主题色 */
  --accent-color: #C99C00;
  --accent-light: #FFF8E1;
  --accent-dark: #A68200;

  /* 边框 */
  --border-color: #EEEEEE;
  --divider-color: #F0F0F0;

  /* 功能色 */
  --success-color: #52C41A;
  --warning-color: #FAAD14;
  --error-color: #FF4D4F;

  /* 阴影 */
  --shadow-sm: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
}

/* 深色主题变量 */
page.dark {
  /* 背景色 */
  --bg-primary: #1A1A1A;
  --bg-secondary: #242424;
  --bg-tertiary: #2A2A2A;
  --bg-card: #2A2A2A;

  /* 文字色 */
  --text-primary: #FFFFFF;
  --text-secondary: #AAAAAA;
  --text-tertiary: #666666;
  --text-placeholder: #555555;

  /* 主题色 */
  --accent-color: #C99C00;
  --accent-light: #3D3520;
  --accent-dark: #E5B300;

  /* 边框 */
  --border-color: #333333;
  --divider-color: #2F2F2F;

  /* 功能色 */
  --success-color: #73D13D;
  --warning-color: #FFC53D;
  --error-color: #FF7875;

  /* 阴影 */
  --shadow-sm: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4rpx 16rpx rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 8rpx 24rpx rgba(0, 0, 0, 0.4);
}
```

**Step 2: 验证主题变量**

在微信开发者工具中预览，检查页面背景色是否正确应用。

**Step 3: 提交**

```bash
git add moti-miniprogram/app.wxss
git commit -m "style: 扩展 CSS 主题变量系统"
```

---

### Task 2: 创建 nav-bar 组件

**Files:**
- Create: `moti-miniprogram/components/nav-bar/nav-bar.wxml`
- Create: `moti-miniprogram/components/nav-bar/nav-bar.wxss`
- Create: `moti-miniprogram/components/nav-bar/nav-bar.js`
- Create: `moti-miniprogram/components/nav-bar/nav-bar.json`

**Step 1: 创建组件目录**

```bash
mkdir -p moti-miniprogram/components/nav-bar
```

**Step 2: 创建 nav-bar.json**

```json
{
  "component": true
}
```

**Step 3: 创建 nav-bar.wxml**

```xml
<view class="nav-bar {{transparent ? 'transparent' : ''}}" style="padding-top: {{statusBarHeight}}px;">
  <view class="nav-bar-content" style="height: {{navBarHeight}}px;">
    <!-- 左侧 -->
    <view class="nav-bar-left">
      <view wx:if="{{showBack}}" class="nav-bar-btn" bindtap="onBack">
        <image src="/images/arrow-left.svg" class="nav-bar-icon" mode="aspectFit" />
      </view>
      <slot name="left"></slot>
    </view>

    <!-- 标题 -->
    <view class="nav-bar-title">
      <text wx:if="{{title}}">{{title}}</text>
      <slot name="title"></slot>
    </view>

    <!-- 右侧 -->
    <view class="nav-bar-right">
      <slot name="right"></slot>
    </view>
  </view>
</view>

<!-- 占位元素 -->
<view wx:if="{{!transparent}}" class="nav-bar-placeholder" style="height: {{statusBarHeight + navBarHeight}}px;"></view>
```

**Step 4: 创建 nav-bar.wxss**

```css
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: var(--bg-primary);
  transition: background-color 0.3s;
}

.nav-bar.transparent {
  background-color: transparent;
}

.nav-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
}

.nav-bar-left,
.nav-bar-right {
  display: flex;
  align-items: center;
  min-width: 100rpx;
}

.nav-bar-right {
  justify-content: flex-end;
}

.nav-bar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background-color: var(--bg-secondary);
}

.nav-bar-icon {
  width: 36rpx;
  height: 36rpx;
}

.nav-bar-title {
  flex: 1;
  text-align: center;
  font-size: 34rpx;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-bar-placeholder {
  width: 100%;
}
```

**Step 5: 创建 nav-bar.js**

```javascript
Component({
  options: {
    multipleSlots: true
  },

  properties: {
    title: {
      type: String,
      value: ''
    },
    showBack: {
      type: Boolean,
      value: true
    },
    transparent: {
      type: Boolean,
      value: false
    }
  },

  data: {
    statusBarHeight: 0,
    navBarHeight: 44
  },

  lifetimes: {
    attached() {
      const systemInfo = wx.getSystemInfoSync()
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight
      })
    }
  },

  methods: {
    onBack() {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        wx.navigateBack()
      } else {
        wx.switchTab({ url: '/pages/index/index' })
      }
    }
  }
})
```

**Step 6: 验证组件**

在微信开发者工具中创建测试页面引用该组件，确认显示正常。

**Step 7: 提交**

```bash
git add moti-miniprogram/components/nav-bar/
git commit -m "feat: 添加 nav-bar 顶部导航组件"
```

---

### Task 3: 创建 tab-bar 组件

**Files:**
- Create: `moti-miniprogram/components/tab-bar/tab-bar.wxml`
- Create: `moti-miniprogram/components/tab-bar/tab-bar.wxss`
- Create: `moti-miniprogram/components/tab-bar/tab-bar.js`
- Create: `moti-miniprogram/components/tab-bar/tab-bar.json`

**Step 1: 创建组件目录**

```bash
mkdir -p moti-miniprogram/components/tab-bar
```

**Step 2: 创建 tab-bar.json**

```json
{
  "component": true
}
```

**Step 3: 创建 tab-bar.wxml**

```xml
<view class="tab-bar safe-area-bottom">
  <view
    class="tab-bar-item {{current === 0 ? 'active' : ''}}"
    bindtap="switchTab"
    data-index="0"
    data-url="/pages/index/index"
  >
    <image
      class="tab-bar-icon"
      src="/images/tab-home{{current === 0 ? '-active' : ''}}.svg"
      mode="aspectFit"
    />
    <text class="tab-bar-label">最新</text>
  </view>

  <view
    class="tab-bar-item {{current === 1 ? 'active' : ''}}"
    bindtap="switchTab"
    data-index="1"
    data-url="/pages/topics/topics"
  >
    <image
      class="tab-bar-icon"
      src="/images/tab-topics{{current === 1 ? '-active' : ''}}.svg"
      mode="aspectFit"
    />
    <text class="tab-bar-label">合集</text>
  </view>

  <view
    class="tab-bar-item {{current === 2 ? 'active' : ''}}"
    bindtap="switchTab"
    data-index="2"
    data-url="/pages/community/community"
  >
    <image
      class="tab-bar-icon"
      src="/images/tab-community{{current === 2 ? '-active' : ''}}.svg"
      mode="aspectFit"
    />
    <text class="tab-bar-label">社区</text>
  </view>

  <view
    class="tab-bar-item {{current === 3 ? 'active' : ''}}"
    bindtap="switchTab"
    data-index="3"
    data-url="/pages/profile/profile"
  >
    <image
      class="tab-bar-icon"
      src="/images/tab-profile{{current === 3 ? '-active' : ''}}.svg"
      mode="aspectFit"
    />
    <text class="tab-bar-label">我的</text>
  </view>
</view>
```

**Step 4: 创建 tab-bar.wxss**

```css
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100rpx;
  background-color: var(--bg-primary);
  border-top: 1rpx solid var(--divider-color);
  z-index: 999;
}

.tab-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
}

.tab-bar-icon {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 4rpx;
}

.tab-bar-label {
  font-size: 22rpx;
  color: var(--text-tertiary);
}

.tab-bar-item.active .tab-bar-label {
  color: var(--accent-color);
}
```

**Step 5: 创建 tab-bar.js**

```javascript
Component({
  properties: {
    current: {
      type: Number,
      value: 0
    }
  },

  methods: {
    switchTab(e) {
      const { index, url } = e.currentTarget.dataset
      if (index === this.properties.current) return

      wx.switchTab({ url })
    }
  }
})
```

**Step 6: 提交**

```bash
git add moti-miniprogram/components/tab-bar/
git commit -m "feat: 添加 tab-bar 底部导航组件"
```

---

### Task 4: 创建 post-card 组件

**Files:**
- Create: `moti-miniprogram/components/post-card/post-card.wxml`
- Create: `moti-miniprogram/components/post-card/post-card.wxss`
- Create: `moti-miniprogram/components/post-card/post-card.js`
- Create: `moti-miniprogram/components/post-card/post-card.json`

**Step 1: 创建组件目录**

```bash
mkdir -p moti-miniprogram/components/post-card
```

**Step 2: 创建 post-card.json**

```json
{
  "component": true
}
```

**Step 3: 创建 post-card.wxml**

```xml
<view class="post-card" bindtap="onTap">
  <view class="post-card-header">
    <image class="post-card-avatar" src="{{post.user.picture || '/images/avatar-default.png'}}" mode="aspectFill" />
    <view class="post-card-info">
      <text class="post-card-author">{{post.user.username || '匿名用户'}}</text>
      <text class="post-card-time">{{post.timestampISO || post.timestamp}}</text>
    </view>
    <view wx:if="{{post.category}}" class="post-card-tag">{{post.category.name || post.category}}</view>
  </view>

  <view class="post-card-title">{{post.title}}</view>

  <view wx:if="{{post.teaser || post.content}}" class="post-card-content">
    {{post.teaser || post.content}}
  </view>

  <view class="post-card-footer">
    <view class="post-card-stat">
      <image src="/images/heart.svg" class="post-card-stat-icon" mode="aspectFit" />
      <text>{{post.upvotes || post.votes || 0}}</text>
    </view>
    <view class="post-card-stat">
      <image src="/images/comment.svg" class="post-card-stat-icon" mode="aspectFit" />
      <text>{{post.postcount || post.replyCount || 0}}</text>
    </view>
    <view class="post-card-stat">
      <image src="/images/eye.svg" class="post-card-stat-icon" mode="aspectFit" />
      <text>{{post.viewcount || 0}}</text>
    </view>
  </view>
</view>
```

**Step 4: 创建 post-card.wxss**

```css
.post-card {
  background-color: var(--bg-card);
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: var(--shadow-sm);
}

.post-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.post-card-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  background-color: var(--bg-secondary);
}

.post-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-card-author {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--text-primary);
}

.post-card-time {
  font-size: 24rpx;
  color: var(--text-tertiary);
  margin-top: 4rpx;
}

.post-card-tag {
  font-size: 22rpx;
  color: var(--accent-color);
  background-color: var(--accent-light);
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

.post-card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 16rpx;
}

.post-card-content {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 24rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-card-footer {
  display: flex;
  align-items: center;
  gap: 48rpx;
}

.post-card-stat {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: var(--text-tertiary);
}

.post-card-stat-icon {
  width: 32rpx;
  height: 32rpx;
  opacity: 0.6;
}
```

**Step 5: 创建 post-card.js**

```javascript
Component({
  properties: {
    post: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTap() {
      const { tid, pid } = this.properties.post
      const id = tid || pid
      if (id) {
        wx.navigateTo({
          url: `/pages/article/article?id=${id}`
        })
      }
    }
  }
})
```

**Step 6: 提交**

```bash
git add moti-miniprogram/components/post-card/
git commit -m "feat: 添加 post-card 帖子卡片组件"
```

---

### Task 5: 创建 loading 组件

**Files:**
- Create: `moti-miniprogram/components/loading/loading.wxml`
- Create: `moti-miniprogram/components/loading/loading.wxss`
- Create: `moti-miniprogram/components/loading/loading.js`
- Create: `moti-miniprogram/components/loading/loading.json`

**Step 1: 创建组件目录**

```bash
mkdir -p moti-miniprogram/components/loading
```

**Step 2: 创建 loading.json**

```json
{
  "component": true
}
```

**Step 3: 创建 loading.wxml**

```xml
<view class="loading-container">
  <!-- 加载中 -->
  <view wx:if="{{status === 'loading'}}" class="loading-content">
    <view class="loading-spinner"></view>
    <text class="loading-text">{{loadingText}}</text>
  </view>

  <!-- 空数据 -->
  <view wx:elif="{{status === 'empty'}}" class="loading-content">
    <image class="loading-image" src="/images/empty.svg" mode="aspectFit" />
    <text class="loading-text">{{emptyText}}</text>
  </view>

  <!-- 加载失败 -->
  <view wx:elif="{{status === 'error'}}" class="loading-content">
    <image class="loading-image" src="/images/error.svg" mode="aspectFit" />
    <text class="loading-text">{{errorText}}</text>
    <view class="loading-retry" bindtap="onRetry">重新加载</view>
  </view>
</view>
```

**Step 4: 创建 loading.wxss**

```css
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-spinner {
  width: 64rpx;
  height: 64rpx;
  border: 4rpx solid var(--border-color);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 24rpx;
}

.loading-text {
  font-size: 28rpx;
  color: var(--text-tertiary);
  margin-top: 24rpx;
}

.loading-retry {
  margin-top: 32rpx;
  padding: 16rpx 48rpx;
  font-size: 28rpx;
  color: var(--accent-color);
  border: 2rpx solid var(--accent-color);
  border-radius: 32rpx;
}
```

**Step 5: 创建 loading.js**

```javascript
Component({
  properties: {
    status: {
      type: String,
      value: 'loading' // loading | empty | error
    },
    loadingText: {
      type: String,
      value: '加载中...'
    },
    emptyText: {
      type: String,
      value: '暂无数据'
    },
    errorText: {
      type: String,
      value: '加载失败'
    }
  },

  methods: {
    onRetry() {
      this.triggerEvent('retry')
    }
  }
})
```

**Step 6: 提交**

```bash
git add moti-miniprogram/components/loading/
git commit -m "feat: 添加 loading 加载状态组件"
```

---

### Task 6: 创建 cell-item 组件

**Files:**
- Create: `moti-miniprogram/components/cell-item/cell-item.wxml`
- Create: `moti-miniprogram/components/cell-item/cell-item.wxss`
- Create: `moti-miniprogram/components/cell-item/cell-item.js`
- Create: `moti-miniprogram/components/cell-item/cell-item.json`

**Step 1: 创建组件目录**

```bash
mkdir -p moti-miniprogram/components/cell-item
```

**Step 2: 创建 cell-item.json**

```json
{
  "component": true
}
```

**Step 3: 创建 cell-item.wxml**

```xml
<view class="cell-item {{border ? 'border' : ''}}" bindtap="onTap">
  <view class="cell-item-left">
    <image wx:if="{{icon}}" class="cell-item-icon" src="{{icon}}" mode="aspectFit" />
    <text class="cell-item-title">{{title}}</text>
  </view>

  <view class="cell-item-right">
    <text wx:if="{{value}}" class="cell-item-value">{{value}}</text>
    <switch wx:if="{{showSwitch}}" checked="{{switchValue}}" bindchange="onSwitchChange" color="#C99C00" />
    <image wx:if="{{showArrow}}" class="cell-item-arrow" src="/images/arrow-right.svg" mode="aspectFit" />
  </view>
</view>
```

**Step 4: 创建 cell-item.wxss**

```css
.cell-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 0;
  background-color: var(--bg-card);
}

.cell-item.border {
  border-bottom: 1rpx solid var(--divider-color);
}

.cell-item-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.cell-item-icon {
  width: 44rpx;
  height: 44rpx;
}

.cell-item-title {
  font-size: 30rpx;
  color: var(--text-primary);
}

.cell-item-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.cell-item-value {
  font-size: 28rpx;
  color: var(--text-tertiary);
}

.cell-item-arrow {
  width: 32rpx;
  height: 32rpx;
  opacity: 0.4;
}
```

**Step 5: 创建 cell-item.js**

```javascript
Component({
  properties: {
    icon: String,
    title: String,
    value: String,
    showArrow: {
      type: Boolean,
      value: true
    },
    showSwitch: {
      type: Boolean,
      value: false
    },
    switchValue: {
      type: Boolean,
      value: false
    },
    border: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap')
    },
    onSwitchChange(e) {
      this.triggerEvent('switch', { value: e.detail.value })
    }
  }
})
```

**Step 6: 提交**

```bash
git add moti-miniprogram/components/cell-item/
git commit -m "feat: 添加 cell-item 列表项组件"
```

---

### Task 7: 创建 button 组件

**Files:**
- Create: `moti-miniprogram/components/m-button/m-button.wxml`
- Create: `moti-miniprogram/components/m-button/m-button.wxss`
- Create: `moti-miniprogram/components/m-button/m-button.js`
- Create: `moti-miniprogram/components/m-button/m-button.json`

**Step 1: 创建组件目录**

```bash
mkdir -p moti-miniprogram/components/m-button
```

**Step 2: 创建 m-button.json**

```json
{
  "component": true
}
```

**Step 3: 创建 m-button.wxml**

```xml
<button
  class="m-button {{type}} {{size}} {{block ? 'block' : ''}} {{disabled ? 'disabled' : ''}}"
  disabled="{{disabled}}"
  loading="{{loading}}"
  open-type="{{openType}}"
  bindtap="onTap"
  bindgetuserinfo="onGetUserInfo"
  bindgetphonenumber="onGetPhoneNumber"
>
  <slot></slot>
</button>
```

**Step 4: 创建 m-button.wxss**

```css
.m-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 48rpx;
  font-size: 30rpx;
  font-weight: 500;
  border-radius: 16rpx;
  border: none;
  transition: opacity 0.2s;
}

.m-button::after {
  border: none;
}

/* 类型 */
.m-button.primary {
  background-color: var(--accent-color);
  color: #FFFFFF;
}

.m-button.secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.m-button.outline {
  background-color: transparent;
  color: var(--accent-color);
  border: 2rpx solid var(--accent-color);
}

.m-button.text {
  background-color: transparent;
  color: var(--accent-color);
  padding: 0;
}

/* 尺寸 */
.m-button.large {
  height: 96rpx;
  font-size: 32rpx;
}

.m-button.medium {
  height: 80rpx;
  font-size: 30rpx;
}

.m-button.small {
  height: 64rpx;
  font-size: 26rpx;
  padding: 0 32rpx;
}

/* 块级 */
.m-button.block {
  display: flex;
  width: 100%;
}

/* 禁用 */
.m-button.disabled {
  opacity: 0.5;
}
```

**Step 5: 创建 m-button.js**

```javascript
Component({
  properties: {
    type: {
      type: String,
      value: 'primary' // primary | secondary | outline | text
    },
    size: {
      type: String,
      value: 'medium' // large | medium | small
    },
    block: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    },
    loading: {
      type: Boolean,
      value: false
    },
    openType: String
  },

  methods: {
    onTap() {
      if (!this.properties.disabled) {
        this.triggerEvent('tap')
      }
    },
    onGetUserInfo(e) {
      this.triggerEvent('getuserinfo', e.detail)
    },
    onGetPhoneNumber(e) {
      this.triggerEvent('getphonenumber', e.detail)
    }
  }
})
```

**Step 6: 提交**

```bash
git add moti-miniprogram/components/m-button/
git commit -m "feat: 添加 m-button 按钮组件"
```

---

### Task 8: 创建 input-field 组件

**Files:**
- Create: `moti-miniprogram/components/input-field/input-field.wxml`
- Create: `moti-miniprogram/components/input-field/input-field.wxss`
- Create: `moti-miniprogram/components/input-field/input-field.js`
- Create: `moti-miniprogram/components/input-field/input-field.json`

**Step 1: 创建组件目录**

```bash
mkdir -p moti-miniprogram/components/input-field
```

**Step 2: 创建 input-field.json**

```json
{
  "component": true
}
```

**Step 3: 创建 input-field.wxml**

```xml
<view class="input-field {{focus ? 'focus' : ''}} {{error ? 'error' : ''}}">
  <image wx:if="{{icon}}" class="input-field-icon" src="{{icon}}" mode="aspectFit" />
  <input
    class="input-field-input"
    type="{{type}}"
    password="{{password}}"
    placeholder="{{placeholder}}"
    placeholder-class="input-field-placeholder"
    value="{{value}}"
    maxlength="{{maxlength}}"
    focus="{{autoFocus}}"
    bindinput="onInput"
    bindfocus="onFocus"
    bindblur="onBlur"
    bindconfirm="onConfirm"
  />
  <image
    wx:if="{{clearable && value}}"
    class="input-field-clear"
    src="/images/close.svg"
    mode="aspectFit"
    bindtap="onClear"
  />
</view>
```

**Step 4: 创建 input-field.wxss**

```css
.input-field {
  display: flex;
  align-items: center;
  background-color: var(--bg-secondary);
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  border: 2rpx solid transparent;
  transition: border-color 0.2s;
}

.input-field.focus {
  border-color: var(--accent-color);
}

.input-field.error {
  border-color: var(--error-color);
}

.input-field-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
  opacity: 0.6;
}

.input-field-input {
  flex: 1;
  font-size: 30rpx;
  color: var(--text-primary);
}

.input-field-placeholder {
  color: var(--text-placeholder);
}

.input-field-clear {
  width: 36rpx;
  height: 36rpx;
  margin-left: 16rpx;
  opacity: 0.4;
}
```

**Step 5: 创建 input-field.js**

```javascript
Component({
  properties: {
    value: String,
    type: {
      type: String,
      value: 'text'
    },
    password: {
      type: Boolean,
      value: false
    },
    placeholder: String,
    icon: String,
    clearable: {
      type: Boolean,
      value: true
    },
    maxlength: {
      type: Number,
      value: 140
    },
    autoFocus: {
      type: Boolean,
      value: false
    },
    error: {
      type: Boolean,
      value: false
    }
  },

  data: {
    focus: false
  },

  methods: {
    onInput(e) {
      this.triggerEvent('input', { value: e.detail.value })
    },
    onFocus() {
      this.setData({ focus: true })
      this.triggerEvent('focus')
    },
    onBlur() {
      this.setData({ focus: false })
      this.triggerEvent('blur')
    },
    onConfirm(e) {
      this.triggerEvent('confirm', { value: e.detail.value })
    },
    onClear() {
      this.triggerEvent('input', { value: '' })
      this.triggerEvent('clear')
    }
  }
})
```

**Step 6: 提交**

```bash
git add moti-miniprogram/components/input-field/
git commit -m "feat: 添加 input-field 输入框组件"
```

---

### Task 9: 创建 modal 组件

**Files:**
- Create: `moti-miniprogram/components/modal/modal.wxml`
- Create: `moti-miniprogram/components/modal/modal.wxss`
- Create: `moti-miniprogram/components/modal/modal.js`
- Create: `moti-miniprogram/components/modal/modal.json`

**Step 1: 创建组件目录**

```bash
mkdir -p moti-miniprogram/components/modal
```

**Step 2: 创建 modal.json**

```json
{
  "component": true
}
```

**Step 3: 创建 modal.wxml**

```xml
<view wx:if="{{visible}}" class="modal-overlay" bindtap="onOverlayTap">
  <view class="modal-container" catchtap="preventClose">
    <view wx:if="{{title}}" class="modal-header">
      <text class="modal-title">{{title}}</text>
    </view>

    <view class="modal-body">
      <slot></slot>
      <text wx:if="{{content}}">{{content}}</text>
    </view>

    <view class="modal-footer">
      <view wx:if="{{showCancel}}" class="modal-btn cancel" bindtap="onCancel">
        {{cancelText}}
      </view>
      <view class="modal-btn confirm" bindtap="onConfirm">
        {{confirmText}}
      </view>
    </view>
  </view>
</view>
```

**Step 4: 创建 modal.wxss**

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  width: 80%;
  max-width: 600rpx;
  background-color: var(--bg-card);
  border-radius: 24rpx;
  overflow: hidden;
}

.modal-header {
  padding: 40rpx 40rpx 0;
  text-align: center;
}

.modal-title {
  font-size: 34rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-body {
  padding: 40rpx;
  text-align: center;
  font-size: 30rpx;
  color: var(--text-secondary);
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  border-top: 1rpx solid var(--divider-color);
}

.modal-btn {
  flex: 1;
  padding: 32rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: 500;
}

.modal-btn.cancel {
  color: var(--text-secondary);
  border-right: 1rpx solid var(--divider-color);
}

.modal-btn.confirm {
  color: var(--accent-color);
}
```

**Step 5: 创建 modal.js**

```javascript
Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    title: String,
    content: String,
    showCancel: {
      type: Boolean,
      value: true
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    confirmText: {
      type: String,
      value: '确定'
    },
    closeOnOverlay: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    onOverlayTap() {
      if (this.properties.closeOnOverlay) {
        this.triggerEvent('close')
      }
    },
    preventClose() {},
    onCancel() {
      this.triggerEvent('cancel')
      this.triggerEvent('close')
    },
    onConfirm() {
      this.triggerEvent('confirm')
    }
  }
})
```

**Step 6: 提交**

```bash
git add moti-miniprogram/components/modal/
git commit -m "feat: 添加 modal 弹窗组件"
```

---

### Task 10: 创建 action-bar 组件

**Files:**
- Create: `moti-miniprogram/components/action-bar/action-bar.wxml`
- Create: `moti-miniprogram/components/action-bar/action-bar.wxss`
- Create: `moti-miniprogram/components/action-bar/action-bar.js`
- Create: `moti-miniprogram/components/action-bar/action-bar.json`

**Step 1: 创建组件目录**

```bash
mkdir -p moti-miniprogram/components/action-bar
```

**Step 2: 创建 action-bar.json**

```json
{
  "component": true
}
```

**Step 3: 创建 action-bar.wxml**

```xml
<view class="action-bar safe-area-bottom">
  <view class="action-bar-item" bindtap="onLike">
    <image
      class="action-bar-icon {{liked ? 'active' : ''}}"
      src="/images/{{liked ? 'heart-filled' : 'heart'}}.svg"
      mode="aspectFit"
    />
    <text class="action-bar-count">{{likeCount || ''}}</text>
  </view>

  <view class="action-bar-item" bindtap="onBookmark">
    <image
      class="action-bar-icon {{bookmarked ? 'active' : ''}}"
      src="/images/{{bookmarked ? 'bookmark-filled' : 'bookmark'}}.svg"
      mode="aspectFit"
    />
    <text class="action-bar-count">{{bookmarkCount || ''}}</text>
  </view>

  <view class="action-bar-item" bindtap="onComment">
    <image class="action-bar-icon" src="/images/comment.svg" mode="aspectFit" />
    <text class="action-bar-count">{{commentCount || ''}}</text>
  </view>

  <view class="action-bar-item" bindtap="onShare">
    <image class="action-bar-icon" src="/images/share.svg" mode="aspectFit" />
  </view>
</view>
```

**Step 4: 创建 action-bar.wxss**

```css
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100rpx;
  background-color: var(--bg-primary);
  border-top: 1rpx solid var(--divider-color);
  z-index: 999;
}

.action-bar-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 32rpx;
}

.action-bar-icon {
  width: 48rpx;
  height: 48rpx;
}

.action-bar-icon.active {
  filter: none;
}

.action-bar-count {
  font-size: 24rpx;
  color: var(--text-tertiary);
}
```

**Step 5: 创建 action-bar.js**

```javascript
Component({
  properties: {
    liked: {
      type: Boolean,
      value: false
    },
    bookmarked: {
      type: Boolean,
      value: false
    },
    likeCount: Number,
    bookmarkCount: Number,
    commentCount: Number
  },

  methods: {
    onLike() {
      this.triggerEvent('like')
    },
    onBookmark() {
      this.triggerEvent('bookmark')
    },
    onComment() {
      this.triggerEvent('comment')
    },
    onShare() {
      this.triggerEvent('share')
    }
  }
})
```

**Step 6: 提交**

```bash
git add moti-miniprogram/components/action-bar/
git commit -m "feat: 添加 action-bar 文章操作栏组件"
```

---

### Task 11: 创建 comment-item 组件

**Files:**
- Create: `moti-miniprogram/components/comment-item/comment-item.wxml`
- Create: `moti-miniprogram/components/comment-item/comment-item.wxss`
- Create: `moti-miniprogram/components/comment-item/comment-item.js`
- Create: `moti-miniprogram/components/comment-item/comment-item.json`

**Step 1: 创建组件目录**

```bash
mkdir -p moti-miniprogram/components/comment-item
```

**Step 2: 创建 comment-item.json**

```json
{
  "component": true
}
```

**Step 3: 创建 comment-item.wxml**

```xml
<view class="comment-item">
  <image class="comment-avatar" src="{{comment.user.picture || '/images/avatar-default.png'}}" mode="aspectFill" />

  <view class="comment-content">
    <view class="comment-header">
      <text class="comment-author">{{comment.user.username || '匿名用户'}}</text>
      <text class="comment-time">{{comment.timestampISO || comment.timestamp}}</text>
    </view>

    <view class="comment-text">{{comment.content}}</view>

    <view class="comment-actions">
      <view class="comment-action" bindtap="onLike">
        <image src="/images/{{comment.upvoted ? 'heart-filled' : 'heart'}}.svg" class="comment-action-icon" mode="aspectFit" />
        <text>{{comment.upvotes || 0}}</text>
      </view>
      <view class="comment-action" bindtap="onReply">
        <image src="/images/comment.svg" class="comment-action-icon" mode="aspectFit" />
        <text>回复</text>
      </view>
    </view>
  </view>
</view>
```

**Step 4: 创建 comment-item.wxss**

```css
.comment-item {
  display: flex;
  padding: 32rpx 0;
  border-bottom: 1rpx solid var(--divider-color);
}

.comment-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  margin-right: 24rpx;
  flex-shrink: 0;
  background-color: var(--bg-secondary);
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.comment-author {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--text-primary);
}

.comment-time {
  font-size: 24rpx;
  color: var(--text-tertiary);
}

.comment-text {
  font-size: 28rpx;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 16rpx;
}

.comment-actions {
  display: flex;
  gap: 48rpx;
}

.comment-action {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: var(--text-tertiary);
}

.comment-action-icon {
  width: 32rpx;
  height: 32rpx;
  opacity: 0.6;
}
```

**Step 5: 创建 comment-item.js**

```javascript
Component({
  properties: {
    comment: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onLike() {
      this.triggerEvent('like', { comment: this.properties.comment })
    },
    onReply() {
      this.triggerEvent('reply', { comment: this.properties.comment })
    }
  }
})
```

**Step 6: 提交**

```bash
git add moti-miniprogram/components/comment-item/
git commit -m "feat: 添加 comment-item 评论组件"
```

---

### Task 12: 创建 article-card 组件

**Files:**
- Create: `moti-miniprogram/components/article-card/article-card.wxml`
- Create: `moti-miniprogram/components/article-card/article-card.wxss`
- Create: `moti-miniprogram/components/article-card/article-card.js`
- Create: `moti-miniprogram/components/article-card/article-card.json`

**Step 1: 创建组件目录**

```bash
mkdir -p moti-miniprogram/components/article-card
```

**Step 2: 创建 article-card.json**

```json
{
  "component": true
}
```

**Step 3: 创建 article-card.wxml**

```xml
<view class="article-card" bindtap="onTap">
  <image
    wx:if="{{showCover && article.thumb}}"
    class="article-card-cover"
    src="{{article.thumb}}"
    mode="aspectFill"
  />

  <view class="article-card-content">
    <view class="article-card-title">{{article.title}}</view>

    <view wx:if="{{article.teaser}}" class="article-card-teaser">
      {{article.teaser}}
    </view>

    <view class="article-card-meta">
      <text class="article-card-author">{{article.user.username || '匿名'}}</text>
      <text class="article-card-dot">·</text>
      <text class="article-card-stat">{{article.viewcount || 0}} 阅读</text>
    </view>
  </view>
</view>
```

**Step 4: 创建 article-card.wxss**

```css
.article-card {
  background-color: var(--bg-card);
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  box-shadow: var(--shadow-sm);
}

.article-card-cover {
  width: 100%;
  height: 320rpx;
}

.article-card-content {
  padding: 32rpx;
}

.article-card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-card-teaser {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-card-meta {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: var(--text-tertiary);
}

.article-card-dot {
  margin: 0 12rpx;
}

.article-card-author {
  font-weight: 500;
}
```

**Step 5: 创建 article-card.js**

```javascript
Component({
  properties: {
    article: {
      type: Object,
      value: {}
    },
    showCover: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    onTap() {
      const { tid, pid } = this.properties.article
      const id = tid || pid
      if (id) {
        wx.navigateTo({
          url: `/pages/article/article?id=${id}`
        })
      }
    }
  }
})
```

**Step 6: 提交**

```bash
git add moti-miniprogram/components/article-card/
git commit -m "feat: 添加 article-card 文章卡片组件"
```

---

### Task 13: 注册全局组件

**Files:**
- Modify: `moti-miniprogram/app.json`

**Step 1: 更新 app.json 添加全局组件**

在 app.json 中添加 usingComponents：

```json
{
  "usingComponents": {
    "nav-bar": "/components/nav-bar/nav-bar",
    "tab-bar": "/components/tab-bar/tab-bar",
    "post-card": "/components/post-card/post-card",
    "article-card": "/components/article-card/article-card",
    "loading": "/components/loading/loading",
    "cell-item": "/components/cell-item/cell-item",
    "comment-item": "/components/comment-item/comment-item",
    "m-button": "/components/m-button/m-button",
    "input-field": "/components/input-field/input-field",
    "modal": "/components/modal/modal",
    "action-bar": "/components/action-bar/action-bar"
  }
}
```

**Step 2: 提交**

```bash
git add moti-miniprogram/app.json
git commit -m "feat: 注册全局组件"
```

---

## 阶段 2：核心页面

### Task 14: 重构 index 页面（最新）

**Files:**
- Modify: `moti-miniprogram/pages/index/index.wxml`
- Modify: `moti-miniprogram/pages/index/index.wxss`
- Modify: `moti-miniprogram/pages/index/index.js`

**Step 1: 重写 index.wxml**

```xml
<page class="{{darkMode ? 'dark' : ''}}">
  <view class="page-container">
    <!-- 顶部导航 -->
    <nav-bar title="" showBack="{{false}}">
      <view slot="left" class="index-logo">
        <image src="/images/logo.svg" class="logo-image" mode="aspectFit" />
        <text class="logo-text">Moti</text>
      </view>
      <view slot="right" class="index-actions">
        <view class="action-btn" bindtap="toggleDarkMode">
          <image src="/images/{{darkMode ? 'sun' : 'moon'}}.svg" class="action-icon" mode="aspectFit" />
        </view>
        <view class="action-btn" bindtap="goToMessages">
          <image src="/images/bell.svg" class="action-icon" mode="aspectFit" />
          <view wx:if="{{hasUnread}}" class="unread-dot"></view>
        </view>
      </view>
    </nav-bar>

    <!-- 搜索栏 -->
    <view class="search-wrapper">
      <input-field
        placeholder="搜索文章、话题..."
        icon="/images/search.svg"
        bind:confirm="onSearch"
      />
    </view>

    <!-- 筛选标签 -->
    <view class="filter-tabs">
      <view
        class="filter-tab {{filterType === 'latest' ? 'active' : ''}}"
        bindtap="setFilter"
        data-type="latest"
      >最新</view>
      <view
        class="filter-tab {{filterType === 'hot' ? 'active' : ''}}"
        bindtap="setFilter"
        data-type="hot"
      >最热</view>
    </view>

    <!-- 帖子列表 -->
    <scroll-view
      class="post-list"
      scroll-y
      enhanced
      show-scrollbar="{{false}}"
      bindscrolltolower="loadMore"
      refresher-enabled
      refresher-triggered="{{refreshing}}"
      bindrefresherrefresh="onRefresh"
    >
      <post-card wx:for="{{posts}}" wx:key="tid" post="{{item}}" />

      <loading wx:if="{{loading}}" status="loading" />
      <loading wx:elif="{{!posts.length && !loading}}" status="empty" emptyText="暂无文章" />
      <view wx:elif="{{!hasMore}}" class="no-more">没有更多了</view>
    </scroll-view>

    <!-- 底部导航 -->
    <tab-bar current="{{0}}" />
  </view>
</page>
```

**Step 2: 重写 index.wxss**

```css
.page-container {
  min-height: 100vh;
  background-color: var(--bg-secondary);
  padding-bottom: 120rpx;
}

.index-logo {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.logo-image {
  width: 56rpx;
  height: 56rpx;
}

.logo-text {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--accent-color);
}

.index-actions {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.action-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background-color: var(--bg-secondary);
}

.action-icon {
  width: 40rpx;
  height: 40rpx;
}

.unread-dot {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  width: 16rpx;
  height: 16rpx;
  background-color: var(--error-color);
  border-radius: 50%;
}

.search-wrapper {
  padding: 24rpx 32rpx;
}

.filter-tabs {
  display: flex;
  gap: 32rpx;
  padding: 0 32rpx 24rpx;
}

.filter-tab {
  font-size: 30rpx;
  color: var(--text-tertiary);
  padding: 8rpx 0;
  border-bottom: 4rpx solid transparent;
}

.filter-tab.active {
  color: var(--accent-color);
  font-weight: 600;
  border-bottom-color: var(--accent-color);
}

.post-list {
  height: calc(100vh - 400rpx);
  padding: 0 32rpx;
}

.no-more {
  text-align: center;
  padding: 32rpx;
  font-size: 26rpx;
  color: var(--text-tertiary);
}
```

**Step 3: 更新 index.js（保留 API 逻辑，更新 data 结构）**

保持现有的 API 调用逻辑，更新 data 中与 UI 相关的字段。

**Step 4: 验证页面**

在微信开发者工具中预览，确认页面显示正常。

**Step 5: 提交**

```bash
git add moti-miniprogram/pages/index/
git commit -m "feat: 重构 index 最新页面 UI"
```

---

> 注：后续页面（topics、article、profile 等）按相同模式重构，此处省略详细步骤。每个页面遵循：
> 1. 重写 WXML（使用通用组件）
> 2. 重写 WXSS（使用 CSS 变量）
> 3. 更新 JS（保留 API 逻辑）
> 4. 验证预览
> 5. 提交

---

## 阶段 3-5 页面列表

| 阶段 | 页面 | 文件路径 |
|------|------|----------|
| 3 | 登录 | pages/auth/auth |
| 3 | 我的 | pages/profile/profile |
| 3 | 我的信息 | pages/profile-info/profile-info |
| 4 | 社区 | pages/community/community |
| 4 | 收藏 | pages/favorites/favorites |
| 4 | 消息 | pages/messages/messages |
| 4 | 浏览记录 | pages/history/history |
| 5 | 购买会员 | pages/purchase/purchase |
| 5 | 付款记录 | pages/payments/payments |
| 5 | 设置 | pages/settings/settings |
| 5 | 关于 | pages/about/about |

---

## 验证清单

- [ ] 所有页面深色/浅色主题切换正常
- [ ] 所有组件复用正常
- [ ] API 调用功能不受影响
- [ ] 页面跳转正常
- [ ] 底部导航切换正常
- [ ] 下拉刷新和加载更多正常
