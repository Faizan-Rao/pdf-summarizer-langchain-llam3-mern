"use client";

import axios from "axios";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/redux.store";
import { selectUser, setUserState } from "@/slices/user.slice";

interface IFile {
  mimetype?: string;
  filename?: string;
  uploadedAt?: string;
  deletedAt?: string | null;
  _id?: string;
}

const Modal = ({
  files,
}: {
  files: IFile[];
}) => {

  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()

  const [file, setFile] = useState("");

  const handleChange = (e: any) => {
    const file = e.target.files[0];
    if (file.type === "application/pdf") {
      setFile(file);
    } else {
      alert("Not a PDF file");
      setFile("");
    }
  };

  const handleDelete = async (e: any, id:string, filename:string) => {
   

   
      const payload = {
        id: e.target.id,
        filename: filename
      }
      const response = await axios.patch(
        "http://localhost:7000/v1/file-upload/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

     const data = {...user}
     data.files = response.data.data

     dispatch(setUserState(data))

      console.log(response);
    }
  

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if(file) {
      const formData = new FormData();
      formData.append("document", file);
      const response = await axios.post(
        "http://localhost:7000/v1/file-upload/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

     const data = {...user}
     data.files = response.data.data

     dispatch(setUserState(data))

      console.log(response);
    }
  };

  return (
    <dialog id="my_modal_3" className="modal overflow-y-auto">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center">File Uploads</h3>

        <div className="modal-action flex justify-center items-center">
          <form method="dialog flex  gap-4 flex-wrap">
            <a href="/chat" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </a>
            <div className="flex gap-4  mt-4 w-full">
              <input
                className="file-input outline-none border-none   w-full max-w-xs block"
                type="file"
                onChange={handleChange}
                name=""
                id=""
              />
              {file && (
                <button className="btn block" onClick={handleSubmit}>
                  Upload
                </button>
              )}
            </div>
          </form>
        </div>

        <h3 className="font-bold text-lg my-4 text-center">Uploads</h3>
        {files.length === 0 && "No file right now"}
        {files &&
          files.map((item, index) => {
            return (
              <div
                className="flex justify-center items-center gap-4 bg-gray-800 p-2 mt-4 rounded-lg"
                key={index}
              >
                <span>{item.filename.split("\\")[4].split("_").join(" ")}</span>
                <span onClick={(e)=> handleDelete(e, item._id, item.filename)} className="btn btn-sm btn-ghost btn-error">X</span>
              </div>
            );
          })}
      </div>
    </dialog>
  );
};

export default Modal;
