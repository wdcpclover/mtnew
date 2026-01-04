#!/usr/bin/env node
/**
 * 修复分类权限 - 直接通过 Redis 设置
 */

'use strict';

process.env.NODE_ENV = 'production';

const nconf = require('nconf');
nconf.file({ file: './config.json' });

async function main() {
  const db = require('./src/database');
  await db.init();

  console.log('数据库连接成功');

  // 需要修复权限的分类 cid
  const cidsToFix = [5, 6, 7, 8, 9, 10];

  // 权限列表
  const allPrivileges = [
    'find', 'read', 'topics:read', 'topics:create', 'topics:reply', 'topics:tag',
    'posts:edit', 'posts:history', 'posts:delete', 'posts:upvote', 'posts:downvote',
    'topics:delete', 'topics:schedule', 'posts:view_deleted', 'purge'
  ];

  // 各用户组应有的权限
  const groupPrivileges = {
    'registered-users': ['find', 'read', 'topics:read', 'topics:create', 'topics:reply', 'topics:tag', 'posts:edit', 'posts:history', 'posts:delete', 'posts:upvote', 'posts:downvote', 'topics:delete'],
    'fediverse': ['find', 'read', 'topics:read', 'topics:create', 'topics:reply', 'topics:tag', 'posts:edit', 'posts:history', 'posts:delete', 'posts:upvote', 'posts:downvote', 'topics:delete'],
    'administrators': allPrivileges,
    'Global Moderators': allPrivileges,
    'guests': ['find', 'read', 'topics:read'],
    'spiders': ['find', 'read', 'topics:read']
  };

  console.log('\n=== 修复分类权限 ===');

  const now = Date.now();

  for (const cid of cidsToFix) {
    const name = await db.getObjectField(`category:${cid}`, 'name');
    if (!name) {
      console.log(`分类 ${cid} 不存在，跳过`);
      continue;
    }

    console.log(`设置分类 ${cid} (${name}) 权限...`);

    for (const priv of allPrivileges) {
      const groupKey = `group:cid:${cid}:privileges:groups:${priv}`;
      const membersKey = `${groupKey}:members`;

      // 检查组是否存在
      const exists = await db.exists(groupKey);
      if (!exists) {
        // 创建权限组
        await db.setObject(groupKey, {
          name: `cid:${cid}:privileges:groups:${priv}`,
          slug: `cid-${cid}-privileges-groups-${priv.replace(/:/g, '-')}`,
          createtime: now,
          userTitle: `cid:${cid}:privileges:groups:${priv}`,
          userTitleEnabled: 0,
          description: '',
          memberCount: 0,
          hidden: 1,
          system: 1,
          private: 1,
          disableJoinRequests: 0,
          disableLeave: 0
        });
      }

      // 添加应有此权限的用户组
      for (const [groupName, privs] of Object.entries(groupPrivileges)) {
        if (privs.includes(priv)) {
          const isMember = await db.isSortedSetMember(membersKey, groupName);
          if (!isMember) {
            await db.sortedSetAdd(membersKey, now, groupName);
            await db.incrObjectField(groupKey, 'memberCount');
          }
        }
      }
    }

    console.log(`  ✓ 完成`);
  }

  console.log('\n=== 权限修复完成 ===');

  await db.close();
  process.exit(0);
}

main().catch(err => {
  console.error('错误:', err);
  process.exit(1);
});
