// 模拟用户数据
const MOCK_USER = {
  id: 'user_moti_301',
  name: '觉醒者_Moti',
  gender: '女性',
  nickname: '禅意猫',
  mood: '平静',
  level: 3,
  vipExpiry: '2025-05-31',
  isNotificationEnabled: true,
  avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=Felix'
}

// 付款记录
const MOCK_PAYMENT_RECORDS = [
  { id: 101, date: '2024-05-01', product: 'Moti Pro 月度会员', amount: '¥ 49.00', status: '已激活' },
  { id: 102, date: '2024-03-01', product: 'Moti Pro 月度会员', amount: '¥ 49.00', status: '已激活' },
  { id: 103, date: '2024-01-05', product: '《觉醒之路》电子书', amount: '¥ 99.00', status: '已激活' },
]

// 分类
const MOCK_CATEGORIES = ['灵性觉醒', '身心健康', '自我成长', '哲学思辨', '冥想实践', '情绪管理']

// 文章内容
const MOCK_ARTICLE_CONTENT = `在现代生活的喧嚣中，我们常常感到迷失。焦虑似乎成了背景噪音，时刻伴随着我们的每一次呼吸。

第一步：承认当下的状态

不要试图抵抗焦虑。就像陷入流沙一样，挣扎只会让你陷得更深。承认它："我现在感到焦虑，这没关系。"这种接纳是转变的开始。

第二步：回归呼吸

注意你的呼吸。不需要改变它，只是观察。吸气...呼气...感觉空气流过鼻腔的凉意。这简单的动作能将你的意识从混乱的思维中拉回身体。

第三步：数字极简

我们的焦虑很大程度上来自于信息的过载。试着每天设定一段"无屏时间"。在这段时间里，不看手机，不看电脑，只是单纯地存在。

宁静不是某种需要去追寻的遥远目标，它是你剥离了噪音之后，原本就存在的本质。`

// 帖子数据
const MOCK_POSTS = [
  { id: 1, title: '如何在极度焦虑的现代生活中保持内心的宁静？', author: 'Sadhguru_Fan', category: '灵性觉醒', time: '2小时前', timestamp: 1715600000, comments: 42, upvotes: 128, isFavorite: true, content: MOCK_ARTICLE_CONTENT },
  { id: 2, title: '冥想初学者指南：不要试图"清空"大脑', author: 'Mindful_John', category: '身心健康', time: '4小时前', timestamp: 1715590000, comments: 15, upvotes: 89, isFavorite: false, content: MOCK_ARTICLE_CONTENT },
  { id: 3, title: '荣格心理学中的"阴影"在职场关系中的体现', author: 'Psycho_Analyst', category: '自我成长', time: '6小时前', timestamp: 1715580000, comments: 33, upvotes: 210, isFavorite: false, content: MOCK_ARTICLE_CONTENT },
  { id: 4, title: '每周讨论：你认为物质极简能否带来精神富足？', author: 'Moderator', category: '哲学思辨', time: '1天前', timestamp: 1715500000, comments: 156, upvotes: 340, isFavorite: true, content: MOCK_ARTICLE_CONTENT },
  { id: 5, title: '身体僵硬与情绪压抑的关联性研究分享', author: 'BodyWorker', category: '身心健康', time: '1天前', timestamp: 1715490000, comments: 8, upvotes: 45, isFavorite: false, content: MOCK_ARTICLE_CONTENT },
  { id: 6, title: '推荐几本关于斯多葛学派的入门书籍', author: 'Reader_001', category: '自我成长', time: '2天前', timestamp: 1715400000, comments: 67, upvotes: 112, isFavorite: false, content: MOCK_ARTICLE_CONTENT }
]

module.exports = {
  MOCK_USER,
  MOCK_PAYMENT_RECORDS,
  MOCK_CATEGORIES,
  MOCK_ARTICLE_CONTENT,
  MOCK_POSTS
}
