import { Server } from 'socket.io'
import http from 'http'
import { app } from '../app.js'
import { sendResponseChunk } from './genAIService.js'

const httpServer = new http.createServer(app)
const io = new Server(httpServer, {
    cors: {
        allowedHeaders: "*",
        origin: "*"
    }
})

io.on("connection", async (socket) => {
    // console.log('Socket Server Connected with ID', socket.id)

    socket.on("send:query", async ({query, identifier}) => {
        await sendResponseChunk(query, socket, identifier)
    })
})


export default io