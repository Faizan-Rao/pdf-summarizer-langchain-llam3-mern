import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIResponse } from "../utils/apiResonse.js";
import { signInSchema, signUpSchema } from "../schemas/schema.js";

export const signIn = await asyncHandler(async (req, res) => {
    const {success, data, error: zodError} = signInSchema.safeParse(req.body)
    if(!success) {
        res
        .status(401)
        .json(
            new APIResponse(401,
            "SignIn: FaultyPayLoad",
            zodError
        ))
    }
    const {identifier, password} = data
    const existingUser = await User.findOne({identifier})
    
    if(!existingUser) {
        res
        .status(401)
        .json(
            new APIResponse(
            401,
            "SignIn: User not exist"
        ))
    }
    
    const isPasswordValid = existingUser.comparePassword(password)
    if(!isPasswordValid)
    {
        res
        .status(401)
        .json(
            new APIResponse(
            401,
            "SignIn: Password Invalid"
        ))
    }

    const accessToken = existingUser.generateAccessToken()
    const refreshToken = existingUser.generateRefreshToken()

    delete existingUser.password;
    delete existingUser.refreshToken;

    const option = {
        httpOnly: true,
        secure: true
    }

    res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json( new APIResponse(
        200,
        "SignIn: Successful",
        {
            user: existingUser,
            refreshToken,
            accessToken
        }
    ))
})

export const signUp = await asyncHandler(async (req, res) => {
    
    const {
            success, 
            data, 
            error: zodError
        } = signUpSchema.safeParse(req.body)

    if(!success) {
        res
        .status(401)
        .json(
            new APIResponse(401,
            "SignUp: FaultyPayLoad",
            zodError
        ))
    }
    const {identifier, password, name} = data
    const existingUser = await User.findOne({identifier})
   
    if(existingUser) {
        res
        .status(401)
        .json(
            new APIResponse(
            401,
            "SignUp: User already exist"
        ))
    }

    let user = new User({
        password,
        identifier,
        name
    })
    await user.save()
    
    user = await User.findById(user._id)
        .select("-password -refreshToken")

    
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()


    const option = {
        httpOnly: true,
        secure: true
    }

    res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json( new APIResponse(
        200,
        "SignUp: Successful",
        {
            user,
            refreshToken,
            accessToken
        }
    ))
})