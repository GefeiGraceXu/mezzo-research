// 把 pandoc 从 docx 转出来的 md 导入站点。
//
// 用法：
//   node scripts/import-doc.mjs <源md> <slug> <栏目id> [--drop-head N]
//
// 做三件事：
//   1. 去掉 pandoc 的分页符残留（**\**）
//   2. 把「整行加粗」的行还原成真正的 md 标题，好生成目录
//   3. 补上 frontmatter（标题/日期/栏目/摘要）
//
// docx 用 Word 的样式写标题时不需要这个脚本；这个脚本是给
// 「全文都是手动加粗当标题」的老稿子用的。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const [src, slug, section, ...rest] = process.argv.slice(2);
if (!src || !slug || !section) {
  console.error('用法: node scripts/import-doc.mjs <源md> <slug> <栏目id> [--drop-head N]');
  process.exit(1);
}

const dropHead = rest.includes('--drop-head')
  ? Number(rest[rest.indexOf('--drop-head') + 1])
  : 0;

// 这些短标题单独提一级，作为正文开头的大节
const promoteToH2 = ['这份底稿要解决什么'];

const raw = readFileSync(src, 'utf8');
let lines = raw.split(/\r?\n/);

// 头部若干行（大标题、副标题、日期）已经进 frontmatter，正文里去掉
const head = lines.slice(0, dropHead);
if (dropHead) lines = lines.slice(dropHead);

const title = (head[0] ?? '').replace(/\*\*/g, '').trim();
const summary = (head[2] ?? '').replace(/\*\*/g, '').trim();

const out = lines.map((line) => {
  const t = line.trim();

  // pandoc 的分页符残留
  if (/^\*\*\\?\*\*$/.test(t) || t === '\\') return '';

  // 只有整行被加粗的，才可能是标题
  const m = t.match(/^\*\*(.+)\*\*$/);
  if (!m) return line;

  const text = m[1].trim();

  // 带 <span> 的是正文里的强调段落，不是标题
  if (text.includes('<span')) return line;

  // 第一部分 / 第二部分 …
  if (/^第[一二三四五六七八九十]+部分[　\s]/.test(text)) return `## ${text}`;

  // 1.1 / 2.3 …
  if (/^\d+\.\d+[　\s]/.test(text)) return `### ${text}`;

  if (promoteToH2.includes(text)) return `## ${text}`;

  // 其余的短行（第一关：…、表 2-1　…、四条路不是互斥的）当四级小标题
  if (text.length <= 30) return `#### ${text}`;

  // 长的就是强调段落，保持原样
  return line;
});

const today = new Date().toISOString().slice(0, 10);
const frontmatter = [
  '---',
  `title: ${JSON.stringify(title)}`,
  `slug: ${slug}`,
  `section: ${section}`,
  `date: ${today}`,
  `summary: ${JSON.stringify(summary)}`,
  'draft: false',
  '---',
  '',
].join('\n');

const dest = join('src', 'posts', `${slug}.md`);
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, frontmatter + out.join('\n').replace(/\n{3,}/g, '\n\n'), 'utf8');

const headings = out.filter((l) => /^#{2,4} /.test(l)).length;
console.log(`已写入 ${dest}`);
console.log(`标题: ${title}`);
console.log(`识别出 ${headings} 个标题`);
