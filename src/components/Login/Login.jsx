import React, { useState } from 'react'
import './Login.css'
import Button from '../Button/Button'
import Input from '../Input/Input'
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, doc, setDoc,provider} from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { getDoc } from 'firebase/firestore';
import { logout } from '../../firebase';


function Login() {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [loginForm,setLoginForm] = useState(false);
  const navigate = useNavigate();

  function signupWithEmail(){
    setLoading(true);
    if(name!="" && email!= "" && password!=""){
      if(password === confirmPassword){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          logout(true);
          toast.success("Account Created! Now please Login using the created account");
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setLoading(false);
          createDoc(user);
          
        })
        .catch((error) =>{
          toast.error(error.message);
          setLoading(false);
        })
      }else{
        toast.error("Password and Confirm Password don't match!!");
        setLoading(false);
      }  
    }else{
      toast.error("All fields are mandatory!!");
      setLoading(false);
    }
  }

  async function createDoc(user){

    if(!user) return;

    const userRef = doc(db,"users",user.uid);
    const userData = await getDoc(userRef);

    if(!userData.exists()){
      try {
        await setDoc(doc(db,"users",user.uid),{
          name: user.displayName?user.displayName:name,
          email:user.email,
          photoURL: user.photoURL?user.photoURL:"",
          createdAt: new Date()
        });
        toast.success("Doc Created!")
      } catch (error) {
        toast.error(error.message)
      }
    }
  }
  function loginUsingEmail(){

    setLoading(true);
    if(email!="" && password!=""){
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        toast.success("User Logged In!")
        setLoading(false);
        navigate("/dashboard")

      })
      .catch((error) => {
          toast.error(error.message);
          setLoading(false);
      });
    }else{
      toast.error("All fields are mandatory!");
      setLoading(false);
    }  
  }

  function signInWithGoogle(){
    setLoading(true);
      signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        createDoc(user);
        setLoading(false);
        toast.success("User Logged In!")
        navigate("/dashboard")
      }).catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  }

  return (
    <>
    {loginForm?
      <div className="signup-wrapper">
        <h2 className='title'>Login on <span>Financely</span></h2>
        <form>
          <Input label={"Email"} state={email} setState={setEmail} placeholder={"tonystartk@gmail.com"} type={"email"}/>
          <Input label={"Password"} state={password} setState={setPassword} placeholder={"Example@123"} type={"password"}/>
          <Button disabled={loading} text={loading?"Loading...":"Login Using Email and Password"} onClick={loginUsingEmail} />
          <p className='gap'>Or</p>
          <Button disabled={loading} text={loading?"Loading...":"Login using Google"} blue={true}/>
          <p className='gap'>Don't have an Account? <span onClick={()=>setLoginForm(false)}>CLick here!</span></p>
        </form>
      </div>:
      <div className="signup-wrapper">
        <h2 className='title'>Sign up on <span>Financely</span></h2>
        <form>
          <Input type={"text"} label={"Full Name"} placeholder={"Tony Stark"} state={name} setState={setName}/>
          <Input label={"Email"} state={email} setState={setEmail} placeholder={"tonystartk@gmail.com"} type={"email"}/>
          <Input label={"Password"} state={password} setState={setPassword} placeholder={"Example@123"} type={"password"}/>
          <Input label={"Confirm Password"} state={confirmPassword} setState={setConfirmPassword} placeholder={"Example@123"} type={"password"}/>
          <Button disabled={loading} text={loading?"Loading...":"Signup Using Email and Password"} onClick={signupWithEmail} />
          <p className='gap'>Or</p>
          <Button disabled={loading} text={loading?"Loading...":"SignUp with Google"} blue={true} onClick={signInWithGoogle}/>
          <p className='gap'>Already have an Account? <span onClick={()=>setLoginForm(true)}>CLick here!</span></p>
        </form>
      </div>}
    </>
  )
}

export default Login
