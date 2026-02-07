# 🤖 Smart Automator

### 🌍 Live Demo  
- **App:** [smart-task-automator.onrender.com](https://smart-task-automator.onrender.com)  
- **Swagger Docs:** [smart-task-automator.onrender.com/api-docs](https://smart-task-automator.onrender.com/api-docs)


**Smart Automator** is a modern rule-based automation platform built with **Node.js**, **Express**, and **MongoDB**.  
It allows users to create custom automation rules (“if this, then that”) that react to triggers such as time, events, or webhooks — and execute actions like sending Telegram messages, making HTTP requests, or simple logging.

---

## 🚀 Tech Stack

- **Node.js / Express** — REST API and server logic  
- **MongoDB / Mongoose** — data persistence and schema validation  
- **Swagger UI** — interactive API documentation  
- **Vanilla JS + HTML + CSS** — lightweight modern frontend  
- **Jest + Supertest** — unit and integration testing  
- **Telegram API (Bot Integration)** — real message delivery  
- **Worker (Poller)** — background trigger executor  

---

## ⚙️ Core Features

- 🧩 **Rule Management:** create, update, delete, and disable automation rules  
- ⏱ **Trigger Types:** time-based, event-based, or external webhooks  
- 💬 **Action Types:** Telegram message, HTTP request, or log entry  
- 🔄 **Background Poller:** periodically checks active rules  
- 🌐 **UI Dashboard:** simple, clean, real-time web interface  
- 🧾 **Swagger Docs:** available at `/api-docs`  
- ✅ **Full test coverage:** for controllers and services  

---

## 🧠 How It Works

1. You create a **Rule** using the UI or REST API:
   ```json
   {
     "name": "Telegram alert",
     "triggerType": "time",
     "triggerValue": "60",
     "actionType": "telegram",
     "actionConfig": {
       "chatId": "123456789",
       "message": "🚨 Rule triggered successfully!"
     }
   }
2. The Poller Worker runs periodically (default: every 60 seconds).

3. When a trigger condition is met, it invokes the Action Service.

4. The Action Service performs the action — sends a Telegram message, executes an HTTP request, or logs an event.

5. Each execution is stored in MongoDB via the ExecutionLog model.

## 🧩 Project Structure 

smart-automator/
│
├── src/
│   ├── actions/           # executors & tests
│   ├── controllers/       # auth & rule logic
│   ├── models/            # User, Rule, ExecutionLog
│   ├── routes/            # API endpoints
│   ├── services/          # actionService, triggerService
│   ├── utils/             # middleware & helpers
│   ├── workers/           # poller for background checks
│   ├── app.js             # express config
│   └── server.js          # app entry point
│
├── public/                # frontend (index.html, style.css, app.js)
├── .env                   # environment variables
└── package.json

## 💻 Local Setup

1. Clone the Repository

git clone https://github.com/AndriyAtWork25/smart-task-automator.git
cd smart-automator

2. Install dependencies

npm install


3. Create .env file

MONGO_URI=mongodb://127.0.0.1:27017/smart-automator
PORT=5000
TELEGRAM_BOT_TOKEN=7228761652:AAF-hi7rcf0-VUVpYeyM3ktg7iPgWF2BJQg

4. Run the Server

npm run dev

then open 
* UI - http://localhost:5000/
* Swagger - http://localhost:5000/api-docs

## 🧪 Testing

npm test


## 🛠 Example API Calls

1. Create a Rule
POST /api/rules

2. Trigger a Rule
POST /api/rules/:id/trigger

3. Delete a Rule
DELETE /api/rules/:id


## 🖥 UI Overview
The frontend provides a minimalist control panel:

- Left side → create and trigger rules

- Right side → view worker logs and API responses

- Includes quick controls to stop or delete rules

## 📘 Swagger Documentation

All endpoints are documented and available at:
👉 http://localhost:5000/api-docs

You can test requests directly from the browser using Swagger UI.

## 🧾 Example Rule Lifecycle
| Step | Action         | Description                       |
| ---- | -------------- | --------------------------------- |
| 1    | Create Rule    | Define trigger + action           |
| 2    | Poller detects | Worker finds active rules         |
| 3    | Execute        | Performs Telegram/HTTP/log action |
| 4    | Result         | Stored in MongoDB ExecutionLog    |
| 5    | Manage         | Stop or delete rule via UI        |


## 🧑‍💻 Author
Andriy Tsar
Back-End Developer | Node.js | Express | MongoDB


“Automation doesn’t replace creativity, it gives humans time to use it.”
