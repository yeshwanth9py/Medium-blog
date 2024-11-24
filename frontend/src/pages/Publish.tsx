
//Need to use fancy text editor like draft.js

import { useState } from "react";
import Appbar from "../components/Appbar"
import { Backendurl } from "../config"
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

  return (
    <div>
        <Appbar/>
        <div className="flex justify-center w-full pt-8">
            <div className="max-w-screen-lg w-full">
                <input type="text" onChange={(e)=>setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder="title"/>
                <TextEditor onChange={(e) => {setDescription(e.target.value)}}/>
                <button onClick={async () =>{
                    const response = await axios.post(`${Backendurl}/api/v1/blog`, {
                        title,
                        content: description, 
                    }, {
                        headers:{
                            Authorization: `${localStorage.getItem("token")}`
                        }
                    });
                    navigate("/blog/"+response.data.id);
                }} type="submit" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >Publish post</button>
            </div>
        </div>

    </div>
  )
}


function TextEditor({ onChange }: {onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void}) {
    return <div className="mt-2">
        <div className="w-full mb-4 ">
            <div className="flex items-center justify-between border">
            <div className="my-2 bg-white rounded-b-lg w-full">
                <label className="sr-only">Publish post</label>
                <textarea onChange={onChange} id="editor" rows={8} className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2" placeholder="Write an article..." required />
            </div>
        </div>
       </div>
    </div>
    
}

export default Publish