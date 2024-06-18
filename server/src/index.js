import { app } from "./app.js";
import dbConnect from "./utils/dbConnect.js"
import dotenv from 'dotenv'
import io from "./services/socketService.js";

dotenv.config()
const PORT = process.env.PORT || 7000

const init = async () => {
    await dbConnect()
   io.listen(7001)
    app.listen(PORT, () => {
        console.log("Express app is running @ http://localhost:", PORT)
    })
}

init()