import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()

app.use(cors({
    origin: '*',
    allowedHeaders: "*"
}))

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser())
app.use(express.static('public'))

// Routers Specific Imports
import AuthRouter from './routes/auth.routes.js'
import fileRouter from "./routes/files.routes.js"
//Routes v1
app.use("/v1/auth", AuthRouter)
app.use("/v1/file-upload", fileRouter)


export { app }