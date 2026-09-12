// 读取 src/posts/ 下的所有 md，统一成一份文章列表。
// 加文章 = 往那个目录里丢一个带 frontmatter 的 md，不需要改这里。

const modules = import.meta.glob('../posts/*.md', { eager: true });

const all = Object.entries(modules)
  .map(([file, mod]) => ({
    ...mod.frontmatter,
    file,
    Content: mod.Content,
    headings: mod.getHeadings(),
  }))
  // draft: true 的文章不出现在线上
  .filter((p) => !p.draft)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export const posts = all;

export function postsInSection(sectionId) {
  return all.filter((p) => p.section === sectionId);
}

export function getPost(slug) {
  return all.find((p) => p.slug === slug);
}

export function formatDate(d) {
  const date = new Date(d);
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}
