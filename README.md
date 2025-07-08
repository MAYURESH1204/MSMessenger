# 💬 ChatWeb

**ChatWeb** is a full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and powered by **Socket.IO** for instant messaging. It enables users to connect, communicate, and collaborate seamlessly — whether one-to-one or in groups.

---  

## 📹 Demo Video  
[Watch Demo](https://drive.google.com/file/d/1gGZbThEQUDHHVK7l5gJk0LZ8OIv6ES3I/view?usp=sharing)  

## ❓ Why ChatWeb?

In a world increasingly reliant on remote communication, **ChatWeb** provides a simple yet powerful platform for:

- Real-time one-on-one or group messaging
- Secure conversations with encryption
- Modern UI/UX chat features similar to WhatsApp/Slack
- Learning full-stack real-time app development

---

## 🧑‍💻 How It Works

1. **User signs up or logs in**
2. **Socket.IO** establishes a real-time connection
3. Users can:
   - Send messages (text/audio/video)
   - Create or join group chats
   - Share files
   - Switch chat backgrounds
   - Get instant notifications
4. All data is securely stored in **MongoDB** with encrypted credentials

---

## 📹 Demo Video  
[🎥 Watch Demo](https://drive.google.com/file/d/1gGZbThEQUDHHVK7l5gJk0LZ8OIv6ES3I/view?usp=sharing)

---

## 🛠️ Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Real-Time Communication:** Socket.IO  
- **Authentication:** JWT + bcrypt  
- **Video Calls:** ZegoCloud

---

## 🚀 Run Locally

**Clone the repository**
```bash
git clone https://github.com/Mayuresh1204/MSMessenger
cd mern-chat-app
```

**Install backend dependencies**
```bash
npm install
```

**Install frontend dependencies**
```bash
cd frontend
npm install
```

**Start backend**
```bash
npm run start
```

**Start frontend**
```bash
cd frontend
npm start
```

---

## ✨ Features

### ✅ Core Functionality

- **Authentication** – Signup/Login with secure JWT tokens
- **One-to-One Chat** – Real-time private conversations
- **Group Chat** – Create, join, and manage group chats
- **Typing Indicators** – See when someone is typing
- **Search Users** – Search by name/email to start chatting
- **Notifications** – Real-time message alerts and unread badges
- **View User Profiles** – Check profile information of others
- **Chat Background Change** – Customize your chat background
- **Responsive to any device type** - Mobile responsiveness  

### 📤 Multimedia & File Support

- **File Sharing** – Upload and share files (PDFs, images, docs, etc.)
- **Audio Messages** – Record and send voice notes
- **Video Calling** – Initiate one-on-one video calls *(WebRTC integration)*
- **Audio Calling** – Make private voice calls

---

## 📦 Folder Structure

```
mern-chat-app/
├── backend/           # Node.js + Express server
│   └── routes, models, controllers, etc.
├── frontend/          # React client
│   └── components, pages, sockets, etc.
├── .env               # Environment variables
└── README.md
```

---

## 🔐 Security

- **Password Encryption:** All passwords are hashed using `bcrypt`
- **JWT Authentication:** Protects routes and sessions
- **MongoDB Security Best Practices**

---

## 📣 Future Improvements (Ideas)

- End-to-End Encryption for messages
- Message reactions & replies
- Dark mode and theming
- Chatbot integration

---

## 👨‍💻 Made By

- [@Mayuresh1204](https://github.com/Mayuresh1204)

---

> ⚡ Tip: This project is ideal for showcasing **real-time app development**, **full-stack skills**, and **Socket.IO/WebRTC** experience in your portfolio.

Let me know if you'd like to include:
- GitHub Actions for deployment
- Render/Vercel deployment guide
- Contribution guidelines or license
