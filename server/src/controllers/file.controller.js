import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIResponse } from "../utils/apiResonse.js";
import fs from 'fs'
import path from "path";

export const fileUpload = await asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { originalname, mimetype } = req.file;

  const path = req.file?.path.replace("public", "");

  const user = await User.findById(_id);
  const files = [...user.files];
  files.push({ filename: path });

  const updatedUser = await User.findByIdAndUpdate(
    { _id: _id },
    { $set: { files } }
  );

  if (!updatedUser) {
    res.status(401).json(new APIResponse(401, "FileUpload: Unsuccessful"));
  }

  res
    .status(200)
    .json(new APIResponse(200, "FileUpload: Successful", updatedUser.files));
});

export const deleteFile = await asyncHandler(async (req, res) => {
  const { id, filename } = req.body;
  const { _id } = req.user;

  const user = await User.findById(_id);
  
  let files = user.files;
  
  files = files.filter((item) => {
    return JSON.stringify(item._id).replaceAll('"', "") !== id;
  });
  
  const updatedUser = await User.findByIdAndUpdate(_id, {
    $set: {
      files,
    },
  });

  

  if (!updatedUser) {
    res.status(401).json(new APIResponse(401, "FileUpload: Unsuccessful"));
  }

    if(fs.existsSync(`public/${filename}`))
    {
        fs.unlinkSync(`public/${filename}`)
    }
  

  res
    .status(200)
    .json(new APIResponse(200, "FileDelete: Successful", updatedUser.files));
});
