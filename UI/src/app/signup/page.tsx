"use client";

import React, { useState } from "react";
import axios from 'axios'

import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/store/redux.store";
import { useRouter } from "next/navigation";
import { selectUser, setUserState } from "@/slices/user.slice";


interface ICredential {
  identifier?: string
  password?: string,
  name?: string
}

export default function SignUp() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const router = useRouter() 

  const [credentials, setCredentials] = useState<ICredential>({
    identifier: "",
    password: ""
  });

  const handleChange = (e: any) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  
  const handleReset = () => setCredentials({
    identifier: "",
    password: ""
  })
  
  const handleSubmit = async (e: any) => {
      e.preventDefault()
      if(!(credentials.identifier && credentials.password)) return;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/v1/auth/signup`, 
        credentials)
        .catch(
          error => {
          console.log((error as any).response.data)
        })
        
        if(response?.data)
        {
          const { accessToken } = response.data.data
          const {identifier, name, files} = response.data.data.user

          const data = {
            accessToken,
            identifier,
            name,
            files
          }

          dispatch(setUserState(data))
        }
        
        if(user.name)
        {
          router.push("/chat")
        }
        
        handleReset()
  };

  return (
    <div className="container min-h-screen flex justify-center items-center">
      <div className=" min-h-[400px] min-w-[400px] flex justify-center items-center flex-col gap-4 rounded-xl">
        <h1 className="text-4xl mb-7 font-bold">Signup</h1>
        {/* User Input */}
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            className="grow"
            name="identifier"
            onChange={handleChange}
            placeholder="Email"
            value={credentials.identifier}
          />
        </label>

        {/* User Input */}
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            className="grow"
            name="name"
            onChange={handleChange}
            placeholder="Username"
            value={credentials.name}
          />
        </label>

        {/* Password Input */}
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="grow"
            placeholder="Password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </label>

        <div className="flex gap-9 mt-5">
          <Link href={"/"} className="btn btn-outline hover:text-white ">
            Login
          </Link>
          <button
            className="btn text-white  btn-success"
            onClick={handleSubmit}
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
