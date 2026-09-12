// 首页卡片。想加一张卡片，往这个数组里加一条就行，首页和栏目页会自动出现。
//
// type: 'column' —— 文章栏目，内容来自 src/content/posts/ 里 section 等于该 id 的 md
// type: 'board'  —— 数据看板，内容将来来自 src/data/ 里的 json（现在是占位页）
//
// 现在全站只有 column 有内容，board 是给以后的自动抓取预留的位置。
export const sections = [
  {
    id: 'essays',
    type: 'column',
    title: '文章随笔',
    desc: '见解、感悟、人物，以及偶尔的胡思乱想',
    color: 'slate',
    icon: 'pen',
  },
  {
    id: 'industry',
    type: 'column',
    title: '行业研究',
    desc: '产业链、公司与生意模式的拆解底稿',
    color: 'blue',
    icon: 'layers',
  },
  {
    id: 'data',
    type: 'board',
    title: '基础数据',
    desc: '长期跟踪的宏观、行业与公司基础指标',
    color: 'green',
    icon: 'chart',
  },
  {
    id: 'market',
    type: 'board',
    title: '市场动态',
    desc: '每日新闻、事件与资产表现速览',
    color: 'amber',
    icon: 'pulse',
  },
  {
    id: 'reading',
    type: 'column',
    title: '读书笔记',
    desc: '书、报告与播客里值得留下来的部分',
    color: 'violet',
    icon: 'book',
  },
  {
    id: 'projects',
    type: 'column',
    title: '小项目',
    desc: '自己动手做的小工具与实验',
    color: 'rose',
    icon: 'cube',
  },
];

export function getSection(id) {
  return sections.find((s) => s.id === id);
}
