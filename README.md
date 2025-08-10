#Collaborative-todo
A full-stack web app built with vanilla HTML, CSS, and JavaScript frontend and a Node.js WebSocket backend, enabling multiple users to collaboratively manage tasks in real time. Users can join with a nickname, add, assign, complete, and delete tasks with instant updates across all connected clients.

# Project Setup and Running Locally
1. Clone the Repository
bash
git clone https://github.com/YOUR_USERNAME/collaborative-todo.git
cd collaborative-todo
2. Backend Setup
Navigate to the backend folder:

bash
cd backend
Install dependencies (only ws WebSocket library):

bash
npm install
Start the WebSocket server:

bash
node server.js
The server will start running on ws://localhost:8080 (or whichever port you configured).

3. Frontend Setup
Open another terminal and navigate to the frontend folder:

bash
cd ../frontend
