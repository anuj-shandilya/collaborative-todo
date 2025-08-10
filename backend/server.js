// backend/server.js
const WebSocket = require('ws');
const PORT = 8080;

const wss = new WebSocket.Server({ port: PORT });
const clients = new Set();

console.log(`✅ WebSocket Server running on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
        // Broadcast message to all connected clients except sender
        for (let client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});
