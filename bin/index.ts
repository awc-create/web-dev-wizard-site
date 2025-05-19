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

function ask(question: string) {
  return new Promise<string>(resolve => rl.question(question, resolve));
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 Updated path handling for compiled CLI
const baseDir = path.resolve(__dirname, "..", "template");

function toPascalCase(str: string) {
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
  const additionalNav = await ask("\n➕ Add any additional nav links? (comma-separated, or leave blank): ");

  if (!projectName) {
    console.log("❌ Project name is required.");
    process.exit(1);
  }

  const projectPath = path.resolve(projectName);

  console.log(`\n🚀 Creating Next.js project: ${projectName}...`);
  execSync(`yarn create next-app ${projectName} --typescript --no-src-dir`, { stdio: "inherit" });

  const toRemove = [
    "public/vercel.svg",
    "src/app/page.tsx",
    "src/app/favicon.ico",
    "src/app/globals.css",
    "README.md"
  ];
  toRemove.forEach(rel => {
    const full = path.join(projectPath, rel);
    if (fs.existsSync(full)) fs.rmSync(full, { recursive: true, force: true });
  });

  const rootApp = path.join(projectPath, "app");
  if (fs.existsSync(rootApp)) fs.rmSync(rootApp, { recursive: true, force: true });

  const foldersToCopy = [
    "src/app",
    "src/components",
    "src/styles",
    "public/assets",
    "src/assets"
  ];
  foldersToCopy.forEach(folder => {
    fse.copySync(path.join(baseDir, folder), path.join(projectPath, folder), { overwrite: true });
  });

  fs.copyFileSync(path.join(baseDir, "public/favicon.ico"), path.join(projectPath, "public/favicon.ico"));

  const extraPages = additionalNav.split(",").map(p => p.trim().toLowerCase()).filter(Boolean);
  const navOrder = ["", "about", "contact", ...extraPages];

  for (const page of extraPages) {
    const isNumeric = /^[0-9]/.test(page);
    const safePage = isNumeric ? `page${page}` : page;
    const pascal = toPascalCase(safePage);
    const dir = path.join(projectPath, `src/app/${page}`);
    fs.mkdirSync(dir, { recursive: true });
  
    fs.writeFileSync(path.join(dir, `${pascal}Client.tsx`),
  `"use client";
  import styles from "./${pascal}.module.scss";
  export default function ${pascal}Client() {
    return (
      <div className={styles.wrapper}>
        <h1>${page}</h1>
        <p>This is a placeholder for the ${page} page.</p>
      </div>
    );
  }`);
    fs.writeFileSync(path.join(dir, `page.tsx`),
  `import ${pascal}Client from "./${pascal}Client";
  export const metadata = {
    title: "${page}",
    description: "Learn more about ${page} on our website.",
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
  

  const configDir = path.join(projectPath, "src/config");
  fs.mkdirSync(configDir, { recursive: true });
  const configLines = navOrder.map(slug => {
    const label = slug === "" ? "Home" : toPascalCase(slug).replace(/([a-z])([A-Z])/g, "$1 $2");
    return `  { slug: "${slug}", label: "${label}" },`;
  });
  fs.writeFileSync(path.join(configDir, "menu.config.ts"),
`// Auto-generated nav menu
export const NAV_LINKS = [
${configLines.join("\n")}
];`);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    [...navSet].map(p => `  <url><loc>https://${siteDomain}/${p}</loc></url>`).join("\n") + "\n</urlset>";
  fs.writeFileSync(path.join(projectPath, "public/sitemap.xml"), sitemap);

  const nextConf = projectType === "1"
    ? `module.exports = { reactStrictMode: true, output: 'export', trailingSlash: true, images: { unoptimized: true } };`
    : `module.exports = { reactStrictMode: true, trailingSlash: true, images: { domains: ['cdn.example.com'] } };`;
  fs.writeFileSync(path.join(projectPath, "next.config.js"), nextConf);

  if (projectType === "2") {
    const ecommerceApp = path.join(baseDir, "ecommerce/app");
    const ecommerceComponents = path.join(baseDir, "ecommerce/components");
    fse.copySync(ecommerceApp, path.join(projectPath, "src/app"), { overwrite: true });
    fse.copySync(ecommerceComponents, path.join(projectPath, "src/components/ecommerce"), { overwrite: true });
  } else {
    const navbarPath = path.join(projectPath, "src/components/navbar/Navbar.tsx");
    if (fs.existsSync(navbarPath)) {
      let code = fs.readFileSync(navbarPath, "utf-8");
  
      // 🧹 Remove useState for CartIcon and LoginButton
      code = code.replace(
        /const\s+\[CartIcon[^\n]*\n\s*const\s+\[LoginButton[^\n]*\n?/,
        ""
      );
  
      // 🧹 Remove useEffect block
      code = code.replace(
        /useEffect\(\(\)\s*=>\s*{\s*const\s+loadIcons\s*=\s*async\s*\(\)\s*=>\s*{[\s\S]*?loadIcons\(\);\s*},\s*\[isEcommerce\]\);?/,
        ""
      );
  
      // 🧹 Remove JSX block for CartIcon and LoginButton
      code = code.replace(
        /\{isEcommerce && CartIcon && LoginButton && \(\s*<div className={styles.actions}>\s*<CartIcon\s*\/>\s*<LoginButton\s*\/>\s*<\/div>\s*\)\}/,
        ""
      );
  
      fs.writeFileSync(navbarPath, code, "utf-8");
      console.log("🧹 Removed ecommerce logic and JSX from Navbar for static site.");
    }
  }  

  const tsconfigPath = path.join(projectPath, "tsconfig.json");
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));
    tsconfig.compilerOptions.baseUrl = "src";
    tsconfig.compilerOptions.paths = { "@/*": ["*"] };
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  }

  try {
    execSync("yarn add --dev sass", { cwd: projectPath, stdio: "inherit" });
    execSync("yarn add react-icons @iconify/react lottie-react", { cwd: projectPath, stdio: "inherit" });
    console.log("✅ Installed dependencies");
  } catch {
    console.warn("⚠️ Failed installing dependencies. Run manually:");
    console.warn("   yarn add --dev sass");
    console.warn("   yarn add react-icons @iconify/react lottie-react");
  }

  // .env and .env.example generation
  const siteMode = projectType === "2" ? "ecommerce" : "static";

  const envContent =
`NEXT_PUBLIC_SITE_URL=https://${siteDomain}
NEXT_PUBLIC_SITE_MODE=${siteMode}
NEXT_PUBLIC_API_BASE_URL=https://api.example.com`;

  fs.writeFileSync(path.join(projectPath, ".env.example"), envContent);
  fs.writeFileSync(path.join(projectPath, ".env"), envContent);

  console.log(`🧠 Site mode set to '${siteMode}' in .env`);

  fs.writeFileSync(path.join(projectPath, "README.md"),
`# ${projectName}
Generated with Web Dev Wizard CLI 🧙‍♂️

\`\`\`bash
cd ${projectName}
yarn dev
\`\`\`

Visit: https://${siteDomain}`);

  try {
    execSync("git init", { cwd: projectPath, stdio: "inherit" });
    execSync("git add .", { cwd: projectPath, stdio: "inherit" });
    execSync('git commit -m "Initial commit from Web Dev Wizard CLI 🧙‍♂️"', { cwd: projectPath, stdio: "inherit" });
  } catch {
    console.warn("⚠️ Git init failed");
  }

  console.log(`\n✅ All done! Now run:\n\ncd ${projectName}\nyarn dev`);
  rl.close();
})();
