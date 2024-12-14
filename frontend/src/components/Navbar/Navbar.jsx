import React, { useContext,useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import {Link, useNavigate} from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({setShowLogin}) => {

    const [menu,setmenu]=useState("menu");

    const{getTotalCartAmount , token,setToken}=useContext(StoreContext)

    const navigate = useNavigate();

    const logout =()=>{
      localStorage.removeItem("token");
      setToken("");
      navigate("/")

    }


  return (
    <div className='navbar'>
        <Link to='/'><img src={assets.logo} alt="" className='logo' /></Link>
        <ul className="navbar-menu">
            <Link to='/' onClick={()=>setmenu("home")} className={menu==="home" ?"active":""}>Home</Link>
            <a href='#explore-menu' onClick={()=>setmenu("menu")} className={menu==="menu" ?"active":""}>Menu</a>
            <a href='#app-download' onClick={()=>setmenu("mobile-app")} className={menu==="mobile-app"? "active":""}>Mobile-app</a>
            <a href='#footer' onClick={()=>setmenu("contact-us")} className={menu==="contact-us" ? "active":""}>contact us</a>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt="" />
            <div className="navbar-search-icon">
               <Link to='/cart'><img  src={assets.basket_icon} alt="" />
               <div className={getTotalCartAmount()===0?"":"dot"}></div></Link> 
            </div>
            {!token ? (<button onClick={()=>setShowLogin(true)}>Sign in</button>
          ):(
          <div className='navbar-profile'>
              <img src={assets.profile_icon} alt="" />
              <ul className='navbar-profile-dropdown'>
                <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
              </ul>
              </div> 
            )}
            
           
           
            </div>
           
        </div>
       
  )
}

export default Navbar
