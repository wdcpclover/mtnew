# 小程序 UI 重构设计方案

## 概述

基于 NodeBB 后端和新 UI 设计稿（ui_design 目录），对 moti-miniprogram 小程序进行 UI 重构。

**目标：** 保留现有 API 调用逻辑，根据新设计稿重写所有页面界面，支持深色/浅色双主题。

## 技术决策

| 项目 | 决定 |
|------|------|
| 重构方式 | UI 重构，保留 API 逻辑 |
| 开发范围 | 15 个页面全部开发 |
| 技术方案 | 原生 WXML/WXSS，不引入额外框架 |
| 主题方案 | CSS 变量系统，支持深色/浅色切换 |

## 项目结构

```
moti-miniprogram/
├── app.js                    # 全局逻辑（保留，增加主题切换）
├── app.json                  # 页面配置（更新页面列表）
├── app.wxss                  # 全局样式 + CSS 变量定义
├── theme.wxss                # 主题变量文件（深色/浅色色值）
├── utils/
│   └── api.js                # API 调用（保留不动）
├── components/               # 通用组件
│   ├── nav-bar/              # 自定义顶部导航
│   ├── tab-bar/              # 自定义底部导航
│   ├── post-card/            # 帖子卡片
│   ├── article-card/         # 文章卡片（带封面）
│   ├── loading/              # 加载状态
│   ├── cell-item/            # 列表项（设置页、我的页）
│   ├── comment-item/         # 评论/回复展示
│   ├── button/               # 按钮（主要/次要样式）
│   ├── input-field/          # 输入框
│   ├── modal/                # 弹窗
│   └── action-bar/           # 文章底部操作栏
├── pages/                    # 页面
└── images/                   # 图标资源
```

## CSS 变量主题系统

### theme.wxss

```css
/* 浅色主题（默认） */
page {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --bg-card: #FFFFFF;

  --text-primary: #1A1A1A;
  --text-secondary: #666666;
  --text-tertiary: #999999;

  --accent-color: #C99C00;
  --accent-light: #FFF8E1;

  --border-color: #EEEEEE;
  --divider-color: #F0F0F0;
}

/* 深色主题 */
page.dark {
  --bg-primary: #1A1A1A;
  --bg-secondary: #242424;
  --bg-card: #2A2A2A;

  --text-primary: #FFFFFF;
  --text-secondary: #AAAAAA;
  --text-tertiary: #666666;

  --accent-color: #C99C00;
  --accent-light: #3D3520;

  --border-color: #333333;
  --divider-color: #2F2F2F;
}
```

### 使用方式

```css
.container {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.card {
  background: var(--bg-card);
  border: 1rpx solid var(--border-color);
}
```

## 通用组件（11 个）

### 1. nav-bar（顶部导航栏）

**属性：**
- `title` - 标题文字
- `showBack` - 是否显示返回按钮
- `transparent` - 是否透明背景

### 2. tab-bar（底部导航栏）

**属性：**
- `current` - 当前选中项（0-3）

### 3. post-card（帖子卡片）

**属性：**
- `post` - 帖子数据对象

### 4. article-card（文章卡片）

**属性：**
- `article` - 文章数据对象
- `showCover` - 是否显示封面

### 5. loading（加载状态）

**状态：** loading / empty / error

### 6. cell-item（列表项）

**属性：**
- `icon` - 左侧图标
- `title` - 标题
- `value` - 右侧文字
- `showArrow` - 是否显示箭头

### 7. comment-item（评论项）

**属性：**
- `comment` - 评论数据对象

### 8. button（按钮）

**属性：**
- `type` - primary / secondary / text
- `size` - large / medium / small
- `disabled` - 是否禁用

### 9. input-field（输入框）

**属性：**
- `placeholder` - 占位文字
- `type` - text / password / number

### 10. modal（弹窗）

**属性：**
- `visible` - 是否显示
- `title` - 标题
- `showCancel` - 是否显示取消按钮

### 11. action-bar（操作栏）

**属性：**
- `liked` - 是否已点赞
- `bookmarked` - 是否已收藏
- `commentCount` - 评论数

## 页面列表（15 个）

### 第一组：核心浏览

| 页面 | 文件路径 | 设计稿 |
|------|----------|--------|
| 启动页 | pages/splash/splash | - |
| 最新 | pages/index/index | 最新-*.svg |
| 合集 | pages/topics/topics | 合集1-4.svg |
| 文章阅读 | pages/article/article | 文章阅读1-6.svg |

### 第二组：用户入口

| 页面 | 文件路径 | 设计稿 |
|------|----------|--------|
| 登录 | pages/auth/auth | 登录1-6.svg |
| 我的 | pages/profile/profile | 我的-*.svg |
| 我的信息 | pages/profile-info/profile-info | 我的信息-*.svg |

### 第三组：互动功能

| 页面 | 文件路径 | 设计稿 |
|------|----------|--------|
| 社区/提问 | pages/community/community | 提问1-2.svg |
| 我的收藏 | pages/favorites/favorites | 我的收藏1-2.svg |
| 我的消息 | pages/messages/messages | 我的消息1-4.svg |
| 浏览记录 | pages/history/history | 浏览记录-*.svg |

### 第四组：会员与设置

| 页面 | 文件路径 | 设计稿 |
|------|----------|--------|
| 购买会员 | pages/purchase/purchase | 购买卡片1-5.svg |
| 付款记录 | pages/payments/payments | 付款记录-*.svg |
| 设置 | pages/settings/settings | 设置-*.svg |
| 关于 | pages/about/about | 关于-*.svg |

## 开发顺序

```
阶段 1：基础设施
├── theme.wxss（主题变量）
├── app.wxss（全局样式）
└── 11 个通用组件

阶段 2：核心页面
├── splash（启动页）
├── index（最新）
├── topics（合集）
└── article（文章阅读）

阶段 3：用户模块
├── auth（登录）
├── profile（我的）
└── profile-info（我的信息）

阶段 4：互动模块
├── community（社区）
├── favorites（收藏）
├── messages（消息）
└── history（浏览记录）

阶段 5：会员模块
├── purchase（购买会员）
├── payments（付款记录）
├── settings（设置）
└── about（关于）
```

## 设计稿参考

设计文件位于 `ui_design/` 目录，包含：
- 深色主题：文件名含 `-dark`
- 浅色主题：文件名含 `-default`

## 注意事项

1. 保留 `utils/api.js` 不动，只重构 UI 层
2. 所有颜色使用 CSS 变量，便于主题切换
3. 组件先开发完成，再开发页面
4. 每个页面开发时对照设计稿，确保还原度
