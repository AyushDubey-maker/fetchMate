<p align="center">
  <img src="public/fetchmate-icon.png" alt="FetchMate Logo" width="64" height="64"/>
</p>

<h1 align="center">FetchMate – Home is Where the Paw Prints Are!</h1>

Welcome to **FetchMate**, a responsive React-based web application that helps users find their perfect shelter dog match. This project was built as part of the Fetch Take-Home assessment, featuring a user-friendly interface, location-based filtering, and favorites-based matchmaking.

---

## Features

- ✅ **Login authentication** using Fetch-provided API
- 🐶 Browse adoptable dogs with:
  - 🔎 Filter by **Breed** and **Alphabet Group (A–Z)**
  - 📍 Filter by **Dogs Near Me** using geolocation and zip codes
  - ↕️ **Sort breeds alphabetically (A–Z / Z–A)**
- ❤️ Add to **Favorites** and generate a perfect **Match**
-  Responsive layout for desktop & mobile
-  Polished and accessible UI with themed styles

---

## 🔗 Live Demo

👉 [View Live on Vercel](https://fetch-mate-ten.vercel.app/)  
_(Deployed with auto-updates from GitHub)_

---

## 🛠 Tech Stack

- **React.js** (CRA)
- **React Router v6**
- **Fetch API** with credentials
- **CSS modules** and media queries
- **Deployed on Vercel**

---

## 🚀 Getting Started (Local Setup)

To run the project locally, follow these steps:

### 1. Clone the Repository  
git clone https://github.com/AyushDubey-maker/fetchMate.git  


### 2. Install Dependencies  
Make sure you have **Node.js** and **npm** installed.  
npm install

### 3. Start the Development Server  
npm start  

This will run the app locally at:  
http://localhost:3000

---
## 📁 Project Structure

fetchMate/  
├── public/  
├── src/  
│   ├── components/  
│   ├── pages/  
│   ├── context/  
│   ├── styles/  
│   └── App.js / index.js  
├── .gitignore  
├── README.md  
└── package.json

---

## 🌐 API Reference

Base URL: `https://frontend-take-home-service.fetch.com`

Endpoints used:
- POST `/auth/login`
- GET `/dogs/breeds`
- GET `/dogs/search`
- POST `/dogs`
- POST `/dogs/match`
- POST `/locations`
- POST `/locations/search`

> All requests use `credentials: 'include'` for authentication cookies.

---

## 👤 Author

**Ayush Dubey**  
GitHub: https://github.com/AyushDubey-maker  
LinkedIn: https://linkedin.com/in/ayush-dubey-b0b9b61b6

---

