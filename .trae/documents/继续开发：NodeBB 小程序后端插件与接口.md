## 现状梳理
- 代码结构：后端为 `NodeBB v4.7.0`（nodebb/package.json:5），包含完整核心模块与 API 路由（nodebb/src/routes/api.js:11）。
- 文档资产：已存在详细的目标与接口设计（开发计划.md、需求文档.md、评论系统API文档.md、api测试页面.html）。
- 差距：仓库未找到实际实现的 `/api/moti/*` 路由与 `nodebb-plugin-moti-api` 插件代码（文档中路径不可用）。需补齐插件骨架与接口实现。

## 总体目标
- 基于 NodeBB 插件机制，落地小程序专用 REST API（`/api/moti/*`），覆盖 P0 优先级：用户信息、帖子列表与详情、阅读权限控制、基础互动（点赞/收藏）、评论、笔记。
- 保持与 NodeBB 内核一致的调用方式与权限体系，复用核心模块（Topics、Posts、Middleware、DB）。

## 实施方案
### 插件骨架
- 位置：`nodebb/node_modules/nodebb-plugin-moti-api/`
- 文件：`package.json`、`plugin.json`、`library.js`、`README.md`
- 初始化：在 `static:app.load` 中注册路由；以 `/api/moti` 为前缀挂载。

### 路由与中间件
- 认证：使用 `middleware.authenticateRequest` 与 `middleware.ensureLoggedIn`（nodebb/src/middleware/index.js:51）。
- CSRF：仅写操作采用 `middleware.applyCSRF`（同上：index.js:42）。
- 权限：按需求定义 `checkReadPermission` 中间件，实现每日限读 1 篇与 VIP 放行（方案见开发计划.md）。

### P0 接口实现（本轮拟交付）
- `GET /api/moti/test`：健康检查。
- `GET /api/moti/user/profile`：返回基础用户信息 + 扩展字段（vip_expire_time、points、daily_read_count 等），使用 DB 哈希（nodebb/src/database/index.js:13）。
- `GET /api/moti/posts`：帖子列表
  - 参数：`page`、`sort=recent|popular`（popular 映射为 `votes`）。
  - 复用：`Topics.getSortedTopics({ sort, start, stop, uid })`（nodebb/src/topics/sorted.js:14）。
- `GET /api/moti/post/:pid`：帖子详情 + 权限控制
  - 获取：`Topics.getTopicDataByPid(pid)`（nodebb/src/topics/posts.js:350）。
  - 帖子集合：`Topics.getTopicPosts(...)`（nodebb/src/topics/posts.js:25）。
  - 权限中间件：按每日限读/VIP规则检查与记账。
- `POST /api/moti/post/:pid/upvote`：点赞
  - 复用：`Posts.upvote(pid, uid)`（nodebb/src/posts/votes.js:16）。
- `POST /api/moti/post/:pid/bookmark`：收藏
  - 逻辑：根据 `pid→tid`，再调用 `Topics.setUserBookmark(tid, uid, index)`（nodebb/src/topics/bookmarks.js:24）。
- 评论：
  - `POST /api/moti/post/:pid/comment`（创建）：`Posts.create({ uid, tid, content, toPid? })`（nodebb/src/posts/create.js:14）。
  - `GET /api/moti/post/:pid/comments`（列表）：通过 `tid` 与 `Topics.getTopicPosts(...)` 获取回复分页数据。
- 笔记：Redis 存储结构
  - `POST /api/moti/notes`：保存笔记（note:{noteId} + 索引集 `uid:{uid}:notes`, `pid:{pid}:notes`）。
  - `GET /api/moti/notes`：按 `uid` 翻页查询。
  - `GET /api/moti/post/:pid/notes`：按 `pid` 查询。
  - `PUT /api/moti/notes/:noteId`、`DELETE /api/moti/notes/:noteId`：更新/删除。

### 设计要点
- 列表排序：
  - `recent` → `topics:recent`（nodebb/src/topics/recent.js:28）。
  - `popular` → `topics:votes`（nodebb/src/topics/sorted.js:75-88）。
  - “最多收藏”后续通过 hook 维护聚合集再提供。
- 主题/帖子数据：
  - 主题数据与主帖获取（nodebb/src/topics/index.js:161）。
  - 评论创建与父子关系（nodebb/src/posts/create.js:33）。
- 点赞/收藏一致性：
  - 点赞直接复用 `Posts.votes`（nodebb/src/posts/votes.js）。
  - 收藏以主题为单位设置书签（nodebb/src/topics/bookmarks.js）。

### 返回格式与错误处理
- 统一 JSON：`{ success, data, message }`；错误采用 `res.status(code).json({ error })`。
- 参数校验：`middleware.checkRequired([...])`（nodebb/src/middleware/index.js:301）。

### 验证与联调
- 启动 NodeBB 后，使用现有 `api测试页面.html` 逐项点击校验。
- `curl` 脚本：列表、详情、点赞、评论、笔记基本用例（复用评论系统API文档.md示例）。
- 日志：通过 NodeBB CLI `./nodebb log` 检查插件加载与路由命中。

### 后续迭代（确认后排期开发）
- 微信登录：`POST /api/moti/auth/wechat`（获取 openid/session_key、创建/绑定用户、生成 token）。
- 支付：订单创建、统一下单、回调与会员激活。
- 搜索与筛选：`GET /api/moti/search`，结合 NodeBB dbsearch 插件或自建索引。
- 最多收藏聚合：通过 hook 写入 `topics:bookmarks:agg` 提供快速排序集合。
- OpenAPI 文档：在 `public/openapi` 新增 `moti.yaml`，便于小程序端对接。

## 交付标准
- 插件可在 Admin 中启用，路由均返回 200/403/401 等预期状态。
- P0 接口在测试页均可用；阅读权限按规则生效；数据持久化正确。

## 风险与应对
- 插件路径与加载：若生产环境不允许在 `node_modules` 下开发，改为独立仓库并 `npm link`。
- “最多收藏”排序：需新增聚合集合；先以 `votes`/`views` 作为替代。
- 微信/支付：需申请测试资质与密钥，先留空实现。

## 下一步
- 创建插件骨架并实现上述 P0 接口与中间件。
- 启动 NodeBB，使用测试页面与 curl 验证功能。
- 完成后进入微信登录与支付集成阶段。