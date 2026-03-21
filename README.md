<div align="center">
  <!-- PLACEHOLDER FOR BANNER LOGO -->
  <!-- <img src="docs/assets/parixa-banner.png" alt="Parixa Banner" width="100%"/> -->

  # 🎓 Parixa: Intelligent Assessment & Proctoring Platform

  A cutting-edge, MERN-stack examination ecosystem that leverages **Google Gemini AI** to instantly generate localized curriculum assessments with an embedded **Zero-Tolerance Anti-Cheat Proctoring Engine**.

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#environment-variables">Env Variables</a>
  </p>
</div>

---

## 📸 Platform Glimpses

> **Note:** Screenshots pending UI/UX revamp merge.
> <!-- PLACEHOLDERS FOR SCREENS -->
> * <details><summary><b>Admin Dashboard & Analytics</b></summary> 
>   <br/>`<img src="docs/assets/admin-view.png" width="800">`</details>
> * <details><summary><b>Educator AI Test Generation Zone</b></summary>
>   <br/>`<img src="docs/assets/ai-generation.png" width="800">`</details>
> * <details><summary><b>Student Zero-Tolerance Proctored Interface</b></summary>
>   <br/>`<img src="docs/assets/student-proctored.png" width="800">`</details>

---

## ⚡ Key Features

*   **🧠 AI Exam Generation (Gemini 1.5 Flash):** Teachers can seamlessly upload PDF syllabuses or paste raw text. The application interfaces with Google Gemini to dynamically compile structured JSON-based multiple-choice exams within seconds.
*   **🛡️ Zero-Tolerance Client Proctoring:** Once a student navigates to a live exam, a `visibilitychange` listener locks down OS-level focus. Minimizing the browser or switching tabs instantly triggers an irrevocable auto-submission violation, preventing web-search cheating.
*   **👥 Class/Cohort Segregation Engine:** Administrators can upload massive structured CSVs separating students and teachers. MongoDB groups them organically, allowing teachers to isolate entire classrooms in an intuitive dropdown for single-click exam assignment.
*   **🔒 Secure Role-Based Architecture:** Strictly protected MongoDB schemas combined with hardened Express.js middleware routes and JWT decryption prevent privilege escalation attempts outright. Server scrubs exact answers from the payload before sending test papers to the client rendering network sniffing useless.
*   **📊 Granular Performance Auditing:** Instantly calculates performance margins, tracks proctoring logs, and maps out post-publication reviews where students can compare visual differences between their answers and the algorithm's correct variants.

---

## 🚀 Tech Stack

**Client:**
*   React.js 18
*   React Router v6
*   Vite (Bundler)
*   Tailwind CSS (Utility Styling)
*   Lucide React (Iconography)

**Server:**
*   Node.js & Express.js
*   MongoDB & Mongoose (NoSQL Database)
*   JSON Web Tokens (Stateless Security)
*   Bcryptjs (Cryptographic Hashing)

**Third-Party Integrations:**
*   Google Generative AI (Gemini 1.5)
*   SendGrid SMTP (Email Automations & Alerts)

---

## 📂 Architecture Overview
```text
📦 Parixa
├── backend/                  # Server-side logic
│   ├── models/               # Mongoose Schema Definitions (User, Exam, Question, Submission)
│   ├── routes/               # Express specific routing & API pipelines
│   ├── middleware/           # JWT and Role-Verification logic
│   ├── utils/                # Controllers (AI Services, Email configurations)
│   └── server.js             # Core Node runtime environment
├── src/                      # Client-side UI
│   ├── components/           # Reusable stateless UI components (Buttons, Modals, Navbar)
│   ├── pages/                # State-driven Views
│   │   ├── admin/            # Administrative dashboards
│   │   ├── student/          # Lock-down testing environments
│   │   └── teacher/          # Assessment orchestration
│   ├── services/             # Axios API integration
│   └── index.jsx             # React Virtual DOM injection
├── index.html                # Initial DOM mount point
└── package.json
```

---

## 🛠️ Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/parixa.git
   cd parixa
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

4. **Initiate Local Servers:**
   Open two separate terminal windows.
   *   *Terminal 1 (Vite Frontend):* `npm run dev` in the root folder.
   *   *Terminal 2 (Node Backend):* `node server.js` in the backend folder.

---

## 🔐 Environment Variables

You **must** create a `.env` file directly inside the `backend/` directory with the following structure to authorize local ports:

```env
# System Ports
PORT=5000
MONGODB_URI=your_mongodb_cluster_string_here

# Security Encryption
JWT_SECRET=super_strong_randomized_cryptographic_string

# External Connectors
GEMINI_API_KEY=your_google_ai_key_here
SENDGRID_API_KEY=your_sendgrid_token_here
EMAIL_FROM=your_verified_sender_email_here
```
> **Warning:** NEVER commit your actual `.env` keys to GitHub. Ensure `.gitignore` explicitly flags `.env` before running commits.

---

## 🤝 Contributing
The UI/UX module is actively migrating toward an enhanced component workflow. Please ensure all modifications within `/pages` are tightly linked to our `Tailwind` global variants rather than spinning up disconnected custom `.css` rules.

**License:** MIT
