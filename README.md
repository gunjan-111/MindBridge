# 🧠 MindBridge — Mental Health Support Platform

MindBridge is a **full-stack mental health support web application** that helps users track their mental wellbeing, chat with an AI assistant, and access professional counselors and wellness resources.

The platform aims to provide a **safe and supportive environment** for individuals to manage stress, anxiety, and emotional health.

---

# 📌 Project Overview

Mental health issues are increasingly common, yet many people lack easy access to support. MindBridge combines **AI assistance, mood tracking, and counseling services** to help users improve their emotional wellbeing.

Main features include:

* 🤖 AI chatbot for emotional support
* 📊 Mood tracking with charts
* 👩‍⚕️ Counselor browsing and booking
* 🧘 Wellness resources (breathing, meditation, journaling)
* 🆘 Crisis helpline information

---

# 🏗 System Architecture

MindBridge follows a **client–server architecture**.

```
User Browser
     │
Frontend (HTML, CSS, Bootstrap, JavaScript)
     │
Backend API (Node.js + Express)
     │
Database (MongoDB)
```

The frontend sends requests to backend APIs, which process the data and store/retrieve information from MongoDB.

---

# 📁 Project Structure

```
mindbridge/
│
├── index.html
├── css/style.css
├── js/main.js
│
├── pages/
│   ├── chat.html
│   ├── counselors.html
│   ├── mood-tracker.html
│   ├── resources.html
│   ├── login.html
│   └── register.html
│
├── server.js
├── package.json
└── .env
```

---

# 🧩 Project Modules

### 1️⃣ Authentication Module

Handles user **registration and login** using JWT authentication and password hashing.

### 2️⃣ AI Chatbot Module

Allows users to **chat with an AI assistant** for emotional support and guidance.

### 3️⃣ Mood Tracker Module

Users can **log their daily mood** and view trends using charts.

### 4️⃣ Counselor Booking Module

Users can browse therapists and **book counseling sessions**.

### 5️⃣ Wellness Resources Module

Includes **breathing exercises, journaling prompts, and meditation guides**.

### 6️⃣ Crisis Support Module

Displays **important mental health helplines** for emergencies.

---

# 🔌 APIs Used

| Method | Endpoint             | Purpose                 |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/register` | Register user           |
| POST   | `/api/auth/login`    | Login user              |
| POST   | `/api/mood`          | Save mood entry         |
| GET    | `/api/mood`          | Get mood history        |
| POST   | `/api/chat`          | Save chat message       |
| GET    | `/api/chat`          | Retrieve chat history   |
| POST   | `/api/booking`       | Book counseling session |
| GET    | `/api/journal`       | Get journal entries     |

---

# 🛠 Technology Stack

### Frontend

* HTML5
* CSS3
* Bootstrap 5
* JavaScript
* Chart.js

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

---

# ⚙️ Setup Instructions

Install dependencies

```
npm install
```

Run backend server

```
npm start
```

Open the frontend

```
index.html
```

---

# ⚠️ Challenges Faced

* Integrating frontend with backend APIs
* Implementing secure authentication with JWT
* Managing multi-step registration flow
* Displaying dynamic mood charts using Chart.js

---

# 👥 Team Contributions

| Team Member | Contribution                                        |
| ----------- | --------------------------------------------------- |
| Member 1    | Designed frontend UI and homepage layout            |
| Member 2    | Developed authentication system (login/register)    |
| Member 3    | Implemented mood tracker and chatbot module         |
| Member 4    | Built backend APIs and MongoDB database integration |

---


# 📞 Mental Health Helplines (India)

* iCall — 9152987821
* Vandrevala Foundation — 1860-2662-345
* AASRA — 9820466627
* National Emergency — 112

---

# ❤️ Conclusion

MindBridge demonstrates how **web technology can support mental health awareness and accessibility** by combining AI assistance, self-help tools, and professional counseling services in one platform.
