import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import axios from 'axios'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const LoginPopup = ({setShowLogin}) => {

  const {url,setToken} = useContext(StoreContext)

    const [currState,setCurrState] = useState("Sign up")
    const [data,setData] = useState({
      name:"",
      email:"",
      password:""
    })

    const onChangeHandler = (event) =>{
      const name = event.target.name;
      const value = event.target.value;
      setData(data=>({...data,[name]:value
      }))
    }

    const onLogin = async (event) =>{
      event.preventDefault()
      let newUrl = url ;
      if(currState==="Login"){
        newUrl += "/api/user/login"
      }
      else{
        newUrl += "/api/user/register"
      }

      try{
      const response = await axios.post(newUrl,data);


      if(response.data.success){
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false)
      }
      else{
        alert(response.data.message)
      }
    }catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 409) {
          alert("Conflict: " + error.response.data.message || "This email is already registered.");
        } else {
          alert("Error: " + error.response.data.message || "An error occurred. Please try again.");
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin}  className='login-popup-container'>
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
            {currState==='Login'?<></>: <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Your password' required />
        </div>
        <button type='submit'>{currState==="Sign up"?"Create account":"Login"}</button>
        <div className='login-popup-condition'>
            <input type="checkbox" required />
            <p>By continuing ,I agree to the terms of use & privacy policy.</p>
        </div>
        {currState==="Login"
        ?<p>Create a new account? <span onClick={()=>setCurrState("Sign up")}>Click here</span></p>
        :<p>Already have an account <span onClick={()=>setCurrState("Login")}>Login here</span></p>
    }
        
      </form>
    </div>
  )
}

export default LoginPopup
