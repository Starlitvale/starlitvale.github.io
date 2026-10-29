# 个人博客

使用 Astro + Fuwari 构建，通过 GitHub Actions 自动部署到 GitHub Pages。

- 网站：[monitor666.github.io](https://monitor666.github.io/)
- [部署状态](https://github.com/monitor666/monitor666.github.io/actions)
- [写作与维护指南](docs/维护指南.md)

## 本地运行

需要 Node.js 24 LTS 和 Git。

```sh
npx --yes pnpm@9.14.4 install --frozen-lockfile
npx --yes pnpm@9.14.4 dev
```

## 常用命令

```sh
# 创建草稿（标题可省略，此时用文件名作为标题）
npx --yes pnpm@9.14.4 new-post my-first-post "我的第一篇文章"

# 检查并构建正式网站（含 Pagefind 中文搜索索引）
npx --yes pnpm@9.14.4 check
npx --yes pnpm@9.14.4 build
npx --yes pnpm@9.14.4 preview

# 检查、构建、提交并推送，触发自动部署
node scripts/publish.mjs
```

## 内容与配置

- 文章：`src/content/posts/`
- 站点名称、简介、署名、横幅：`src/config.ts`
- 关于页：`src/content/spec/about.md`
- 公共图片：`public/`
- 部署流程：`.github/workflows/deploy.yml`

文章设为 `draft: true` 时不会出现在生成的网站中，但提交后的源文件仍然能在公开仓库中看到。

## 模板来源

[Fuwari](https://github.com/saicaca/fuwari) 采用 MIT 许可，详见 [LICENSE](LICENSE)。[上游说明](docs/README.upstream.md)、[示例文章](docs/examples/) 和 [图片来源](docs/图片来源.md) 保留供参考。模板代码许可与博客文章版权相互独立。
