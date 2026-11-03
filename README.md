# 📚 BookNook
### Library Management System

**A simple and modern way to explore, manage, and borrow books.**

BookNook is a full-stack Library Management System that I built as part of my web development journey. I wanted to create something practical where users can explore books, manage a personal library, and borrow books through a clean and user-friendly interface.

The project includes a Next.js frontend and an Express.js backend, with MongoDB for storing application data.

---

## 🌐 Live Website

<p align="center">
  <a href="https://booknook-library-management-system-five.vercel.app/">
    <img src="https://img.shields.io/badge/Visit-Live%20Website-173D32?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Website"/>
  </a>
</p>

**Live URL:** https://booknook-library-management-system-five.vercel.app/

---

## 🔗 Source Code

Both frontend and backend are maintained in one GitHub repository, inside separate folders.

| Part | Folder | Source Code |
|---|---|---|
| Frontend | `library/` | [View Frontend Code](https://github.com/Bappy07/booknook-library-management-system/tree/main/library) |
| Backend | `server/` | [View Backend Code](https://github.com/Bappy07/booknook-library-management-system/tree/main/server) |

**Main Repository:** [BookNook on GitHub](https://github.com/Bappy07/booknook-library-management-system)

---
### Authentication Requirements

- Users must log in before adding a new book.
- Users must log in before borrowing a book.
- Only authenticated users can access protected features.
- Guests can browse the available books without logging in.
- ---

## ✨ Features

- **User Authentication** – Register and log in using email and password.
- **Google Login** – Sign in with a Google account.
- **Browse Books** – Explore books with their covers, descriptions, and details.
- **Add Books** – Add new books to the library.
- **Manage Books** – Update or delete books.
- **Book Details** – View detailed information about individual books.
- **Borrow Books** – Borrow available books through a confirmation modal.
- **My Borrowed Books** – View and manage borrowed books.
- **Responsive Design** – Designed to work on desktop, tablet, and mobile screens.
- **Notifications** – Get feedback through success and error notifications.

---

## 🛠️ Technologies Used

### Frontend

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/DaisyUI-5A0EF8?style=flat-square&logo=daisyui&logoColor=white" />
</p>

- Better Auth
- Lucide React
- Sonner

### Backend

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />
</p>

- Mongoose
- REST API

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 📂 Project Structure

```text
booknook-library-management-system/
│
├── library/                    # Next.js Frontend
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── package.json
│
├── server/                     # Express.js Backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Getting Started

Follow these steps to run BookNook on your local machine.

### Prerequisites

Make sure you have installed:

- Node.js
- npm
