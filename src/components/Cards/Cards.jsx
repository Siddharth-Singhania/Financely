import React from 'react'
import './Cards.css'
import { Row,Card } from "antd";
import Button from '../Button/Button'

function Cards(props) {

  


  return (
    <div>
      <Row className = 'my-row'>
        <Card  className="my-card" >
          <h2>Current Balance</h2>
          <p>₹{props.totalBalance}</p>
          <Button text="Reset Balance" blue={true} onClick={props.Reset}/>
        </Card>
        <Card className="my-card">
          <h2>Total Income</h2>
          <p>₹{props.TotalIncome}</p>
          <Button text="Add Income" blue={true} onClick={()=>props.showIncomeModal()}/>
        </Card>
        <Card className="my-card">
          <h2>Total Expenses</h2>
          <p>₹{props.TotalExpense}</p>
          <Button text="Add Expense" blue={true}  onClick={()=>props.showExpenseModal()}/>
        </Card>
      </Row>
    </div>

  )
}

export default Cards;