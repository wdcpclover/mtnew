#!/usr/bin/env node
/**
 * 通过 HTTP API 导入数据到 NodeBB
 */

const http = require('http');

const BASE_URL = 'http://110.42.230.103';

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
  { title: '如何在极度焦虑的现代生活中保持内心的宁静？', category: '灵性觉醒' },
  { title: '冥想初学者指南：不要试图"清空"大脑', category: '身心健康' },
  { title: '荣格心理学中的"阴影"在职场关系中的体现', category: '自我成长' },
  { title: '每周讨论：你认为物质极简能否带来精神富足？', category: '哲学思辨' },
  { title: '身体僵硬与情绪压抑的关联性研究分享', category: '身心健康' },
  { title: '推荐几本关于斯多葛学派的入门书籍', category: '自我成长' }
];

function request(method, path, data, cookie) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (cookie) {
      options.headers['Cookie'] = cookie;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          };
          resolve(result);
        } catch (e) {
          resolve({ statusCode: res.statusCode, headers: res.headers, body: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function login(username, password) {
  console.log('登录管理员账户...');

  // 先获取 CSRF token
  const csrfRes = await request('GET', '/api/config');
  const csrfToken = csrfRes.body && csrfRes.body['csrf_token'];
  const cookies = csrfRes.headers['set-cookie'] || [];
  const sessionCookie = cookies.map(c => c.split(';')[0]).join('; ');

  console.log('CSRF Token:', csrfToken ? '已获取' : '未获取');

  // 登录
  const loginRes = await request('POST', '/api/v3/users/login', {
    username: username,
    password: password
  }, sessionCookie);

  if (loginRes.statusCode === 200 && loginRes.body && loginRes.body.status && loginRes.body.status.code === 'ok') {
    const newCookies = loginRes.headers['set-cookie'] || [];
    const allCookies = [...cookies, ...newCookies].map(c => c.split(';')[0]).join('; ');
    console.log('登录成功!');
    return { cookie: allCookies, csrf: csrfToken, uid: loginRes.body.response.uid };
  } else {
    console.error('登录失败:', loginRes.body);
    return null;
  }
}

async function getCategories(auth) {
  const res = await request('GET', '/api/categories', null, auth.cookie);
  return res.body && res.body.categories || [];
}

async function createCategory(auth, name, description) {
  const res = await request('POST', '/api/v3/admin/categories', {
    name: name,
    description: description,
    icon: 'fa-star',
    bgColor: '#C99C00',
    color: '#ffffff'
  }, auth.cookie);

  if (res.statusCode === 200 && res.body && res.body.status && res.body.status.code === 'ok') {
    return res.body.response;
  }
  return null;
}

async function createTopic(auth, cid, title, content) {
  const res = await request('POST', '/api/v3/topics', {
    cid: cid,
    title: title,
    content: content
  }, auth.cookie);

  if (res.statusCode === 200 && res.body && res.body.status && res.body.status.code === 'ok') {
    return res.body.response;
  }
  console.error('创建帖子失败:', res.body);
  return null;
}

async function main() {
  try {
    // 登录
    const auth = await login('admin', 'admin123');
    if (!auth) {
      console.error('登录失败，退出');
      process.exit(1);
    }

    // 获取现有分类
    console.log('\n获取现有分类...');
    const existingCategories = await getCategories(auth);
    const categoryMap = {};

    for (const cat of existingCategories) {
      categoryMap[cat.name] = cat.cid;
    }
    console.log('现有分类:', Object.keys(categoryMap));

    // 创建新分类
    console.log('\n=== 创建分类 ===');
    for (const name of MOCK_CATEGORIES) {
      if (categoryMap[name]) {
        console.log(`分类已存在: ${name} (cid: ${categoryMap[name]})`);
      } else {
        const result = await createCategory(auth, name, `${name}相关内容讨论`);
        if (result && result.cid) {
          console.log(`创建分类: ${name} (cid: ${result.cid})`);
          categoryMap[name] = result.cid;
        } else {
          console.log(`创建分类失败: ${name}`);
        }
      }
    }

    // 创建帖子
    console.log('\n=== 创建帖子 ===');
    for (const post of MOCK_POSTS) {
      const cid = categoryMap[post.category];
      if (!cid) {
        console.log(`跳过帖子 (分类未找到): ${post.title}`);
        continue;
      }

      const result = await createTopic(auth, cid, post.title, MOCK_ARTICLE_CONTENT);
      if (result && result.tid) {
        console.log(`创建帖子: ${post.title} (tid: ${result.tid})`);
      } else {
        console.log(`创建帖子失败: ${post.title}`);
      }
    }

    console.log('\n=== 导入完成 ===');

  } catch (err) {
    console.error('导入失败:', err);
  }
}

main();
