import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { fileUpload, deleteFile } from "../controllers/file.controller.js";
const router = Router()

router.use(authMiddleware)

router.route("/").post(upload.single("document"), fileUpload)
router.route("/").patch(deleteFile)

export default router