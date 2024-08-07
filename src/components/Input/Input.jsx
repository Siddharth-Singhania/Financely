import React from 'react'
import './Input.css'


function Input(props) {
  return (
    <div className='input-wrapper'>
        <p className='label-input'>{props.label}</p>
        <input type= {props.type} value={props.state} placeholder={props.placeholder}  onChange={(e)=>props.setState(e.target.value)} className='custom-input' required/>
    </div>
  )
}

export default Input;
