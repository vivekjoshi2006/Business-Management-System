# 📊 BMS Pro - Business Management System

A modern, lightweight, and scalable **Business Management System** that consolidates essential business operations into one platform. The application is built using **Next.js App Router**, **TypeScript**, **Prisma ORM**, **Tailwind CSS**, and **SQLite**, providing a fast, secure, and responsive administrative experience.

---

## ✨ Features

- 📦 Inventory Management
- 👥 Employee Management
- 💰 Finance Management
- 🤝 Client & Vendor Management
- 📞 Contact Directory
- ⚡ Fast API Routes
- 🔒 Type-safe Backend
- 📱 Responsive Dashboard
- 🎨 Modern UI with Tailwind CSS
- 🗄 SQLite Database with Prisma ORM

---

# 🚀 Core Modules

## 📦 Inventory Manager

Manage complete inventory records with:

- Add/Edit/Delete inventory items
- Product SKU Management
- Product Pricing
- Available Stock
- Dynamic Inventory Value
- Product Search
- Real-time Updates

---

## 👥 Employee Tracker

Employee management system includes:

- Employee Records
- Department
- Designation
- Salary Information
- Contact Details
- Joining Date
- Employee CRUD Operations

---

## 💵 Finance Ledger

Complete accounting module featuring:

- Income Records
- Expense Records
- Transaction History
- Balance Calculation
- Financial Summary
- Notes & Descriptions

---

## 🤝 Clients & Vendors

Manage all business partners:

- Clients
- Vendors
- Company Name
- Contact Person
- Phone Number
- Email
- Address
- Business Category

---

## 📞 Contact Directory

Maintain a centralized contact system.

Supported Categories:

- Lead
- Customer
- Partner
- Personal

Includes:

- Name
- Phone Number
- Email
- Address
- Notes

---

# 🛠 Technology Stack

| Technology | Usage |
|------------|------|
| Next.js 15 | Frontend & Backend |
| App Router | Routing |
| React | UI Library |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Prisma ORM | Database ORM |
| SQLite | Database |
| Node.js | Runtime |

---

# 📂 Project Structure

```text
Business-Management-System/
│
├── prisma/
│   ├── schema.prisma
│   └── dev.db
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │   │
│   │   ├── api/
│   │   │
│   │   ├── contacts/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   │
│   │   ├── employees/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   │
│   │   ├── finance/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   │
│   │   ├── inventory/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   │
│   │   └── partners/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   │
│   ├── dashboard/
│   │   ├── contacts/
│   │   ├── employees/
│   │   ├── finance/
│   │   ├── inventory/
│   │   ├── partners/
│   │   └── layout.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── Sidebar.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Table.tsx
│
├── lib/
│   └── prisma.ts
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

---

# 🗄 Database Models

The application includes the following database entities:

- Inventory
- Employee
- Finance
- Partner
- Contact

Managed using **Prisma ORM**.

---

# 🔐 Data Validation

## Phone Validation

All phone numbers:

- Must contain exactly **10 digits**
- Only numeric values allowed
- Invalid requests are rejected before database insertion

Regex Used:

```regex
^[0-9]{10}$
```

---

## Input Sanitization

Phone fields automatically remove non-numeric characters.

Example:

```
987abc65@43
```

becomes

```
9876543
```

---

## Backend Validation

Every POST and PUT request validates:

- Required Fields
- Phone Numbers
- Empty Strings
- Invalid Data Types

---

# ⚡ REST API

## Inventory

| Method | Endpoint |
|---------|----------|
| GET | /api/inventory |
| POST | /api/inventory |
| PUT | /api/inventory/:id |
| DELETE | /api/inventory/:id |

---

## Employees

| Method | Endpoint |
|---------|----------|
| GET | /api/employees |
| POST | /api/employees |
| PUT | /api/employees/:id |
| DELETE | /api/employees/:id |

---

## Finance

| Method | Endpoint |
|---------|----------|
| GET | /api/finance |
| POST | /api/finance |
| PUT | /api/finance/:id |
| DELETE | /api/finance/:id |

---

## Partners

| Method | Endpoint |
|---------|----------|
| GET | /api/partners |
| POST | /api/partners |
| PUT | /api/partners/:id |
| DELETE | /api/partners/:id |

---

## Contacts

| Method | Endpoint |
|---------|----------|
| GET | /api/contacts |
| POST | /api/contacts |
| PUT | /api/contacts/:id |
| DELETE | /api/contacts/:id |

---

# 💻 Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/vivekjoshi2006/Business-Management-System.git
```

```bash
cd business-management-system
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment

Create a `.env` file in the root directory.

```env
DATABASE_URL="file:./dev.db"
```

---

## 4. Setup Prisma

Push schema into SQLite:

```bash
npx prisma db push
```

Generate Prisma Client:

```bash
npx prisma generate
```

(Optional)

Open Prisma Studio:

```bash
npx prisma studio
```

---

## 5. Run Development Server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

# 🧩 Available Scripts

```bash
npm run dev
```

Runs development server.

```bash
npm run build
```

Build production application.

```bash
npm start
```

Runs production build.

```bash
npm run lint
```

Runs ESLint.

---

# 🎨 UI Features

- Responsive Dashboard
- Sidebar Navigation
- Modern Cards
- Dynamic Tables
- CRUD Forms
- Search Ready
- Mobile Friendly
- Clean Typography
- Tailwind Components
- Smooth Transitions

---

# 🔒 Security Features

- Server-side Validation
- Type-safe API
- Prisma ORM Protection
- SQL Injection Safe
- Input Sanitization
- Strict TypeScript
- Backend Validation

---

# 📈 Future Improvements

- Authentication
- User Roles
- Dashboard Analytics
- Export to Excel
- PDF Reports
- Barcode Scanner
- QR Code Support
- Notifications
- Dark Mode
- Cloud Database
- Image Upload
- Audit Logs
- Email Integration
- Backup & Restore

---

# 📸 Screenshots

Add your application screenshots here.

Example:

```
screenshots/

dashboard.png
inventory.png
employees.png
finance.png
contacts.png
partners.png
```

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create your feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Vivek Joshi**

B.Sc. Computer Science Student

GitHub: https://github.com/yourusername

LinkedIn: https://www.linkedin.com/in/vivekjoshi2006

---

# 📄 License

This project is intended for educational and internal business management purposes.

You are free to modify and extend the project according to your requirements.

---

## ⭐ If you like this project

Please consider giving it a ⭐ on GitHub.

---

## ❤️ Built With

- Next.js
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite
- React

---

**Happy Coding! 🚀**
