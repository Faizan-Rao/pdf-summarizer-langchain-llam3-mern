import mongoose from 'mongoose'

export const dbConnect = async () => {
    try {
        const db = await mongoose.connect(process.env.DB_CONNECT)
        if(db.connections[0].readyState !== 1) {
            console.log("DB Connection failed")
            return
        }
        else {
            console.log("DB Connected")
        }
    }
    catch(error) {
        console.log(error.message)
    }
}

export default dbConnect