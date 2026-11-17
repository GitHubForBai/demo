import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(root, "src", p), "utf8");
const safeScript = (s) => s.replace(/<\/script/gi, "<\\/script");

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>汉语助教 HanAssist · 国际中文教学 AI 工作台 产品与技术方案</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%E6%B1%89%3C/text%3E%3C/svg%3E">
<meta name="description" content="面向中国教师教外国学生汉语的 AI 辅助教学产品方案：13 个痛点逐条拆解、中文纠音方案、权威分级引擎、可交互界面原型、技术架构与上市路线。">
<style>
${read("styles.css")}
</style>
</head>
<body>
${read("body.html")}
<script>
${safeScript(read("vendor/hanzi-writer.min.js"))}
</script>
<script>
${safeScript(read("vendor/hanzi-data.js"))}
</script>
<script>
${safeScript(read("app.js"))}
</script>
</body>
</html>
`;

writeFileSync(join(root, "index.html"), html);
console.log(`index.html written (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
