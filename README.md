# Collaborative Real‑Time To‑Do List
The Collaborative Real‑Time To‑Do List App is a full‑stack web application that enables multiple users to manage tasks together instantly over the web. Built with a vanilla HTML, CSS, and JavaScript frontend and a Node.js WebSocket backend, it demonstrates how to implement real‑time communication, live UI updates, and basic state synchronization without relying on page reloads.

When a user joins the app, they choose a nickname and automatically appear in the list of connected users. They can create tasks, assign them to themselves or others, mark them as complete, or delete them. Every change is broadcast instantly to all connected clients through a lightweight WebSocket protocol. This ensures all participants always see the same live task list, making it ideal for collaborative environments.

The app also uses localStorage for personal persistence — so even if a user refreshes their browser, their latest tasks remain intact for their session. The backend WebSocket server relays messages between clients, resulting in minimal latency and no heavy polling.

Tech Highlights
Frontend: HTML, CSS, JavaScript (Vanilla)
Backend: Node.js with ws WebSocket library
Real‑Time: Bi‑directional event handling
Persistence: Browser localStorage
Features:

Join via nickname
Live user list updates
Task creation, assignment, completion, and deletion
Instant UI synchronization across users
Purpose of the Repo
This repository serves as a learning and portfolio project for developers exploring:

Real‑time communication using WebSockets
Integration of frontend and backend without frameworks
Building collaborative user interfaces
Preparation for technical interviews and college placements
