# SplitSmart — AI-Powered Group Expense Manager

> Split expenses. Let AI settle the math. Pay instantly via UPI.

![SplitSmart](https://splitsmart-rosy.vercel.app/landingpage.png)

## 🔗 Live Demo
**[splitsmart-rosy.vercel.app](https://splitsmart-rosy.vercel.app)**

---

## 💡 What is SplitSmart?

SplitSmart is a web app for splitting expenses within groups — trips, flatmates, outings. Instead of a confusing list of who owes who, it uses AI to generate a plain English summary and calculates the **minimum number of transactions** needed to settle all debts.

> "Ankit owes Rohit ₹650 for dinner and cab. Settle in one payment."

---

## ✨ Features

- **Group Management** — Create groups for trips, flatmates, or outings. Add members by email.
- **Expense Tracking** — Log expenses with equal or custom splits. Categorize by food, travel, stay, and more.
- **AI Settlement Engine** — Debt simplification algorithm finds the minimum transactions to clear all balances.
- **Plain English Summary** — Google Gemini 2.5 Flash generates a human-readable summary of who owes whom and why.
- **UPI Payments** — One-tap UPI deep link on mobile. Scannable QR code on desktop.
- **Mark as Settled** — Track which payments have been completed.
- **Profile & UPI ID** — Users can save their UPI ID for seamless payment links.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | Next.js API Routes + Server Actions |
| Database | PostgreSQL on Neon |
| Auth | NextAuth.js (Email/Password) |
| AI | Google Gemini 2.5 Flash |
| Deployment | Vercel |

---

## 🧠 How the Settlement Algorithm Works

Given a group of expenses, the app calculates each member's net balance (total paid minus total owed). It then uses a **greedy debt simplification algorithm**:

1. Find the member with the highest positive balance (owed the most)
2. Find the member with the highest negative balance (owes the most)
3. Create a transaction between them for the minimum of the two amounts
4. Repeat until all balances are zero

This minimizes the total number of transactions required to settle the group.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Google AI Studio API key
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/ankeeetraj/splitsmart.git
cd splitsmart

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your values in .env.local

# Run database migrations
node db/migrations.js

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=your_neon_postgres_connection_string
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=https://splitsmart-rosy.vercel.app/
GEMINI_API_KEY=your_google_ai_studio_api_key
```

---

## 📁 Project Structure

```
splitsmart/
├── app/
│   ├── page.js                    # Landing page
│   ├── dashboard/                 # User dashboard
│   ├── groups/
│   │   ├── new/                   # Create group
│   │   └── [id]/
│   │       ├── page.js            # Group detail
│   │       ├── add-expense/       # Add expense
│   │       └── settle/            # Settlement page
│   ├── profile/                   # User profile & UPI ID
│   ├── login/                     # Auth pages
│   ├── register/
│   ├── privacy/
│   └── terms/
├── lib/
│   ├── db.js                      # Database connection
│   ├── balances.js                # Balance calculation
│   └── settle.js                  # Debt simplification algorithm
├── db/
│   └── migrations.js              # Database schema
└── public/
    └── illustration.png
```

---

## 📸 Screenshots

### Landing Page
Clean Positivus-style design with hero section and feature overview.

### Dashboard
View all your groups with live balance indicators — see at a glance who owes what.

### Settlement Page
AI-generated plain English summary + settlement cards with UPI QR codes.

---

## 🔮 Roadmap

- [ ] Email notifications when a settlement is marked
- [ ] Expense categories with analytics
- [ ] Invite members via link (no account required)
- [ ] Mobile app (React Native)

---

## 👤 Author

**Ankit Raj**
- GitHub: [@ankeeetraj](https://github.com/ankeeetraj)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
