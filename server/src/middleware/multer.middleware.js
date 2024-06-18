import multer from "multer"
import fs from 'fs'

const diskStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname.replaceAll(" ", "_"))
    },
    destination : (req, file, cb) => {
        const { identifier } = req.user
        const path = `public/temp/pdf/${identifier}` 
        if(!fs.existsSync(path))
        {
            fs.mkdirSync(path)
        }
        cb(null, path)
    }
})

export const upload = multer({
    storage: diskStorage
})