import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

process.chdir(fileURLToPath(new URL("../", import.meta.url)));

function git(args, capture = false) {
  const result = spawnSync("git", args, { encoding: "utf8", stdio: capture ? "pipe" : "inherit" });
  if (result.error || result.status !== 0) {
    throw new Error(result.error?.message || result.stderr || "Git 操作失败，请根据上面的提示处理后重试。");
  }
  return result.stdout?.trim();
}

function checkAndBuild() {
  const command = "npx --yes pnpm@9.14.4 check && npx --yes pnpm@9.14.4 build";
  const result = process.platform === "win32"
    ? spawnSync("cmd.exe", ["/d", "/s", "/c", command], { stdio: "inherit" })
    : spawnSync("sh", ["-c", command], { stdio: "inherit" });
  if (result.error || result.status !== 0) throw new Error("检查或构建失败，尚未提交和推送本次修改。");
}

try {
  if (git(["branch", "--show-current"], true) !== "main") {
    throw new Error("请在博客的 main 分支发布。");
  }
  const remote = git(["remote", "get-url", "origin"], true);
  if (!/^https:\/\/github\.com\/Starlitvale\/starlitvale\.github\.io(?:\.git)?\/?$/i.test(remote)) {
    throw new Error("origin 不是此博客的 GitHub 仓库，请先检查远程地址。");
  }
  console.log("正在检查文章并生成网站……");
  checkAndBuild();
  git(["add", "--all"]);
  if (git(["diff", "--cached", "--name-only"], true)) {
    git(["commit", "-m", `Update blog ${new Date().toISOString()}`]);
  }
  git(["push", "origin", "main"]);
  console.log("\n已推送到 GitHub，正在由 Actions 自动部署。部署结果：");
  console.log("https://github.com/Starlitvale/starlitvale.github.io/actions");
  console.log("部署完成后访问：https://starlitvale.github.io/");
} catch (error) {
  console.error(`\n发布未完成：${error.message}`);
  process.exitCode = 1;
}
