# 莫提之地小程序项目

集内容付费、知识分享与社群互动于一体的微信小程序平台

## 项目结构

```
MT/
├── nodebb/                    # NodeBB 论坛后端
├── 开发计划.md                # 详细开发计划
├── 需求文档.md                # 需求文档
├── 莫提之地小程序需求文档.pdf  # 完整需求
└── 帖子数据.md                # 示例数据
```

## 技术栈

- **后端**: NodeBB v4.6.1 (Node.js + Redis)
- **前端**: 微信小程序 (计划使用 uni-app)
- **数据库**: Redis

## 快速开始

### 启动 NodeBB

```bash
cd nodebb
npm install
./nodebb start
```

访问: http://localhost:4567

### 管理员账号

- 用户名: `admin`
- 密码: `admin123`
- 邮箱: `admin@localhost`

## 开发进度

- [x] NodeBB 环境搭建
- [x] 基础配置完成
- [x] 开发计划制定
- [ ] NodeBB API 扩展
- [ ] 小程序开发
- [ ] 支付系统集成

## 文档

详见 [开发计划.md](./开发计划.md)

## License

GPL-3.0
