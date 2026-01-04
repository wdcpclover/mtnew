/**
 * 创建测试数据脚本
 */

const nconf = require('nconf');
const path = require('path');

// 设置必要的环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// 加载 NodeBB 配置
nconf.argv().env({
  separator: '__',
}).file({
  file: path.join(__dirname, 'config.json'),
});

// 设置上传路径
nconf.set('upload_path', path.join(__dirname, 'public', 'uploads'));

const db = require('./src/database');
const user = require('./src/user');
const categories = require('./src/categories');
const topics = require('./src/topics');
const posts = require('./src/posts');

async function createTestData() {
  console.log('开始创建测试数据...\n');

  try {
    // 初始化数据库连接
    await db.init();
    console.log('✅ 数据库连接成功\n');

    // 1. 创建测试用户
    console.log('📝 创建测试用户...');
    const testUsers = [];

    // 创建管理员用户（如果不存在）
    let adminUid = await user.getUidByUsername('admin');
    if (!adminUid) {
      adminUid = await user.create({
        username: 'admin',
        password: 'admin123',
        email: 'admin@moti.com',
      });
      console.log('  ✅ 创建管理员用户: admin (密码: admin123)');
    } else {
      console.log('  ℹ️  管理员用户已存在: admin');
    }

    // 创建普通测试用户
    for (let i = 1; i <= 5; i++) {
      const username = `testuser${i}`;
      let uid = await user.getUidByUsername(username);

      if (!uid) {
        uid = await user.create({
          username: username,
          password: 'test123',
          email: `testuser${i}@moti.com`,
          fullname: `测试用户${i}`,
        });

        // 设置用户积分和 VIP 状态
        await db.setObject(`user:${uid}`, {
          moti_points: Math.floor(Math.random() * 500),
          vip_expire_time: i <= 2 ? Date.now() + 30 * 24 * 60 * 60 * 1000 : 0, // 前两个用户是 VIP
        });

        console.log(`  ✅ 创建测试用户: ${username} (密码: test123) ${i <= 2 ? '🌟 VIP' : ''}`);
        testUsers.push(uid);
      } else {
        console.log(`  ℹ️  测试用户已存在: ${username}`);
        testUsers.push(uid);
      }
    }

    console.log('');

    // 2. 获取现有分类或创建新分类
    console.log('📂 检查分类...');
    const allCids = await categories.getAllCidsFromSet('categories:cid');
    let categoryIds = [];

    if (allCids.length > 0) {
      categoryIds = allCids;
      console.log(`  ℹ️  已存在 ${allCids.length} 个分类`);
    } else {
      // 创建测试分类
      const categoryNames = ['技术分享', '问答讨论', '资源推荐', '随笔杂谈'];
      for (const name of categoryNames) {
        const categoryData = await categories.create({
          name: name,
          description: `这是${name}分类的描述`,
          icon: 'fa-folder',
          order: categoryIds.length + 1,
        });
        categoryIds.push(categoryData.cid);
        console.log(`  ✅ 创建分类: ${name} (cid: ${categoryData.cid})`);
      }
    }

    console.log('');

    // 3. 创建测试帖子
    console.log('📰 创建测试帖子...');
    const testTopics = [
      {
        title: '欢迎来到莫提之地！新人必读指南',
        content: `# 欢迎来到莫提之地

这是一个知识分享和交流的社区。

## 社区规则
1. 尊重他人，文明交流
2. 分享有价值的内容
3. 积极参与讨论

## 如何开始
- 浏览不同的分类，找到感兴趣的话题
- 点赞和收藏喜欢的内容
- 发表评论，分享你的想法
- 创建笔记，记录重要信息

祝你在这里收获满满！`,
        tags: [],
      },
      {
        title: 'JavaScript 异步编程最佳实践',
        content: `# JavaScript 异步编程

异步编程是 JavaScript 的核心特性之一。

## Promise
\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

## Async/Await
使用 async/await 可以让异步代码看起来更像同步代码。

## 错误处理
记得要用 try/catch 处理错误！`,
        tags: [],
      },
      {
        title: '如何提高编程效率？',
        content: `# 编程效率提升技巧

分享一些我在实践中总结的经验：

1. **使用好的工具**：IDE、插件、命令行工具
2. **学习快捷键**：提高操作速度
3. **代码复用**：封装常用功能
4. **测试驱动**：先写测试再写代码
5. **持续学习**：关注新技术和最佳实践

大家还有什么好的建议？`,
        tags: [],
      },
      {
        title: '推荐几个学习编程的优质资源',
        content: `# 编程学习资源推荐

## 在线课程
- Coursera
- Udemy
- freeCodeCamp

## 文档网站
- MDN Web Docs
- JavaScript.info
- TypeScript 官方文档

## 社区论坛
- Stack Overflow
- GitHub Discussions
- Reddit r/programming

希望对大家有帮助！`,
        tags: [],
      },
      {
        title: '今天完成了第一个开源项目！',
        content: `今天终于把自己的第一个开源项目发布到 GitHub 了！

虽然只是一个小工具，但这是我迈出的重要一步。

感谢社区里各位前辈的帮助和鼓励！

接下来会继续完善功能，欢迎大家提 issue 和 PR！

💪 继续加油！`,
        tags: [],
      },
      {
        title: 'React vs Vue：如何选择前端框架？',
        content: `# 前端框架选择

最近在做技术选型，纠结于 React 和 Vue 之间。

## React 的优势
- 生态丰富
- 社区活跃
- 就业机会多

## Vue 的优势
- 上手简单
- 文档友好
- 渐进式设计

大家在实际项目中都用什么框架？能分享一下经验吗？`,
        tags: [],
      },
    ];

    const createdTopics = [];
    for (let i = 0; i < testTopics.length; i++) {
      const topicData = testTopics[i];
      const cid = categoryIds[i % categoryIds.length];
      const uid = testUsers[i % testUsers.length] || adminUid;

      try {
        const result = await topics.post({
          uid: uid,
          cid: cid,
          title: topicData.title,
          content: topicData.content,
          tags: topicData.tags || [],
        });

        createdTopics.push(result.topicData);
        console.log(`  ✅ 创建帖子: ${topicData.title}`);

        // 随机添加一些点赞
        const upvoteCount = Math.floor(Math.random() * 10);
        for (let j = 0; j < upvoteCount; j++) {
          const voterUid = testUsers[j % testUsers.length];
          if (voterUid !== uid) {
            try {
              await posts.upvote(result.postData.pid, voterUid);
            } catch (e) {
              // 忽略重复点赞错误
            }
          }
        }
      } catch (error) {
        console.error(`  ❌ 创建帖子失败: ${topicData.title}`, error.message);
      }
    }

    console.log('');

    // 4. 创建一些评论
    console.log('💬 创建测试评论...');
    const comments = [
      '感谢分享！很有帮助！',
      '写得很好，学到了不少东西',
      '有几个问题想请教一下',
      '赞同！我也是这么做的',
      '这个方法很实用',
    ];

    for (let i = 0; i < Math.min(3, createdTopics.length); i++) {
      const topic = createdTopics[i];
      const commentCount = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < commentCount; j++) {
        const commenterUid = testUsers[j % testUsers.length];
        try {
          await posts.create({
            uid: commenterUid,
            tid: topic.tid,
            content: comments[j % comments.length],
          });
          console.log(`  ✅ 为帖子 "${topic.title}" 添加评论`);
        } catch (error) {
          console.error(`  ❌ 添加评论失败:`, error.message);
        }
      }
    }

    console.log('');

    // 5. 创建一些划线笔记
    console.log('📝 创建测试笔记...');
    for (let i = 0; i < Math.min(2, createdTopics.length); i++) {
      const topic = createdTopics[i];
      const mainPid = topic.mainPid;
      const noteCreatorUid = testUsers[i % testUsers.length];

      try {
        const noteId = require('crypto').randomUUID();
        const now = Date.now();

        await db.setObject(`note:${noteId}`, {
          noteId,
          uid: noteCreatorUid,
          pid: mainPid,
          content: '这是一段重要的内容',
          note: '这里记录了我的思考和理解',
          startOffset: 10,
          endOffset: 30,
          color: '#ffeb3b',
          timestamp: now,
          visibility: 'public',
          likeCount: 0,
        });

        await db.sortedSetAdd(`user:${noteCreatorUid}:notes`, now, noteId);
        await db.sortedSetAdd(`post:${mainPid}:user:${noteCreatorUid}:notes`, now, noteId);
        await db.sortedSetAdd(`post:${mainPid}:notes:public`, now, noteId);

        console.log(`  ✅ 为帖子 "${topic.title}" 创建笔记`);
      } catch (error) {
        console.error(`  ❌ 创建笔记失败:`, error.message);
      }
    }

    console.log('\n✅ 测试数据创建完成！\n');

    // 输出测试账号信息
    console.log('═══════════════════════════════════════');
    console.log('📋 测试账号信息');
    console.log('═══════════════════════════════════════');
    console.log('管理员账号:');
    console.log('  用户名: admin');
    console.log('  密码: admin123');
    console.log('');
    console.log('测试用户账号:');
    for (let i = 1; i <= 5; i++) {
      console.log(`  用户名: testuser${i} (密码: test123) ${i <= 2 ? '🌟 VIP' : ''}`);
    }
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ 创建测试数据失败:', error);
  } finally {
    process.exit(0);
  }
}

// 运行脚本
createTestData();
