import React from 'react'
import './Button.css'

function Button(props) {

    
  return (
    <div disabled= {props.disabled} className={props.blue?'btn btn-blue':'btn'} onClick={props.onClick}>{props.text}</div>
  )
}

export default Button