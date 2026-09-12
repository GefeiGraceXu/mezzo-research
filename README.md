# Mezzo Research —— 站点说明

个人研究站。**手写文章为主**，数据抓取的位置已经预留好，想开的时候再开。

线上地址：待部署（Cloudflare Pages）

---

## 一、这个仓库和 Research 仓库的关系

| | `Research`（私密） | `MezzoResearch`（本仓库，公开） |
|---|---|---|
| 是什么 | 你的研究底稿库，docx 为主 | 对外的网站 |
| 谁看得到 | 只有你 | 所有人 |
| 怎么更新 | 你说 `process` / `更新 github` | 你说 `发布 <文章>` |

**底稿默认不上网**。只有你点名某一篇，它才会被转换、搬到这个仓库、发出去。这道人工闸门是故意留的。

---

## 二、日常怎么发文章

1. 你在 Word 里写好，或者直接给一份 md
2. 你说「发布」并指明是哪篇、放哪个栏目
3. 我做三件事：转成 md → 补 frontmatter → `git push`
4. Cloudflare Pages 自动构建，约 1 分钟后线上就有了

文章就是 `src/posts/` 下的一个 md 文件，开头带这段 frontmatter：

```yaml
---
title: "文章标题"
slug: chip-to-token      # 网址里的名字，用英文
section: essays          # 属于哪个栏目，见下表
date: 2026-08-05
summary: "一句话摘要，显示在列表和文章标题下面"
draft: false             # 改成 true 就不会出现在线上
---
```

写完 push 就上线，不需要改任何其他文件。

---

## 三、六个栏目

配置在 `src/config/sections.js`，改那个文件就能加减栏目。

| id | 栏目 | 类型 | 状态 |
|---|---|---|---|
| `essays` | 文章随笔 | 文章 | 已启用 |
| `industry` | 行业研究 | 文章 | 已启用（暂无内容） |
| `data` | 基础数据 | 数据看板 | 建设中 |
| `market` | 市场动态 | 数据看板 | 建设中 |
| `reading` | 读书笔记 | 文章 | 已启用（暂无内容） |
| `projects` | 小项目 | 文章 | 已启用（暂无内容） |

- **文章型**（`type: 'column'`）：内容来自 `src/posts/` 里 `section` 等于该 id 的 md
- **看板型**（`type: 'board'`）：内容将来来自 `src/data/` 里的 JSON，现在显示「建设中」占位页

---

## 四、以后要开数据抓取时

这几样东西已经建好放在那了，开启的时候不用重新搭架子：

- `src/data/` —— 抓来的 JSON 落在这里（现在空）
- `scripts/fetch/` —— 抓取脚本放这里（现在空）
- `.github/workflows/daily-data.yml` —— 定时任务，**写好了但没开**，取消 cron 那三行的注释就能跑
- 卡片的 `board` 类型 —— 首页已经支持，不用改渲染逻辑

开启的步骤只有三步：写抓取脚本 → 打开 cron → 把看板占位页换成读 JSON 的真页面。

数据源难度提前记一笔：链上数据（DeFiLlama、CoinGecko）、全球资产行情、SEC 13F、新闻 RSS 都免费；
Twitter 官方 API 最低 100 美元/月，且免费爬基本被封，要做得单独算账。

---

## 五、本地命令

```powershell
npm install        # 只需一次
npm run dev        # 本地预览 http://localhost:4321
npm run build      # 构建到 dist/
```

把老的 docx 转出来的 md 导进站点（会把「整行加粗」还原成真标题）：

```powershell
node scripts/import-doc.mjs <源md> <slug> <栏目id> --drop-head 6
```

`--drop-head N` 是跳过开头 N 行（大标题/副标题/日期那几行，它们会进 frontmatter）。

---

## 六、目录结构

```
src/
├── config/
│   ├── site.js          站名、简介、页脚
│   └── sections.js      六张卡片的定义
├── posts/               ← 文章都在这里，一篇一个 md
├── data/                ← 将来放抓取的 JSON（现在空）
├── pages/
│   ├── index.astro          首页卡片墙
│   ├── [section].astro      栏目页（文章列表 / 看板占位）
│   ├── posts/[slug].astro   文章页
│   └── about.astro
├── layouts/Base.astro   页头页脚
├── components/Icon.astro
├── lib/posts.js         读取文章列表
└── styles/global.css    全部样式，配色改开头那段变量
scripts/
├── import-doc.mjs       docx 转出来的 md 的导入工具
└── fetch/               ← 将来放抓取脚本（现在空）
```
