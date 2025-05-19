# Web Dev Wizard CLI 🧙‍♂️

Welcome to **Web Dev Wizard**, a TypeScript-powered CLI tool that scaffolds fully styled and functional Next.js websites — ready to launch.

---

## 🔧 How It Works

After running the wizard, your project will be ready with:

- ✅ Prebuilt layout with Navbar + Footer
- ✅ SCSS styling
- ✅ SEO-friendly `<Head>` tags and sitemap
- ✅ Dynamic favicon/logo
- ✅ Git initialized with first commit
- ✅ Responsive structure with a full-page hero
- ✅ Optional e-commerce support (cart + login components)
- ✅ Lottie-based animated About & Contact pages
- ✅ FAQ + Legal pages (Privacy Policy, Terms)

---

## 🏗️ Folder Structure

### Static Site

\`\`\`
src/
├── app/
│   ├── page.tsx              → Homepage
│   ├── layout.tsx            → Global Layout
│   ├── contact/              → Contact Page
│   └── about/                → About Page
├── components/
│   ├── navbar/               → Main navigation bar
│   ├── footer/               → Page footer
│   └── home/hero/            → Hero banner section
├── styles/
│   ├── Global.scss           → Global styles
│   └── App.scss              → App-wide wrapper styling
public/
├── assets/                   → Logo, icons, hero image
├── favicon.ico
├── sitemap.xml
\`\`\`

### E-commerce Additions

\`\`\`
src/
├── app/
│   ├── login/                → Login page
│   └── cart/                 → Shopping cart page
├── components/ecommerce/
│   ├── login/
│   │   ├── LoginButton.tsx
│   │   └── LoginForm.tsx
│   └── basket/
│       ├── Basket.tsx
│       └── BasketButton.tsx
\`\`\`

---

## 🚀 Quick Start

\`\`\`bash
# 1. Clone the repo
git clone https://github.com/your-username/web-dev-wizard.git

# 2. Install globally
cd web-dev-wizard
yarn global add file:./

# 3. Run the CLI
web-dev-wizard
\`\`\`

If you prefer running without global install:
\`\`\`bash
ts-node src/index.ts
\`\`\`

> Or compile the project with \`tsc\` and run:
\`\`\`bash
node dist/index.js
\`\`\`

---

## ⚙️ Requirements

- Node.js 18+
- Yarn (or npm if modified)
- TypeScript CLI (\`ts-node\` if running directly from source)

---

## 🧪 Support & Contributions

Have feature requests, feedback, or bugs?

**Reach me directly:**

- 📧 Email: [adaptiveworkflow@gmail.com](mailto:adaptiveworkflow@gmail.com)
- 📱 Phone: 07982623565
- 📷 Instagram: [@awc_adaptiveworks](https://www.instagram.com/awc_adaptiveworks/)

Pull requests are welcome!

---

## 👤 About the Creator

**AWC – Adaptive Workflow Consultancy**  
Built by a full-stack website engineer & DevOps consultant.

- 🔁 Automated workflows
- ☁️ AWS/Terraform deployments
- 💻 Full-stack development
- 🌐 Helping businesses launch sites fast

Visit: [adaptiveworks.net](https://adaptiveworks.net)
