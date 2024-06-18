'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import * as marked from 'marked'
import { useAppSelector } from '@/store/redux.store'
import parser from 'html-react-parser'
import { useSocket } from '@/context/socketProvider'
import { selectUser } from '@/slices/user.slice'
import Modal from '@/components/Modal'

interface IChat {
  query: string,
  position: string,
}


const App = () => {
  const user = useAppSelector(selectUser)
  const router = useRouter()

  const [query, setQuery] = useState<string>('')
  const [response, setResponse] = useState<string>('')
  const [messages, setMessage] = useState<IChat[]>([
    {
      query: "hello",
      position: "end"
    },
    {
      query: "Hello, How can i help you?",
      position: "start"
    }
  ])


  const io = useSocket() 

  const sendQuery = useCallback(async (e: any) => {
    
    
    if(e.key !== "Enter")
      {
         
          return;
      }

    if(query.trim() === "")
    {
      return;
    }
    
    const userQuery = query.trim()
    const sendMessage = {
      query: userQuery,
      position: "end",
    }

    messages.push(sendMessage)
    
    setResponse(``)
    messages.push({
      query: "",
      position: "start",
    })
   
    await io.emit("send:query", {query, identifier : user.identifier})
    setQuery("")
  }, [io, messages, query, user.identifier])

  const handleChunk = useCallback(async (chunk : string) => {
    setResponse(prev => prev += chunk)
    messages[messages.length - 1].query += chunk
  }, [messages])

  const handleChange = (e : any) => {
    setQuery(e.target.value.replaceAll("\n", ""))
  }
   

  
  useEffect(() => {
      if(!user.accessToken)
      {
        router.push('/')
      }

      io.on("send:chunk", handleChunk)
      return () => {
        io.off("send:chunk", handleChunk)
      }
  }, [handleChunk, io, router, user.accessToken])
  // console.log(user.files)
  return (
    <>
    
    <Modal files={user.files} token={user.accessToken}/>
   <div className='container-fluid min-h-screen  px-[10%]'>
    <h1 className='text-white font-bold text-2xl  py-1 text-center'>
      USER-RAG
    </h1>

    <div className="container max-h-screen min-h-[80vh]  overflow-y-auto px-[2%]">
      {
        messages.map((item, index) => {
          return (
            <div 
              className={`chat ${item.position === "start" ? "chat-start" : "chat-end"}`} 
              key={index}
            >
              <div 
                className={`chat-bubble leading-8 ${item.position === "start" ? "" : "chat-bubble-success"}  text-[white] `}
              >
                {!item.query && response }
                {parser(marked.parse(item.query) as any)}

              </div>
            </div>
          )
        })
      }
    </div>
    
    <div className=" px-[10%] bg-gray-800 w-full fixed bottom-0 left-0 flex gap-4 p-2 ">

      <textarea 
        className="textarea  w-full resize-none   focus:outline-none" 
        onKeyDown={sendQuery}
        onChange={handleChange} 
        value={query} 
        rows={query.length > 0 ? 2 : 1}
        placeholder="Enter Query"
      ></textarea> 

      {/* <button className="btn btn-active btn-success text-white" onClick={sendQuery}>Send</button> */}
      {query.length <= 0 && <button 
      
        className="btn btn-success text-white" 
        onClick={(e)=>{e.preventDefault(); document.getElementById('my_modal_3')?.showModal()}}
      >
        Upload
      </button>}
    </div>
   
   </div>
   </>
  )
}

export default App
