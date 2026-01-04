import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sun, 
  Moon, 
  Search, 
  Bell, 
  MessageSquare, 
  User, 
  PenTool, 
  BookOpen, 
  ChevronRight, 
  Bookmark, 
  Star,
  ArrowLeft,
  Share2,
  Send,
  X,
  CreditCard, 
  Gift, 
  Calendar, 
  Info, 
  Users,
  Briefcase,
  Settings,
  LogOut,
  Zap,
  Tag,
  Heart,
  MessageCircle,
  Key,
  // 修正: 'Wechat' 图标在 lucide-react 中不存在，使用 'MessageSquare' 替代或使用自定义 SVG
} from 'lucide-react';

// 自定义 Wechat 图标的 SVG 替代品，以便保持视觉一致性
const WechatIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M17.5 17.5V19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v1.5"/>
    <path d="M7 11.5h8"/>
    <path d="M7 15.5h5"/>
    <rect x="17" y="3" width="4" height="4" rx="1" ry="1"/>
    <path d="M19 7v10"/>
  </svg>
);


// --- 模拟数据 (不变) ---

const MOCK_USER = {
  id: 'user_moti_301',
  name: '觉醒者_Moti',
  gender: '女性',
  nickname: '禅意猫',
  mood: '平静', 
  level: 3,
  vipExpiry: '2025-05-31', 
  isNotificationEnabled: true,
};

const MOCK_PAYMENT_RECORDS = [
    { id: 101, date: '2024-05-01', product: 'Moti Pro 月度会员', amount: '¥ 49.00', status: '已激活' },
    { id: 102, date: '2024-03-01', product: 'Moti Pro 月度会员', amount: '¥ 49.00', status: '已激活' },
    { id: 103, date: '2024-01-05', product: '《觉醒之路》电子书', amount: '¥ 99.00', status: '已激活' },
];

const MOCK_CATEGORIES = ['灵性觉醒', '身心健康', '自我成长', '哲学思辨', '冥想实践', '情绪管理'];

const MOCK_ARTICLE_CONTENT = `
  <p>在现代生活的喧嚣中，我们常常感到迷失。焦虑似乎成了背景噪音，时刻伴随着我们的每一次呼吸。</p>
  <p><strong>第一步：承认当下的状态</strong></p>
  <p>不要试图抵抗焦虑。就像陷入流沙一样，挣扎只会让你陷得更深。承认它：“我现在感到焦虑，这没关系。”这种接纳是转变的开始。</p>
  <p><strong>第二步：回归呼吸</strong></p>
  <p>注意你的呼吸。不需要改变它，只是观察。吸气...呼气...感觉空气流过鼻腔的凉意。这简单的动作能将你的意识从混乱的思维中拉回身体。</p>
  <p><strong>第三步：数字极简</strong></p>
  <p>我们的焦虑很大程度上来自于信息的过载。试着每天设定一段“无屏时间”。在这段时间里，不看手机，不看电脑，只是单纯地存在。</p>
  <p>宁静不是某种需要去追寻的遥远目标，它是你剥离了噪音之后，原本就存在的本质。</p>
`;

const MOCK_POSTS = [
  { id: 1, title: '如何在极度焦虑的现代生活中保持内心的宁静？', author: 'Sadhguru_Fan', category: '灵性觉醒', time: '2小时前', timestamp: 1715600000, comments: 42, upvotes: 128, isFavorite: true, content: MOCK_ARTICLE_CONTENT },
  { id: 2, title: '冥想初学者指南：不要试图“清空”大脑', author: 'Mindful_John', category: '身心健康', time: '4小时前', timestamp: 1715590000, comments: 15, upvotes: 89, isFavorite: false, content: MOCK_ARTICLE_CONTENT },
  { id: 3, title: '荣格心理学中的“阴影”在职场关系中的体现', author: 'Psycho_Analyst', category: '自我成长', time: '6小时前', timestamp: 1715580000, comments: 33, upvotes: 210, isFavorite: false, content: MOCK_ARTICLE_CONTENT },
  { id: 4, title: '每周讨论：你认为物质极简能否带来精神富足？', author: 'Moderator', category: '哲学思辨', time: '1天前', timestamp: 1715500000, comments: 156, upvotes: 340, isFavorite: true, content: MOCK_ARTICLE_CONTENT },
  { id: 5, title: '身体僵硬与情绪压抑的关联性研究分享', author: 'BodyWorker', category: '身心健康', time: '1天前', timestamp: 1715490000, comments: 8, upvotes: 45, isFavorite: false, content: MOCK_ARTICLE_CONTENT },
  { id: 6, title: '推荐几本关于斯多葛学派的入门书籍', author: 'Reader_001', category: '自我成长', time: '2天前', timestamp: 1715400000, comments: 67, upvotes: 112, isFavorite: false, content: MOCK_ARTICLE_CONTENT }
];

// --- 样式主题定义 (不变) ---
const useTheme = (darkMode) => ({
  bg: darkMode ? 'bg-neutral-900' : 'bg-gray-50',
  cardBg: darkMode ? 'bg-neutral-800' : 'bg-white',
  textMain: darkMode ? 'text-gray-100' : 'text-neutral-900',
  textSub: darkMode ? 'text-gray-400' : 'text-gray-500',
  border: darkMode ? 'border-neutral-700' : 'border-gray-200',
  inputBg: darkMode ? 'bg-neutral-700' : 'bg-gray-100',
  accentGoldText: 'text-[#C99C00]',
  accentGoldBg: 'bg-[#C99C00]',
  accentGoldBorder: 'border-[#C99C00]',
  tabActive: 'text-[#C99C00]',
  tabInactive: darkMode ? 'text-gray-500' : 'text-gray-400',
  divider: darkMode ? 'divide-neutral-700' : 'divide-gray-100',
});

// --- UI 工具组件 (ProgressBar, AskFormModal, FavoritesDrawer, BackHeader 等不变) ---

const ProgressBar = ({ progress = 65, darkMode }) => (
  <div className="flex flex-col gap-0.5 w-20">
    <div className={`text-[9px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      今日能量
    </div>
    <div className={`h-1.5 w-full rounded-full ${darkMode ? 'bg-neutral-700' : 'bg-gray-200'}`}>
      <div 
        className="h-full rounded-full bg-[#C99C00] transition-all duration-500" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

const AskFormModal = ({ isOpen, onClose, theme }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState(MOCK_CATEGORIES[0]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (title.trim() === '' || content.trim() === '') {
      console.error('标题和内容不能为空');
      // 使用自定义 UI 替代 alert
      // alert('请输入标题和内容！'); 
      return;
    }
    console.log('提交新话题:', { title, content, tag });
    setTitle('');
    setContent('');
    // 使用自定义 UI 替代 alert
    // alert('提问已成功提交！');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={`relative w-full max-w-sm rounded-xl shadow-2xl p-5 ${theme.cardBg} ${theme.textMain} animate-zoom-in`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">发起新话题</h3>
          <button onClick={onClose} className="p-1"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-xs font-medium mb-1 ${theme.textSub}`}>标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="简洁明了的问题..."
              className={`w-full px-3 py-2 text-sm rounded-lg outline-none border ${theme.border} ${theme.inputBg} focus:border-[#C99C00] ${theme.textMain}`}
            />
          </div>
    
          <div>
            <label className={`block text-xs font-medium mb-1 ${theme.textSub}`}>分类标签</label>
            <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-lg outline-none border ${theme.border} ${theme.inputBg} focus:border-[#C99C00] ${theme.textMain}`}
            >
                {MOCK_CATEGORIES.map(c => (
                    <option key={c} value={c} className={theme.cardBg}>{c}</option>
                ))}
            </select>
          </div>
    
          <div>
            <label className={`block text-xs font-medium mb-1 ${theme.textSub}`}>详细内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享您的困惑、思考和背景信息..."
              rows={5}
              className={`w-full px-3 py-2 text-sm rounded-lg outline-none border ${theme.border} ${theme.inputBg} focus:border-[#C99C00] ${theme.textMain} resize-none`}
            />
          </div>
    
          <button
            onClick={handleSubmit}
            className={`w-full py-2.5 mt-2 rounded-lg font-bold text-white transition-opacity ${theme.accentGoldBg} hover:opacity-90`}
          >
            发布提问
          </button>
        </div>
      </div>
    </div>
  );
};

const FavoritesDrawer = ({ isOpen, onClose, favorites, theme, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 overflow-hidden flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={`relative w-3/4 max-w-[300px] h-full shadow-2xl transform transition-transform duration-300 ${theme.bg} ${theme.textMain}`}>
        <div className={`flex items-center justify-between p-4 border-b ${theme.border}`}>
          <h3 className="font-bold flex items-center gap-2">
            <Star size={18} className="text-[#C99C00]" fill="#C99C00" />
            我的收藏
          </h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="overflow-y-auto h-full pb-20">
          {favorites.length === 0 ? (
            <div className={`p-8 text-center text-sm ${theme.textSub}`}>暂无收藏内容</div>
          ) : (
            favorites.map(item => (
              <div 
                key={item.id} 
                onClick={() => { onSelect(item); onClose(); }}
                className={`p-4 border-b ${theme.border} active:bg-black/5 cursor-pointer`}
              >
                <div className="font-medium text-sm line-clamp-2 mb-1">{item.title}</div>
                <div className={`text-xs ${theme.textSub}`}>{item.author} · {item.category || '文章'}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ArticleReader = ({ article, onClose, theme, isFavorite, toggleFavorite }) => {
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false); 

  const handleCommentSubmit = () => {
    if (comment.trim() === '') return;
    console.log(`提交评论: "${comment}", 状态: ${isAnonymous ? '匿名' : '公开'}`);
    setComment('');
  };

  return (
    <div className={`fixed inset-0 z-40 flex flex-col ${theme.bg} ${theme.textMain}`}>
      {/* 阅读器顶部：包含分享和收藏按钮 */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${theme.border} ${theme.cardBg}`}>
        <button onClick={onClose} className="p-1 -ml-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-4">
           <button onClick={() => toggleFavorite(article.id)}>
             <Bookmark 
               size={22} 
               className={isFavorite ? 'text-[#C99C00]' : theme.textSub} 
               fill={isFavorite ? '#C99C00' : 'none'}
               strokeWidth={1.5}
             />
           </button>
           <button><Share2 size={22} className={theme.textSub} /></button>
        </div>
      </div>

      {/* 文章内容 */}
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        <h1 className="text-2xl font-bold mb-3 leading-snug">{article.title}</h1>
        <div className={`flex items-center gap-2 text-xs mb-8 ${theme.textSub}`}>
          <span className="font-medium text-[#C99C00]">{article.author || 'Moti 原创'}</span>
          <span>·</span>
          <span>{article.time || '刚刚'}</span>
        </div>
    
        <div 
          className="prose prose-sm max-w-none leading-relaxed text-base opacity-90 space-y-4"
          dangerouslySetInnerHTML={{ __html: article.content || MOCK_ARTICLE_CONTENT }} 
        />
        
        <div className={`mt-12 pt-6 border-t ${theme.border}`}>
           <h3 className="text-sm font-bold mb-4">评论 (12)</h3>
           {/* 模拟一条评论 */}
           <div className="flex gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full bg-gray-300 flex-shrink-0`} />
              <div>
                <div className="text-xs font-bold mb-1">User_88</div>
                <div className="text-sm opacity-80">非常有启发的文章，感谢分享。</div>
              </div>
           </div>
        </div>
      </div>
    
      {/* 底部评论栏 */}
      <div className={`absolute bottom-0 w-full p-3 border-t ${theme.border} ${theme.cardBg} flex flex-col gap-2`}>
        {/* 匿名/公开开关 */}
        <div className='flex items-center justify-end pr-2'>
            <span className={`text-xs mr-2 ${theme.textSub} font-medium`}>{isAnonymous ? '匿名发布' : '公开昵称'}</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={isAnonymous} 
                    onChange={(e) => setIsAnonymous(e.target.checked)} 
                    className="sr-only peer" 
                />
                <div className={`w-9 h-5 rounded-full peer peer-focus:outline-none transition-colors 
                    ${isAnonymous ? 'bg-red-500' : theme.accentGoldBg} bg-opacity-80`}>
                    <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform
                        ${isAnonymous ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
            </label>
        </div>
    
        {/* 输入框和发送按钮 */}
        <div className='flex items-center gap-3'>
            <input 
                type="text" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="写下你的感悟/回复评论..."
                className={`flex-1 px-4 py-2 rounded-full text-sm outline-none border ${theme.border} ${theme.inputBg} focus:border-[#C99C00]`}
            />
            <button 
              onClick={handleCommentSubmit}
              disabled={comment.trim() === ''}
              className={`p-2 rounded-full ${theme.accentGoldBg} text-white disabled:opacity-50`}
            >
              <Send size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

const AskView = ({ theme, onOpenArticle }) => {
  const [filterType, setFilterType] = useState('latest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const allFilters = [
    { type: 'time', id: 'latest', label: '最新' },
    { type: 'time', id: 'hot', label: '最热' },
    { type: 'category', id: 'all', label: '全部' },
    ...MOCK_CATEGORIES.map(cat => ({ type: 'category', id: cat, label: cat }))
  ];

  const filteredPosts = MOCK_POSTS
    .filter(post => filterCategory === 'all' || post.category === filterCategory)
    .sort((a, b) => {
        if (filterType === 'latest') return b.timestamp - a.timestamp;
        if (filterType === 'hot') return b.upvotes - a.upvotes;
        return 0;
    });

  const FilterTabs = () => (
    // 使用 sticky 定位确保横向滚动条在顶部固定
    <div className={`sticky top-[58px] z-10 ${theme.cardBg} shadow-sm border-b ${theme.border}`}>
      <div className="flex overflow-x-auto whitespace-nowrap px-4 py-2 space-x-2 scrollbar-hide">
        {allFilters.map((filter) => {
          const isTimeActive = filter.type === 'time' && filter.id === filterType && filterCategory === 'all';
          const isCategoryActive = filter.type === 'category' && filter.id === filterCategory;
          const isActive = isTimeActive || isCategoryActive;

          const handleClick = () => {
            if (filter.type === 'time') {
              setFilterType(filter.id);
              setFilterCategory('all');
            } else {
              setFilterCategory(filter.id);
              if (filterType === 'latest') setFilterType('latest');
            }
          };
    
          return (
            <button
              key={filter.id}
              onClick={handleClick}
              className={`text-sm py-1 px-3 rounded-full transition-colors flex-shrink-0 font-medium border ${theme.border}
                ${isActive ? theme.accentGoldBg + ' text-white border-transparent' : theme.textMain + ' hover:opacity-80'}`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
      {/* 自定义一个隐藏的滚动条样式，使界面更像小程序 */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );

  return (
    <div className={`pb-24 min-h-screen ${theme.bg}`}>
      {/* 头部导航/发起提问按钮 */}
      <div className={`sticky top-0 z-10 flex justify-between items-center px-4 py-3 border-b ${theme.border} ${theme.cardBg} shadow-sm`}>
        <h2 className={`text-lg font-bold ${theme.textMain}`}>社区讨论</h2>
        <button 
           onClick={() => setIsFormOpen(true)} 
           className={`p-2 rounded-full ${theme.accentGoldBg} text-white transition-transform hover:scale-110`}
        >
            <PenTool size={18} />
        </button>
      </div>

      <FilterTabs /> 
    
      {/* 列表 */}
      <div className="divide-y" style={{ borderColor: theme.border }}>
        {filteredPosts.length > 0 ? filteredPosts.map(post => (
          <div 
            key={post.id} 
            onClick={() => onOpenArticle(post)}
            className={`py-4 px-4 ${theme.cardBg} active:bg-opacity-80 transition-all cursor-pointer`}
          >
            <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${theme.accentGoldText} border ${theme.accentGoldBorder} opacity-80`}>
                    {post.category}
                </span>
                <span className={`text-xs ${theme.textSub}`}>@{post.author} · {post.time}</span>
            </div>
            <h3 className={`text-[16px] font-medium leading-snug mb-2 ${theme.textMain} line-clamp-2`}>{post.title}</h3>
            <div className={`flex gap-4 text-xs ${theme.textSub}`}>
                <div className="flex items-center gap-1"><Heart size={14} /> <span>{post.upvotes}</span></div>
                <div className="flex items-center gap-1"><MessageCircle size={14} /> <span>{post.comments}</span></div>
            </div>
          </div>
        )) : (
            <div className={`p-8 text-center ${theme.textSub}`}>未找到相关话题</div>
        )}
      </div>
    
      <AskFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} theme={theme} />
    </div>
  );
};

const BackHeader = ({ theme, title, onBack }) => (
    <div className={`sticky top-0 z-10 flex items-center px-4 py-3 border-b ${theme.border} ${theme.cardBg} shadow-sm`}>
        <button onClick={onBack} className="p-1 -ml-1 mr-4"><ArrowLeft size={24} className={theme.textMain} /></button>
        <h2 className={`text-lg font-bold ${theme.textMain}`}>{title}</h2>
    </div>
);

const BasicInfoView = ({ theme, onBack }) => (
    <div className={`pb-24 min-h-screen ${theme.bg}`}>
        <BackHeader theme={theme} title="基本信息" onBack={onBack} />
        <div className="p-4 space-y-4">
            <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.border}`}>
                <div className="flex justify-center mb-4">
                     <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-4 border-white dark:border-neutral-800 shadow-xl">
                        <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover" />
                     </div>
                </div>
                {[
                    { label: '用户 ID', value: MOCK_USER.id, icon: Key },
                    { label: '昵称', value: MOCK_USER.nickname, icon: Tag },
                    { label: '性别', value: MOCK_USER.gender, icon: Users },
                    { label: '兴奋点', value: MOCK_USER.mood, icon: Zap },
                    { label: '等级', value: `Lv${MOCK_USER.level}`, icon: Star },
                ].map(item => (
                    <div key={item.label} className={`flex justify-between items-center py-3 border-b ${theme.border} last:border-b-0`}>
                        <div className="flex items-center gap-3">
                            <item.icon size={18} className={theme.textSub} />
                            <span className={theme.textMain}>{item.label}</span>
                        </div>
                        <span className={`text-sm ${item.label === '用户 ID' ? 'font-mono' : 'font-medium'} ${theme.textSub}`}>{item.value}</span>
                    </div>
                ))}
                <button className={`w-full mt-4 py-2.5 rounded-lg font-bold text-white ${theme.accentGoldBg} hover:opacity-90`}>
                    编辑信息
                </button>
            </div>
        </div>
    </div>
);

const ReadingProgressDetailView = ({ theme, onBack }) => {
    const readingProgress = 75; 
    const themeKnowledge = 12; 
    const totalArticles = 65; 
    
    return (
        <div className={`pb-24 min-h-screen ${theme.bg}`}>
            <BackHeader theme={theme} title="阅读进度" onBack={onBack} />
            <div className="p-4 space-y-6">
                
                <div className={`p-5 rounded-xl ${theme.cardBg} border ${theme.border} text-center`}>
                    <h3 className={`text-lg font-bold mb-3 ${theme.textMain}`}>总览进度</h3>
                    <div className={`text-6xl font-extrabold mb-4 ${theme.accentGoldText}`}>{readingProgress}%</div>
                    <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-neutral-700 mx-auto">
                        <div 
                          className="h-full rounded-full bg-[#C99C00] transition-all duration-500" 
                          style={{ width: `${readingProgress}%` }}
                        ></div>
                    </div>
                    <p className={`text-sm mt-3 ${theme.textSub}`}>已完成合集阅读</p>
                </div>
                
                <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.border} flex justify-around`}>
                    <div className="text-center">
                        <p className={`text-3xl font-bold ${theme.accentGoldText}`}>{themeKnowledge}</p>
                        <p className={`text-xs ${theme.textSub} mt-1`}>完成主题数</p>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-neutral-700 mx-4" />
                    <div className="text-center">
                        <p className={`text-3xl font-bold ${theme.accentGoldText}`}>{totalArticles}</p>
                        <p className={`text-xs ${theme.textSub} mt-1`}>已阅读文章</p>
                    </div>
                </div>
    
                <h3 className={`text-base font-bold ${theme.textMain}`}>我的成就</h3>
                <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.border} space-y-2`}>
                   <div className={`text-sm ${theme.textMain} opacity-80`}>🧘 冥想大师：连续打卡 30 天</div>
                   <div className={`text-sm ${theme.textMain} opacity-50`}>📚 知识探索者：阅读合集达到 80%</div>
                </div>
    
            </div>
        </div>
    );
};

const PaymentRecordsDetailView = ({ theme, onBack }) => {
    const [redeemCode, setRedeemCode] = useState('');
    
    const handleRedeem = () => {
        // 替代 alert
        console.log(`尝试兑换码: ${redeemCode}`);
        setRedeemCode('');
    };
    
    return (
        <div className={`pb-24 min-h-screen ${theme.bg}`}>
            <BackHeader theme={theme} title="付款记录" onBack={onBack} />
            <div className="p-4 space-y-4">
                
                <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.border} shadow-sm`}>
                    <h3 className={`text-sm font-bold pb-2 ${theme.textMain}`}>产品激活与有效期</h3>
                    <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300 dark:border-neutral-600">
                        <div className="flex items-center gap-2"><Briefcase size={18} className={theme.textSub} /> <span className={theme.textMain}>产品激活</span></div>
                        <span className={`text-sm font-medium ${MOCK_USER.vipExpiry ? theme.accentGoldText : theme.textSub}`}>
                            {MOCK_USER.vipExpiry ? 'Moti Pro 已激活' : '未激活'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2"><Calendar size={18} className={theme.textSub} /> <span className={theme.textMain}>有效期至</span></div>
                        <span className={`text-sm font-mono ${theme.textSub}`}>{MOCK_USER.vipExpiry || '无'}</span>
                    </div>
                </div>
                
                <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.border} shadow-sm`}>
                    <h3 className={`text-sm font-bold pb-3 ${theme.textMain}`}>兑换码输入</h3>
                    <div className="flex items-center gap-2">
                        <Gift size={20} className={theme.textSub} />
                        <input 
                            type="text" 
                            value={redeemCode}
                            onChange={(e) => setRedeemCode(e.target.value)}
                            placeholder="输入兑换码..."
                            className={`flex-1 px-3 py-2 text-sm rounded-lg outline-none border ${theme.border} ${theme.inputBg} focus:border-[#C99C00] ${theme.textMain}`}
                        />
                        <button 
                            onClick={handleRedeem}
                            className={`px-3 py-2 text-xs font-bold rounded-lg text-white ${theme.accentGoldBg} transition-opacity hover:opacity-90`}
                        >
                            兑换
                        </button>
                    </div>
                </div>
    
                <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.border} shadow-sm`}>
                    <h3 className={`text-sm font-bold mb-3 ${theme.textMain}`}>付款记录 ({MOCK_PAYMENT_RECORDS.length} 条)</h3>
                    <div className="space-y-2">
                        {MOCK_PAYMENT_RECORDS.map(record => (
                            <div key={record.id} className={`flex justify-between items-center text-sm py-2 border-b ${theme.border} last:border-b-0`}>
                                <div className="flex flex-col">
                                   <span className={theme.textMain} title={record.product}>{record.product}</span>
                                   <span className={`text-xs ${theme.textSub}`}>{record.date}</span>
                                </div>
                                <span className={`text-sm font-mono font-bold ${theme.accentGoldText}`}>{record.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>
    
            </div>
        </div>
    );
};

const SettingsView = ({ theme, darkMode, setDarkMode, onBack }) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(MOCK_USER.isNotificationEnabled);
    
    const handleNotificationToggle = () => {
        setNotificationsEnabled(prev => !prev);
    };
    
    return (
        <div className={`pb-24 min-h-screen ${theme.bg}`}>
            <BackHeader theme={theme} title="设置" onBack={onBack} />
            <div className="p-4 space-y-6">
                
                <h3 className={`text-base font-bold ${theme.textMain}`}>通知提醒</h3>
                <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.border}`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Bell size={20} className={theme.textSub} />
                            <span className={theme.textMain}>接收推送通知</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={notificationsEnabled} onChange={handleNotificationToggle} className="sr-only peer" />
                            <div className={`w-11 h-6 rounded-full peer transition-colors ${notificationsEnabled ? theme.accentGoldBg : 'bg-gray-300 dark:bg-neutral-600'}`}>
                                <div className={`absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </label>
                    </div>
                </div>
                
                <h3 className={`text-base font-bold ${theme.textMain}`}>界面设置</h3>
                <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.border}`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            <span className={theme.textMain}>深色模式/浅色模式</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="sr-only peer" />
                            <div className={`w-11 h-6 rounded-full peer transition-colors ${darkMode ? 'bg-blue-500' : 'bg-gray-300 dark:bg-neutral-600'}`}>
                                <div className={`absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </label>
                    </div>
                </div>
    
                <h3 className={`text-base font-bold ${theme.textMain}`}>应用信息</h3>
                <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.border} space-y-2`}>
                    <div className={`flex justify-between items-center py-2 ${theme.textMain} border-b ${theme.border} last:border-b-0`}>
                        <span className="font-medium">版本号</span>
                        <span className={`text-sm ${theme.textSub}`}>V1.2.0 (Build 20251204)</span>
                    </div>
                    <button onClick={() => console.log('联系客服')} className={`w-full py-2 flex justify-between items-center ${theme.textMain} transition-colors hover:text-[#C99C00]`}>
                        <span className="font-medium">联系客服</span>
                        <ChevronRight size={18} className={theme.textSub} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const AboutMotiView = ({ theme, onBack }) => (
    <div className={`pb-24 min-h-screen ${theme.bg}`}>
        <BackHeader theme={theme} title="关于莫提" onBack={onBack} />
        <div className="p-6 text-center">
            <div className={`w-20 h-20 rounded-full ${theme.accentGoldBg} mx-auto mb-4 flex items-center justify-center`}>
               <Zap size={36} className="text-white" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${theme.textMain}`}>Moti 之地</h3>
            <p className={`text-sm ${theme.textSub} mb-8`}>版本号 V1.2.0</p>
            
            <div className={`text-left text-sm space-y-4 ${theme.textMain}`}>
                <p>Moti 致力于成为您的觉醒与自我成长伙伴。我们相信，每个人内在都蕴藏着无限的潜能和智慧。</p>
                <p>通过精心策划的知识合集和高质量的社区讨论，我们提供了一个安全、专注的环境，帮助您探索自我、管理情绪、优化身心健康，最终实现更深层次的平静与富足。</p>
            </div>
            
            <div className={`mt-10 pt-6 border-t ${theme.border} text-xs ${theme.textSub} space-y-1`}>
                <p>Copyright © 2025 Moti Land. All rights reserved.</p>
                <button onClick={() => console.log('隐私协议')} className="underline">隐私协议</button> · 
                <button onClick={() => console.log('服务条款')} className="underline">服务条款</button>
            </div>
        </div>
    </div>
);


const ProfileView = ({ theme, onOpenFavorites, onLogout, setSubView }) => {
    
    const profileMenuItems = [
        { label: '基本信息', icon: User, key: 'basicInfo', action: () => setSubView('basicInfo') },
        { label: '阅读进度', icon: BookOpen, key: 'reading', action: () => setSubView('reading') },
        { label: '付款记录', icon: CreditCard, key: 'payments', action: () => setSubView('payments') },
        { label: '消息提醒', icon: Bell, key: 'notifications', action: () => setSubView('settings') }, 
        { label: '我的收藏', icon: Star, key: 'favorites', action: onOpenFavorites }, 
        { label: '设置', icon: Settings, key: 'settings', action: () => setSubView('settings') },
        { label: '关于莫提', icon: Info, key: 'about', action: () => setSubView('about') },
    ];
    
    const ReadingSummary = () => (
        <div className="flex items-center gap-4">
             <span className={`text-2xl font-bold ${theme.accentGoldText}`}>{75}%</span>
             <ProgressBar darkMode={theme.bg.includes('neutral')} progress={75} />
        </div>
    );
    
    const NotificationSummary = () => (
        <span className={`text-sm font-medium ${MOCK_USER.isNotificationEnabled ? 'text-green-500' : 'text-red-500'}`}>
            {MOCK_USER.isNotificationEnabled ? '已开启' : '已关闭'}
        </span>
    );
    
    const CardItem = ({ item }) => (
        <button 
          key={item.key}
          onClick={item.action}
          className={`w-full flex items-center justify-between p-3 rounded-xl border ${theme.border} active:opacity-80 transition-opacity`}
        >
          <div className="flex items-center gap-4">
            <item.icon size={20} className={item.key === 'favorites' ? theme.accentGoldText : theme.textSub} />
            <span className={theme.textMain}>{item.label}</span>
          </div>
          <div className="flex items-center gap-1">
             {item.key === 'reading' && <ReadingSummary />}
             {item.key === 'notifications' && <NotificationSummary />}
             <ChevronRight size={16} className={`opacity-70 ${theme.textSub}`} />
          </div>
        </button>
    );
    
    return (
        <div className={`p-4 pb-24 min-h-screen ${theme.bg}`}>
            
            <div className={`p-4 rounded-xl shadow-lg mb-6 ${theme.cardBg} border ${theme.border}`}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-2 border-white dark:border-neutral-800 shadow-lg">
                   <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${theme.textMain}`}>{MOCK_USER.name}</h2>
                  <p className={`text-sm ${theme.textSub}`}>{MOCK_USER.nickname} · Lv{MOCK_USER.level}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
               {profileMenuItems.map(item => <CardItem key={item.key} item={item} />)}
            </div>
    
             <button 
               onClick={onLogout}
               className={`w-full flex items-center justify-center gap-3 p-3 mt-8 rounded-xl font-bold text-red-500 border border-red-500 transition-colors hover:bg-red-500 hover:text-white`}
             >
               <LogOut size={20} />
               退出登录
             </button>
        </div>
    );
};


// --- 新增：登录流程组件 ---

const SplashScreen = ({ onComplete, theme }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 1800); // 1.8秒后进入授权页
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 flex flex-col items-center justify-center ${theme.bg} ${theme.textMain} transition-colors duration-500`}>
            <div className="flex flex-col items-center animate-fade-in-slow">
                <Zap size={64} className={theme.accentGoldText} strokeWidth={2} />
                <h1 className="text-3xl font-extrabold mt-4">Moti 之地</h1>
                <p className={`text-base mt-2 ${theme.textSub}`}>探索觉醒与自我成长</p>
            </div>
            <div className={`absolute bottom-10 text-sm ${theme.textSub}`}>
                正在加载资源...
            </div>
        </div>
    );
};

const AuthScreen = ({ onLogin, theme }) => {
    return (
        <div className={`fixed inset-0 flex flex-col items-center justify-between p-8 ${theme.bg} ${theme.textMain} transition-colors duration-500`}>
            {/* 顶部应用信息 */}
            <div className="flex flex-col items-center pt-20">
                <Zap size={80} className={theme.accentGoldText} strokeWidth={2} />
                <h1 className="text-3xl font-extrabold mt-6">Moti 之地</h1>
                <p className={`text-base mt-2 ${theme.textSub}`}>申请使用您的微信信息</p>
            </div>

            {/* 中部授权说明 */}
            <div className={`w-full p-6 rounded-xl border ${theme.border} ${theme.cardBg} text-sm shadow-lg`}>
                <h3 className={`font-bold mb-3 ${theme.textMain}`}>权限说明</h3>
                <ul className={`list-disc pl-5 ${theme.textSub} space-y-1`}>
                    <li>获取您的微信昵称、头像。</li>
                    <li>用于登录、识别用户身份和提供个性化服务。</li>
                    <li>Moti 之地将严格遵守隐私保护政策。</li>
                </ul>
            </div>
    
            {/* 底部按钮 */}
            <div className="w-full space-y-3 pb-8">
                <button 
                    onClick={onLogin}
                    className="w-full py-3.5 rounded-xl font-bold text-white bg-green-500 shadow-xl shadow-green-500/30 flex items-center justify-center gap-2 transition-all hover:bg-green-600"
                >
                    <WechatIcon size={20} />
                    微信一键登录
                </button>
                <button 
                    onClick={() => console.log('用户选择暂不授权')}
                    className={`w-full py-3.5 rounded-xl font-medium ${theme.textSub} border ${theme.border} hover:opacity-80`}
                >
                    暂不授权
                </button>
            </div>
        </div>
    );
};

// --- 主应用内容组件 (原 MotiLandApp) ---
const MainAppContent = ({ darkMode, setDarkMode, initialPosts }) => {
  const [activeTab, setActiveTab] = useState('latest');
  const [posts, setPosts] = useState(initialPosts);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [readingArticle, setReadingArticle] = useState(null); 
  const [profileSubView, setProfileSubView] = useState(null); 

  const theme = useTheme(darkMode);

  const toggleFavorite = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const favorites = posts.filter(p => p.isFavorite);

  const handleOpenArticle = useCallback((article) => {
    const fullArticle = {
      ...article,
      content: article.content || MOCK_ARTICLE_CONTENT,
      author: article.author || 'Moti 导师',
      time: '今日'
    };
    setReadingArticle(fullArticle);
  }, []);

  const handleLogout = () => {
    console.log('用户退出登录');
    setActiveTab('latest');
    // 模拟退出后回到起始页
    window.location.reload(); 
  };

  const LatestView = () => {
    const [filterType, setFilterType] = useState('latest');
    const displayPosts = posts
      .sort((a, b) => {
        if (filterType === 'latest') return b.timestamp - a.timestamp;
        if (filterType === 'hot') return b.upvotes - a.upvotes;
        return 0;
      })
      .slice(0, 6); 

    return (
      <div className="pb-24">
        <div className={`mx-4 mt-3 mb-2 px-3 py-2.5 rounded-lg flex items-center gap-2 ${theme.inputBg}`}>
           <Search size={16} className={theme.textSub} />
           <input type="text" placeholder="搜索..." className={`bg-transparent w-full text-sm outline-none ${theme.textMain}`} />
        </div>
    
        <div className="px-4 py-2">
          <div className={`flex p-1 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-gray-100'}`}>
            {['latest', 'hot'].map((type) => (
               <button
                 key={type}
                 onClick={() => setFilterType(type)}
                 className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all duration-200 
                   ${filterType === type ? `bg-white shadow-sm text-[#C99C00] dark:bg-neutral-700` : theme.textSub}`}
               >
                 {type === 'latest' ? '最新' : '最热'}
               </button>
            ))}
          </div>
        </div>
    
        <div className="mt-1">
          {displayPosts.map(post => (
            <div 
              key={post.id} 
              onClick={() => handleOpenArticle(post)}
              className={`py-4 px-4 border-b ${theme.border} ${theme.cardBg} active:bg-opacity-80 transition-all cursor-pointer`}
            >
              <h3 className={`text-[16px] font-medium leading-snug mb-2 ${theme.textMain}`}>{post.title}</h3>
              <div className={`flex justify-between items-center text-xs ${theme.textSub}`}>
                <div className="flex gap-2">
                   <span className="text-[#C99C00]">{post.category}</span>
                   <span>· {post.author}</span>
                </div>
                <div className="flex gap-3">
                   <span>{post.upvotes} 赞</span>
                   <span>{post.comments} 评</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TreeTopicsView = () => (
      <div className={`min-h-screen pb-24 ${theme.bg}`}>
          <div className={`mx-4 mt-3 mb-4 px-3 py-2.5 rounded-lg flex items-center gap-2 ${theme.inputBg}`}>
              <Search size={16} className={theme.textSub} />
              <input type="text" placeholder="检索知识库..." className={`bg-transparent w-full text-sm outline-none ${theme.textMain}`} />
          </div>

          <div className="px-4">
            <h2 className={`text-xl font-bold mb-4 px-2 border-l-4 border-[#C99C00] ${theme.textMain}`}>觉醒之路 · 索引</h2>
            <div className={`${theme.cardBg} rounded-xl border ${theme.border} overflow-hidden shadow-sm p-8 text-center ${theme.textSub}`}>
                知识树合集内容占位符...
            </div>
          </div>
      </div>
  );

  const Header = () => (
    <div className={`sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b ${theme.bg} ${theme.border} transition-colors duration-300`}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center overflow-hidden border border-gray-100">
             <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C99C00] text-[8px] text-white flex items-center justify-center rounded-full border-2 border-white dark:border-neutral-800">
            Lv{MOCK_USER.level}
          </div>
        </div>
        <ProgressBar darkMode={darkMode} />
      </div>
      
      <div className="flex items-center gap-5">
         <button onClick={() => setDarkMode(!darkMode)} className={theme.textSub}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className={`relative ${theme.textSub}`}>
          <MessageSquare size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      </div>
    </div>
  );

  const NavBar = () => {
    const navItems = [
      { id: 'latest', icon: Zap, label: '最新' },
      { id: 'topics', icon: BookOpen, label: '合集' }, 
      { id: 'ask', icon: Users, label: '社区' }, 
      { id: 'profile', icon: User, label: '我的' },
    ];

    if (readingArticle || profileSubView) return null; 
    
    return (
      <div className={`fixed bottom-0 w-full max-w-[402px] flex justify-around items-center py-2 pb-5 border-t ${theme.cardBg} ${theme.border} z-20`}>
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 w-16 transition-all duration-300 ${isActive ? '-translate-y-1' : ''}`}
            >
              <item.icon 
                size={isActive ? 24 : 22} 
                className={isActive ? theme.tabActive : theme.tabInactive} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium ${isActive ? theme.tabActive : theme.tabInactive}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderProfileSubView = () => {
      switch (profileSubView) {
          case 'basicInfo':
              return <BasicInfoView theme={theme} onBack={() => setProfileSubView(null)} />;
          case 'reading':
              return <ReadingProgressDetailView theme={theme} onBack={() => setProfileSubView(null)} />;
          case 'payments':
              return <PaymentRecordsDetailView theme={theme} onBack={() => setProfileSubView(null)} />;
          case 'settings':
              return <SettingsView theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} onBack={() => setProfileSubView(null)} />;
          case 'about':
              return <AboutMotiView theme={theme} onBack={() => setProfileSubView(null)} />;
          case null:
          default:
              return (
                  <ProfileView 
                    theme={theme} 
                    onOpenFavorites={() => setIsDrawerOpen(true)}
                    onLogout={handleLogout}
                    setSubView={setProfileSubView}
                  />
              );
      }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme.bg} selection:bg-[#C99C00] selection:text-white`}>
      
      <main className="max-w-[402px] mx-auto min-h-screen relative shadow-2xl overflow-hidden border-x border-gray-200/50 bg-inherit">
        
        {!readingArticle && !profileSubView && <Header />}
        
        <div className="animate-fade-in">
           {readingArticle ? (
             <ArticleReader 
               article={readingArticle} 
               onClose={() => setReadingArticle(null)}
               theme={theme}
               isFavorite={posts.find(p => p.id === readingArticle.id)?.isFavorite}
               toggleFavorite={toggleFavorite}
             />
           ) : (
             <>
               {activeTab === 'latest' && <LatestView />}
               {activeTab === 'topics' && <TreeTopicsView />}
               {activeTab === 'ask' && <AskView theme={theme} onOpenArticle={handleOpenArticle} />}
               {activeTab === 'profile' && renderProfileSubView()}
             </>
           )}
        </div>
        
        <NavBar />
        
        <FavoritesDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          favorites={favorites} 
          theme={theme}
          onSelect={handleOpenArticle}
        />
    
      </main>
    </div>
  );
};


// --- Root Wrapper Component ---

export default function MotiLandAppWrapper() {
    const [darkMode, setDarkMode] = useState(false);
    // 状态机: 'splash' -> 'auth' -> 'main'
    const [currentScreen, setCurrentScreen] = useState('splash'); 
    
    const theme = useTheme(darkMode);
    
    let content;
    
    if (currentScreen === 'splash') {
        content = <SplashScreen onComplete={() => setCurrentScreen('auth')} theme={theme} />;
    } else if (currentScreen === 'auth') {
        // AuthScreen 传入 onLogin 方法，用于在授权成功后进入主应用
        content = <AuthScreen onLogin={() => setCurrentScreen('main')} theme={theme} />;
    } else {
        content = <MainAppContent 
                    darkMode={darkMode} 
                    setDarkMode={setDarkMode} 
                    initialPosts={MOCK_POSTS} 
                  />;
    }
    
    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${theme.bg}`}>
             <style>{`
                /* Add a simple fade-in animation for content loading */
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeInSlow {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in-slow {
                    animation: fadeInSlow 1.5s ease-out forwards;
                }
             `}</style>
            <div className="max-w-[402px] mx-auto min-h-screen relative shadow-2xl border-x border-gray-200/50 bg-inherit overflow-hidden">
                {content}
            </div>
        </div>
    );
}