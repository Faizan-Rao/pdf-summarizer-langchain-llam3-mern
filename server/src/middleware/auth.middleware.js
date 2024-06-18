import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'
import User from '../models/user.model.js'
import { APIResponse } from '../utils/apiResonse.js'

const authMiddleware = await asyncHandler(async (req, res, next) => {

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if(!token) {
        res.json(new APIResponse(401, "Token not found"))
    } 

    const decryptedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decryptedData._id).select("-password -refreshToken")

    if(!user) {
        res.json(new APIResponse(401, "User not found"))
    }
    
    req.user = user
    next()
}) 

export { authMiddleware }