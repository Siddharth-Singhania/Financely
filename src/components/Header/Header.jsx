import React, { useEffect, useState } from "react";
import "./Header.css";
import userPhoto from '../../assets/user.svg'
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { logout } from "../../firebase";

export default function Header() {
    const navigate= useNavigate();
    const [user] = useAuthState(auth);

    
    useEffect(()=>{
        if(user){
            navigate('/dashboard');
        }else{
            navigate('/')
        }
    },[user])

  return(
    <>
        <div className="navbar">
            <h4>Financely</h4>
            {user?
            <div className="logout">
                <img src={user.photoURL ? user.photoURL : userPhoto} alt="" />
                <p onClick={()=>logout(false)}>Logout</p>
            </div>:null}
           
        </div>
    </>
  )
}
