#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import fse from "fs-extra";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function toPascalCase(str) {
  return str.replace(/(^\w|[-_\s]\w)/g, match =>
    match.replace(/[-_\s]/, "").toUpperCase()
  );
}

(async function runWizard() {
  console.log("\n✨ Welcome to the Web Dev Wizard CLI ✨");

  const projectName = await ask("📁 Project name (e.g. my-site): ");
  const siteDomain = await ask("🌍 Site domain (e.g. www.example.com): ");
  let projectType = await ask(
    "🧩 Project type:\n" +
      "  1. Static site (Home, About, Contact)\n" +
      "  2. E-commerce site (Static + icon Cart, icon Login)\n" +
      "Enter 1 or 2: "
  );

  while (!["1", "2"].includes(projectType.trim())) {
    projectType = await ask("❓ Please enter either 1 or 2: ");
  }

  const defaultNav = ["about", "contact"];
  const ecommerceExtras = [""];
  if (projectType === "2") defaultNav.push(...ecommerceExtras);

  console.log("\n🧭 Default navigation links:");
  console.log("- Home");
  defaultNav.forEach(link => console.log(`- ${link.charAt(0).toUpperCase() + link.slice(1)}`));

  const additionalNav = await ask(
    "\n➕ Add any additional nav links? (comma-separated, or leave blank): "
  );

  if (!projectName) {
    console.log("❌ Project name is required.");
    process.exit(1);
  }

  const projectPath = path.resolve(projectName);
  const baseDir = path.join(__dirname, "template");

  console.log(`\n🚀 Creating Next.js project: ${projectName}...`);
  execSync(`yarn create next-app ${projectName} --typescript --no-src-dir`, { stdio: "inherit" });

  // Remove default files
  const toRemove = [
    "public/vercel.svg",
    "src/app/page.tsx",
    "src/app/favicon.ico",
    "src/app/globals.css",
    "README.md"
  ];
  for (const relPath of toRemove) {
    const fullPath = path.join(projectPath, relPath);
    if (fs.existsSync(fullPath)) fs.rmSync(fullPath, { recursive: true, force: true });
  }

  // Remove root-level app folder
  const rootApp = path.join(projectPath, "app");
  if (fs.existsSync(rootApp)) {
    fs.rmSync(rootApp, { recursive: true, force: true });
    console.log("🧹 Removed root-level app/ folder");
  }

  // Copy base template
  const foldersToCopy = ["src/app", "src/components", "src/styles", "public/assets", "src/assets"];
  for (const folder of foldersToCopy) {
    const src = path.join(baseDir, folder);
    const dest = path.join(projectPath, folder);
    fse.copySync(src, dest, { overwrite: true });
  }
  fs.copyFileSync(path.join(baseDir, "public/favicon.ico"), path.join(projectPath, "public/favicon.ico"));

  // Parse additional nav links
  const extraPages = additionalNav
    .split(",")
    .map(p => p.trim().toLowerCase())
    .filter(Boolean);

  const navSet = new Set(["", ...defaultNav, ...extraPages]);

  // Create nav pages
  for (const page of extraPages) {
    const pascal = toPascalCase(page);
    const dir = path.join(projectPath, `src/app/${page}`);
    fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(path.join(dir, `${pascal}Client.tsx`),
`"use client";
import styles from "./${pascal}.module.scss";
export default function ${pascal}Client() {
  return (
    <div className={styles.wrapper}>
      <h1>${pascal}</h1>
      <p>This is a placeholder for the ${pascal} page.</p>
    </div>
  );
}`);
    fs.writeFileSync(path.join(dir, `page.tsx`),
`import ${pascal}Client from "./${pascal}Client";
export const metadata = {
  title: "${pascal}",
  description: "Learn more about ${pascal} on our website.",
};
export default function ${pascal}Page() {
  return <${pascal}Client />;
}`);
    fs.writeFileSync(path.join(dir, `${pascal}.module.scss`),
`.wrapper {
  padding: 4rem;
  text-align: center;
}`);
  }

  // menu.config.ts
  const configDir = path.join(projectPath, "src/config");
  fs.mkdirSync(configDir, { recursive: true });
  const configLines = [...navSet].sort().map(slug => {
    const label = slug === "" ? "Home" : toPascalCase(slug).replace(/([a-z])([A-Z])/g, "$1 $2");
    const ecommerce = ecommerceExtras.includes(slug) ? ", ecommerce: true" : "";
    return `  { slug: "${slug}", label: "${label}"${ecommerce} },`;
  });
  fs.writeFileSync(path.join(configDir, "menu.config.ts"),
`// Auto-generated nav menu
export const NAV_LINKS = [
${configLines.join("\n")}
];`);

  // sitemap.xml
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    [...navSet].map(p => `  <url><loc>https://${siteDomain}/${p}</loc></url>`).join("\n") + "\n</urlset>";
  fs.writeFileSync(path.join(projectPath, "public/sitemap.xml"), sitemap);

  // next.config.js
  const nextConf = projectType === "1"
    ? `module.exports = { reactStrictMode: true, output: 'export', trailingSlash: true, images: { unoptimized: true } };`
    : `module.exports = { reactStrictMode: true, trailingSlash: true, images: { domains: ['cdn.example.com'] } };`;
  fs.writeFileSync(path.join(projectPath, "next.config.js"), nextConf);

// Inject ecommerce files (copy into correct subfolders without deleting source)
if (projectType === "2") {
  const ecommerceAppSrc = path.join(baseDir, "ecommerce/app");
  const ecommerceComponentsSrc = path.join(baseDir, "ecommerce/components");

  const appDest = path.join(projectPath, "src/app");
  const ecommerceComponentsDest = path.join(projectPath, "src/components/ecommerce");

  try {
    if (fs.existsSync(ecommerceAppSrc)) {
      fse.copySync(ecommerceAppSrc, appDest, { overwrite: true, errorOnExist: false });
      console.log("✅ Copied: ecommerce/app → src/app");
    } else {
      console.warn("⚠️ Skipped: ecommerce/app not found");
    }

    if (fs.existsSync(ecommerceComponentsSrc)) {
      fse.copySync(ecommerceComponentsSrc, ecommerceComponentsDest, { overwrite: true, errorOnExist: false });
      console.log("✅ Copied: ecommerce/components → src/components/ecommerce");
    } else {
      console.warn("⚠️ Skipped: ecommerce/components not found");
    }
  } catch (err) {
    console.error("❌ Failed to copy ecommerce files:", err);
  }
}

  // tsconfig.json patch
  const tsconfigPath = path.join(projectPath, "tsconfig.json");
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));
    tsconfig.compilerOptions.baseUrl = "src";
    tsconfig.compilerOptions.paths = { "@/*": ["*"] };
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  }

// Install dependencies
try {
  execSync("yarn add --dev sass", { cwd: projectPath, stdio: "inherit" });
  execSync("yarn add react-icons @iconify/react lottie-react", { cwd: projectPath, stdio: "inherit" });
  console.log("✅ Installed: sass, react-icons, @iconify/react, lottie-react");
} catch {
  console.warn("⚠️ Dependency install failed. Please run manually:");
  console.warn("   yarn add --dev sass");
  console.warn("   yarn add react-icons @iconify/react lottie-react");
}


  // .env and README
  fs.writeFileSync(path.join(projectPath, ".env.example"),
`NEXT_PUBLIC_SITE_URL=https://${siteDomain}
NEXT_PUBLIC_API_BASE_URL=https://api.example.com`);

  fs.writeFileSync(path.join(projectPath, "README.md"),
`# ${projectName}
Generated with Web Dev Wizard CLI 🧙‍♂️

\`\`\`
cd ${projectName}
yarn dev
\`\`\`
Visit: https://${siteDomain}`);

  // Git setup
  try {
    execSync("git init", { cwd: projectPath, stdio: "inherit" });
    execSync("git add .", { cwd: projectPath, stdio: "inherit" });
    execSync('git commit -m "Initial commit from Web Dev Wizard CLI 🧙‍♂️"', { cwd: projectPath, stdio: "inherit" });
  } catch {
    console.warn("⚠️ Git init failed");
  }

  console.log(`\n✅ Done! Run:\ncd ${projectName} && yarn dev`);
  rl.close();
})();
