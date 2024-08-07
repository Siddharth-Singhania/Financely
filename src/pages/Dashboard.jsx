import React, { useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import Cards from '../components/Cards/Cards';
import AddExpenseModal from '../components/Modals/addExpense.jsx'
import AddIncomeModal from '../components/Modals/addIncome.jsx'
import { collection, getDoc, getDocs, query } from 'firebase/firestore';
import { db} from '../firebase.js';
import { toast } from 'react-toastify';
import { addDoc ,deleteDoc} from 'firebase/firestore';
import { auth,doc } from '../firebase.js';
import {useAuthState} from "react-firebase-hooks/auth"
import TransactionTable from '../components/TransactionTable/TransactionTable.jsx';
import Charts from '../components/Charts/Charts.jsx';
import NoTransaction from '../components/NoTransaction/NoTransaction.jsx';


export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [Transaction,setTransaction] = useState([]);
  const [isExpenseModalVisible,setisExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible,setisIncomeModalVisible] = useState(false);
  const [loading,setLoading] = useState(true);
  const [TotalIncome,setTotalIncome] = useState(0);
  const [TotalExpense,setTotalExpense] = useState(0);
  const [totalBalance,setTotalBalance] = useState(0);
  const [transLoad,setTransLoad] = useState(false);
  const showExpenseModal =()=>{
    setisExpenseModalVisible(true);
  }
  const showIncomeModal =()=>{
    setisIncomeModalVisible(true);
  }
  const handleIncomeCancel =()=>{
    setisIncomeModalVisible(false);
  }
  const handleExpenseCancel =()=>{
    setisExpenseModalVisible(false);
  }

  async function onFinish(values, type){
    const newTransaction ={
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name
    }
    setTransLoad(true);
    await addTransaction(newTransaction,false);
    setTransLoad(false);
    if(newTransaction.type === 'expense'){
      handleExpenseCancel();
    }else{
      handleIncomeCancel();
    }
  }

  async function addTransaction(transaction,many){
    try {

      const docRef = await addDoc(collection(db,`users/${user.uid}/transaction`),transaction);
      if(!many) toast.success("Transaction added!")
      let newArray = Transaction;
      newArray.push(transaction);
      setTransaction(newArray);
      calculateBalance();
    } catch (error) {
      if(!many) toast.error(error.message);
    }
  }

  useEffect(()=>{
    fetchTransaction();
    console.log("render 1")
  }, [user])

  async function fetchTransaction(){ 
    setLoading(true);
    if(user){
      try {
        const q = query(collection(db,`users/${user.uid}/transaction`));
        const querySnapshot = await getDocs(q);
        let transactionArray = [];
        querySnapshot.forEach((doc)=>{
          transactionArray.push({...doc.data(),
          id : doc.id, key: doc.id});
        })
        setTransaction(transactionArray);
      } catch (error) {
        
      }
    }
    setLoading(false);
  }

  useEffect(()=>{
    calculateBalance();
    console.log("render 2")
  },[Transaction]);


  function calculateBalance(){
    let income = 0;
    let expense = 0;
    Transaction.forEach((doc)=>{
      if(doc.type == 'income'){
        income += doc.amount;
      }else if(doc.type=='expense'){
        expense += doc.amount;
      }
    })
    setTotalExpense(expense);
    setTotalIncome(income);
    setTotalBalance(income-expense);
  }

  let sortedTransactions = [...Transaction].sort((a,b)=>{
        return new Date(a.date) - new Date(b.date);
  })

  async function Reset(){
    setLoading(true);
    try {
      for(const item of Transaction){
        const docRef = doc(db,`users/${user.uid}/transaction`,item.id);
        await deleteDoc(docRef);
      };
      setLoading(false);
      toast.success("Reset is Successfull!")
      fetchTransaction();
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <Header/>
      {loading?<div className='load'>
        <p>loading...</p>
      </div>:<>
        <Cards 
        showIncomeModal={()=>showIncomeModal()}
        showExpenseModal={()=>showExpenseModal()}
        totalBalance={totalBalance}
        TotalExpense={TotalExpense}
        TotalIncome = {TotalIncome}
        Reset={Reset}
        />

        <AddExpenseModal isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel} onFinish={onFinish} transLoad= {transLoad}/>
        <AddIncomeModal isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}  onFinish={onFinish} transLoad= {transLoad}/>

        {Transaction.length!=0?<Charts clasName="graph" sortedTransaction={sortedTransactions}/>:<NoTransaction/>}

        <TransactionTable Transaction={Transaction} addTransaction={addTransaction} fetchTransaction={fetchTransaction} />
      </>}
    </div>
  )
}
