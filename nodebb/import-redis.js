#!/usr/bin/env node
/**
 * 直接通过 Redis 导入数据 - 使用 NodeBB 自带的 redis 模块
 */

'use strict';

process.env.NODE_ENV = 'production';

const nconf = require('nconf');
nconf.file({ file: './config.json' });

async function main() {
  // 使用 NodeBB 的数据库模块
  const db = require('./src/database');
  await db.init();

  console.log('数据库连接成功');

  // 分类数据
  const categories = ['灵性觉醒', '身心健康', '自我成长', '哲学思辨', '冥想实践', '情绪管理'];

  // 文章内容
  const content = `在现代生活的喧嚣中，我们常常感到迷失。焦虑似乎成了背景噪音，时刻伴随着我们的每一次呼吸。

**第一步：承认当下的状态**

不要试图抵抗焦虑。就像陷入流沙一样，挣扎只会让你陷得更深。承认它："我现在感到焦虑，这没关系。"这种接纳是转变的开始。

**第二步：回归呼吸**

注意你的呼吸。不需要改变它，只是观察。吸气...呼气...感觉空气流过鼻腔的凉意。

**第三步：数字极简**

我们的焦虑很大程度上来自于信息的过载。试着每天设定一段"无屏时间"。

宁静不是某种需要去追寻的遥远目标，它是你剥离了噪音之后，原本就存在的本质。`;

  // 帖子数据
  const posts = [
    { title: '如何在极度焦虑的现代生活中保持内心的宁静？', category: '灵性觉醒' },
    { title: '冥想初学者指南：不要试图"清空"大脑', category: '身心健康' },
    { title: '荣格心理学中的"阴影"在职场关系中的体现', category: '自我成长' },
    { title: '每周讨论：你认为物质极简能否带来精神富足？', category: '哲学思辨' },
    { title: '身体僵硬与情绪压抑的关联性研究分享', category: '身心健康' },
    { title: '推荐几本关于斯多葛学派的入门书籍', category: '自我成长' }
  ];

  const categoryMap = {};

  console.log('\n=== 创建分类 ===');

  for (let i = 0; i < categories.length; i++) {
    const name = categories[i];

    // 检查是否已存在
    const allCids = await db.getSortedSetRange('categories:cid', 0, -1);
    let exists = false;
    for (const cid of allCids) {
      const catName = await db.getObjectField(`category:${cid}`, 'name');
      if (catName === name) {
        categoryMap[name] = parseInt(cid, 10);
        console.log(`分类已存在: ${name} (cid: ${cid})`);
        exists = true;
        break;
      }
    }

    if (!exists) {
      const cid = await db.incrObjectField('global', 'nextCid');
      const now = Date.now();
      const slug = `${cid}/${encodeURIComponent(name)}`;

      await db.setObject(`category:${cid}`, {
        cid: cid,
        name: name,
        description: `${name}相关内容讨论`,
        slug: slug,
        icon: 'fa-star',
        bgColor: '#C99C00',
        color: '#ffffff',
        parentCid: 0,
        order: i + 10,
        disabled: 0,
        link: '',
        class: 'col-md-3 col-6',
        imageClass: 'cover',
        isSection: 0,
        subCategoriesPerPage: 10,
        minTags: 0,
        maxTags: 5,
        numRecentReplies: 1,
        topic_count: 0,
        post_count: 0
      });

      await db.sortedSetAdd('categories:cid', cid, cid);
      await db.sortedSetAdd('cid:0:children', cid, cid); // 添加到根分类子列表

      categoryMap[name] = cid;
      console.log(`创建分类: ${name} (cid: ${cid})`);
    }
  }

  console.log('\n=== 创建帖子 ===');

  for (const post of posts) {
    const cid = categoryMap[post.category];
    if (!cid) {
      console.log(`跳过 (分类未找到): ${post.title}`);
      continue;
    }

    // 检查标题是否已存在
    const existingTids = await db.getSortedSetRange(`cid:${cid}:tids`, 0, -1);
    let exists = false;
    for (const tid of existingTids) {
      const title = await db.getObjectField(`topic:${tid}`, 'title');
      if (title === post.title) {
        console.log(`帖子已存在: ${post.title}`);
        exists = true;
        break;
      }
    }

    if (!exists) {
      const tid = await db.incrObjectField('global', 'nextTid');
      const pid = await db.incrObjectField('global', 'nextPid');
      const now = Date.now();
      const uid = 1; // admin
      const slug = `${tid}/${encodeURIComponent(post.title.substring(0, 50))}`;

      // 创建主题
      await db.setObject(`topic:${tid}`, {
        tid: tid,
        uid: uid,
        cid: cid,
        mainPid: pid,
        title: post.title,
        slug: slug,
        timestamp: now,
        lastposttime: now,
        postcount: 1,
        viewcount: 0,
        postercount: 1,
        deleted: 0,
        locked: 0,
        pinned: 0,
        upvotes: 0,
        downvotes: 0
      });

      // 创建帖子内容
      await db.setObject(`post:${pid}`, {
        pid: pid,
        tid: tid,
        uid: uid,
        content: content,
        timestamp: now,
        deleted: 0,
        upvotes: 0,
        downvotes: 0,
        votes: 0
      });

      // 更新索引
      await db.sortedSetAdd('topics:tid', now, tid);
      await db.sortedSetAdd('topics:recent', now, tid);
      await db.sortedSetAdd(`cid:${cid}:tids`, now, tid);
      await db.sortedSetAdd(`cid:${cid}:tids:lastposttime`, now, tid);
      await db.sortedSetAdd(`tid:${tid}:posts`, now, pid);
      await db.sortedSetAdd(`uid:${uid}:topics`, now, tid);
      await db.sortedSetAdd(`uid:${uid}:posts`, now, pid);

      // 更新分类计数
      await db.incrObjectField(`category:${cid}`, 'topic_count');
      await db.incrObjectField(`category:${cid}`, 'post_count');

      // 更新全局计数
      await db.incrObjectField('global', 'topicCount');
      await db.incrObjectField('global', 'postCount');

      console.log(`创建帖子: ${post.title} (tid: ${tid})`);
    }
  }

  console.log('\n=== 导入完成 ===');

  await db.close();
  process.exit(0);
}

main().catch(err => {
  console.error('错误:', err);
  process.exit(1);
});
