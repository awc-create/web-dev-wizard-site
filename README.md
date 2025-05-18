# Web Dev Wizard CLI 🧙‍♂️

Welcome to **Web Dev Wizard**, a CLI tool that scaffolds fully styled and functional Next.js websites—ready to launch.

---

## 🔧 How It Works

After running the wizard, your project will be ready with:

- ✅ Prebuilt layout with Navbar + Footer
- ✅ SCSS styling
- ✅ SEO-friendly `<Head>` tags and sitemap
- ✅ Dynamic favicon/logo
- ✅ Git initialized with first commit
- ✅ Responsive structure with a full-page hero

---

## 🏗️ Folder Structure

### Static Site
```
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
```

### E-commerce Additions
```
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
```

---

## 👤 About the Creator

**AWC – Adaptive Workflow Consultancy**  
Built by a full-stack website engineer & DevOps consultant.

- 🔁 Automated workflows
- ☁️ AWS/Terraform deployments
- 💻 Front-end + Backend development
- 🌐 Helping businesses launch sites fast

Visit: [adaptiveworks.net](https://adaptiveworks.net)

---

## 🚀 Quick Start

```bash
# Run this command to start
yarn dev
```

```bash
# If you see SCSS error, install:
yarn add --dev sass
```

---

## 🧪 Support & Contributions

Feature requests, feedback, or bug fixes?  
PRs are welcome or reach out via Adaptive Workflow Consultancy.

---