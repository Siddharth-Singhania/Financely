import React from 'react'
import transaction from '../../assets/transactions.svg'
import './NoTransaction.css'

function NoTransaction() {
  return (
    <div className='transaction'>
        <img src={transaction}/>
        <p>You Have No Transactions Currently</p>
    </div>
  )
}

export default NoTransaction