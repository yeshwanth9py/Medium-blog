import { signupinput } from '@yeshwanth9py/medium-common'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Backendurl } from '../config'
import axios from 'axios'

const Auth = ({type}:{type: "signup" | "signin"}) => {
  const navigate = useNavigate();

  const [postinputs, setPostInputs] = useState<signupinput>({
    name: "",
    username: "",
    password: ""
  })

  async function sendrequest(){
    try{
      const response = await axios.post(`${Backendurl}/api/v1/user/${type}`, postinputs);
      const {token} = response.data;
      
      localStorage.setItem("token", token);
      navigate("/blogs")
    }catch(err: any){
      console.log(err);
      alert(err.message);
    }
    
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
        <div className='flex flex-col justify-center'>
            <div className='font-extrabold text-3xl mx-10'>
                {type==="signup"? "Create an account": "Log in to your account"}   
            </div>
            <div className='text-slate-400 mx-10 mb-5 text-center'>
                {type==="signup"? "Already have an account?": "Don't have an account?"}   
                <Link to={`${type==="signup"? "/signin" : "/signup"}`} className='pl-2 underline'>{type==="signup"? "Sign in": "Sign up"}</Link>
            </div>
            {type==="signup" ? (<LabelledInput label="Name" type= "text" placeholder="Enter your name" onChange={(e) => {
              setPostInputs({
                ...postinputs,
                name: e.target.value
              })
            }}/>): null}

            <LabelledInput label="Email" placeholder="Enter your email" type="email" onChange={(e) => {
              setPostInputs({
                ...postinputs,
                username: e.target.value
              })
            }}/>

            <LabelledInput label="Password" type="password" placeholder="Enter your password" onChange={(e) => {
              setPostInputs({
                ...postinputs,
                password: e.target.value
              })
            }}/>

            <button onClick={sendrequest} className='w-full text-white bg-gray-800 font-medium px-5 py-2.5 text-sm me-2 mb-2 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-lg mt-8'>{type==="signin" ? "Login" : "Sign up"}</button>

        </div>
    </div>
  )
}

interface labelledInputType{
  label: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  placeholder: string,
  type?: string
}


function LabelledInput({label, onChange, placeholder, type}: labelledInputType) {
  return <div>
    <label className='text-sm block font-semibold mb-2 pt-4'>{label}</label>
    <input className='bg-gray-50 rounded-lg p-2.5 text-gray-900 block mb-2 border border-gray-300 text-sm w-full focus:border-blue-500 focus:ring-blue-500' type={type} onChange={onChange} placeholder={placeholder} required/>
  </div>
}

export default Auth