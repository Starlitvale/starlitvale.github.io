import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { spawn } from "node:child_process";

const postsDir = fileURLToPath(new URL("../src/content/posts/", import.meta.url));
const [argument, titleArgument] = process.argv.slice(2);
const interactive = !argument;
let fileName = argument;
let title = titleArgument || argument;

if (interactive) {
  const input = createInterface({ input: process.stdin, output: process.stdout });
  title = (await input.question("文章标题：")).trim();
  if (title) fileName = (await input.question("英文文件名（留空自动生成）：")).trim();
  input.close();
}

if (!title?.trim()) {
  console.error("请输入文章标题。");
  process.exit(1);
}

const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
fileName ||= `${date}-${Date.now().toString(36)}`;
if (!fileName.endsWith(".md")) fileName += ".md";
const fullPath = path.resolve(postsDir, fileName);
if (!fullPath.startsWith(postsDir) || path.isAbsolute(fileName)) {
  console.error("文章必须保存在 src/content/posts 目录内。");
  process.exit(1);
}

fs.mkdirSync(path.dirname(fullPath), { recursive: true });
try {
  fs.writeFileSync(fullPath, `---
title: ${JSON.stringify(title)}
published: ${date}
description: ""
image: ""
tags: []
category: ""
draft: true
lang: ""
---

从这里开始写正文。
`, { flag: "wx" });
} catch (error) {
  if (error.code === "EEXIST") console.error("同名文章已存在，请换一个文件名。");
  else console.error(error.message);
  process.exit(1);
}

console.log(`已创建草稿：${fullPath}`);
console.log("准备好公开时，将 draft: true 改成 draft: false，再双击“发布博客.cmd”。");
if (interactive && process.platform === "win32") {
  const editor = spawn("notepad.exe", [fullPath], { detached: true, stdio: "ignore" });
  editor.on("error", () => console.log("请用文本编辑器打开上面的文件。"));
  editor.unref();
}
