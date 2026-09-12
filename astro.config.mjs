// @ts-check
import { defineConfig } from 'astro/config';
import { site } from './src/config/site.js';

export default defineConfig({
  site: site.url,
  markdown: {
    // 给标题自动加锚点 id，文章页的目录靠它跳转
    shikiConfig: { theme: 'github-light' },
  },
});
