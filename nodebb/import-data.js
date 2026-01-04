#!/usr/bin/env node
/**
 * 数据导入脚本 - 将 React 原型数据导入 NodeBB
 */

'use strict';

const nconf = require('nconf');
const path = require('path');

// 加载配置
nconf.file({ file: path.join(__dirname, 'config.json') });

const db = require('./src/database');
const categories = require('./src/categories');
const topics = require('./src/topics');
const user = require('./src/user');

// React 原型中的分类数据
const MOCK_CATEGORIES = ['灵性觉醒', '身心健康', '自我成长', '哲学思辨', '冥想实践', '情绪管理'];

// React 原型中的帖子内容模板
const MOCK_ARTICLE_CONTENT = `
在现代生活的喧嚣中，我们常常感到迷失。焦虑似乎成了背景噪音，时刻伴随着我们的每一次呼吸。

**第一步：承认当下的状态**

不要试图抵抗焦虑。就像陷入流沙一样，挣扎只会让你陷得更深。承认它："我现在感到焦虑，这没关系。"这种接纳是转变的开始。

**第二步：回归呼吸**

注意你的呼吸。不需要改变它，只是观察。吸气...呼气...感觉空气流过鼻腔的凉意。这简单的动作能将你的意识从混乱的思维中拉回身体。

**第三步：数字极简**

我们的焦虑很大程度上来自于信息的过载。试着每天设定一段"无屏时间"。在这段时间里，不看手机，不看电脑，只是单纯地存在。

宁静不是某种需要去追寻的遥远目标，它是你剥离了噪音之后，原本就存在的本质。
`;

// React 原型中的帖子数据
const MOCK_POSTS = [
  { title: '如何在极度焦虑的现代生活中保持内心的宁静？', author: 'Sadhguru_Fan', category: '灵性觉醒' },
  { title: '冥想初学者指南：不要试图"清空"大脑', author: 'Mindful_John', category: '身心健康' },
  { title: '荣格心理学中的"阴影"在职场关系中的体现', author: 'Psycho_Analyst', category: '自我成长' },
  { title: '每周讨论：你认为物质极简能否带来精神富足？', author: 'Moderator', category: '哲学思辨' },
  { title: '身体僵硬与情绪压抑的关联性研究分享', author: 'BodyWorker', category: '身心健康' },
  { title: '推荐几本关于斯多葛学派的入门书籍', author: 'Reader_001', category: '自我成长' }
];

async function main() {
  try {
    console.log('连接数据库...');
    await db.init();

    console.log('获取管理员用户...');
    const adminUid = 1; // 默认管理员 uid

    // 1. 创建分类
    console.log('\n=== 创建分类 ===');
    const categoryMap = {}; // 分类名 -> cid 映射

    for (let i = 0; i < MOCK_CATEGORIES.length; i++) {
      const name = MOCK_CATEGORIES[i];

      // 检查分类是否已存在
      const existing = await db.getSortedSetRange('categories:cid', 0, -1);
      let found = false;

      for (const cid of existing) {
        const catName = await db.getObjectField(`category:${cid}`, 'name');
        if (catName === name) {
          console.log(`分类已存在: ${name} (cid: ${cid})`);
          categoryMap[name] = parseInt(cid, 10);
          found = true;
          break;
        }
      }

      if (!found) {
        const categoryData = await categories.create({
          name: name,
          description: `${name}相关内容讨论`,
          icon: 'fa-star',
          bgColor: '#C99C00',
          color: '#ffffff',
          order: i + 10
        });
        console.log(`创建分类: ${name} (cid: ${categoryData.cid})`);
        categoryMap[name] = categoryData.cid;
      }
    }

    // 2. 创建帖子
    console.log('\n=== 创建帖子 ===');

    for (const post of MOCK_POSTS) {
      const cid = categoryMap[post.category];
      if (!cid) {
        console.log(`跳过帖子 (分类未找到): ${post.title}`);
        continue;
      }

      // 检查帖子是否已存在 (通过标题)
      const existingTopics = await db.getSortedSetRange(`cid:${cid}:tids`, 0, 100);
      let exists = false;

      for (const tid of existingTopics) {
        const title = await db.getObjectField(`topic:${tid}`, 'title');
        if (title === post.title) {
          console.log(`帖子已存在: ${post.title}`);
          exists = true;
          break;
        }
      }

      if (!exists) {
        try {
          const topicData = await topics.post({
            uid: adminUid,
            cid: cid,
            title: post.title,
            content: MOCK_ARTICLE_CONTENT,
            tags: [post.category]
          });
          console.log(`创建帖子: ${post.title} (tid: ${topicData.topicData.tid})`);
        } catch (err) {
          console.error(`创建帖子失败: ${post.title}`, err.message);
        }
      }
    }

    console.log('\n=== 导入完成 ===');

  } catch (err) {
    console.error('导入失败:', err);
  } finally {
    await db.close();
    process.exit(0);
  }
}

main();
