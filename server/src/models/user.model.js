import mongoose, {Schema} from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const FileSchema = new Schema({
    filename : {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    deletedAt: {
        type: Date,
        default: null
    }
})


const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    identifier: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    files: {
        type: [FileSchema],
        default: []
    },
    accessToken: {
        type: String,
        default: "",
    },
    refreshToken: {
        type: String,
        default: "",
    },
})

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        identifier: this.identified,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

UserSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

const User = mongoose.models['User'] || mongoose.model("User", UserSchema)

export default User;
