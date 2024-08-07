import React, { useState } from 'react'
import './TransactionTable.css'
import { Table, Select,Radio } from "antd";
import searchImg from '../../assets/search.svg'
import { parse, unparse } from 'papaparse';
import { toast } from 'react-toastify';
import UpdateModal from '../Modals/updateModal'
import { auth, db,doc } from '../../firebase';
import { deleteDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

function TransactionTable({Transaction,addTransaction,fetchTransaction}) {
    const [user] = useAuthState(auth)
    const [search,setSearch] = useState("");
    const [typeFilter,setTypeFilter] = useState("")
    const {Option} = Select;
    const [isupdateModalVisible,setisUpdateModalVisible] = useState(false);
    const [data,setData] = useState("");
    const [value,setvalue] = useState("");
    const [sortKey,setSortKey] = useState("");


    let filteredArray = [...Transaction].filter((item)=>
        item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter)
    );
                            
    let sortedTransactions = [...filteredArray].sort((a,b)=>{
        if(sortKey=='date'){    
            return new Date(a.date) - new Date(b.date);
        }else if(sortKey=='amount'){
            return a.amount - b.amount;
        }else{
            return 0;
        }
    })

    function exportCSV(){
        var csv = unparse(Transaction,{
            fields: ["Name","Amount","Tag","Type","Date"],
        })

        const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"})
        const url  = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transaction.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function importCSV(event){
        event.preventDefault();
        try {
            parse(event.target.files[0],{
                header: true,
                complete: async function (results){
                    console.log(results);
                    for(const item of results.data){
                        let transactionArray = item;
                        transactionArray.amount = parseFloat(item.amount);
                        await addTransaction(transactionArray,true)
                    }
                }
            })
            toast.success("All Transaction Added!")
            event.target.files = null;
        } catch (error) {
            toast.error(error.message)
        }
    }

    function handleUpdate(value,record){
        setvalue(value);
        setData(record);
        updateModalVisible();
    }

    function updateModalVisible(){
        setisUpdateModalVisible(true);
        
    }
    function handleModalCancel(){
        setisUpdateModalVisible(false);
    }

    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
          },
          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
          },
          {
            title: "Update",
            key: 'update',
            render: (text, record) => (
                <Select className='update' onChange={(value)=>{
                    if(value!="") 
                        handleUpdate(value,record)
                    }
                } placeholder="Update" allowClear>
                <Option value="amount">Amount</Option>
                <Option value="date">Date</Option>
                <Option value="tag">Tag</Option>
                <Option value="type">Type</Option>
                <Option value="name">Name</Option>
                </Select>),
          },
          {
            title: "Delete",
            key: 'delete',
            render: (text, record) => (
                <button className='btn btn-blue' onClick={() => handleDelete(record)}>Delete</button>),
          },
      ];
      async function handleDelete(record){
        try {
            const docRef = doc(db,`users/${user.uid}/transaction`,record.id);
            await deleteDoc(docRef);
            fetchTransaction();
            toast.success("Transaction Deleted!");
        } catch (error) {
            toast.error(error.message);
        }
      }

  return (
    <div className='all'>
        <div className='filter'>
            <div className="input-flex">
                <img src={searchImg}/>
                <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder='SEARCH BY NAME'/>
            </div>
            <Select className='select-input' onChange={(value)=>setTypeFilter(value)} value={typeFilter} placeholder="Filter" allowClear>
                <Option value="">All</Option>
                <Option value="income">Income</Option>
                <Option value="expense">Expense</Option>
            </Select>
        </div>
        <UpdateModal handleModalCancel={handleModalCancel} isupdateModalVisible={isupdateModalVisible} value={value} data={data} fetchTransaction={fetchTransaction}/>
        
        <div className='table'>
            <div className='sort'>
                <h2>My Transactions</h2>
                <Radio.Group className='input-radio' value={sortKey} onChange={(e)=>setSortKey(e.target.value)}>
                    <Radio.Button value={""}>No Sort</Radio.Button>
                    <Radio.Button value={"date"}>Sort By Data</Radio.Button>
                    <Radio.Button value={"amount"}>Sort By Amount</Radio.Button>
                </Radio.Group>
                <div className='btns'>
                    <button className='export-btn' onClick={exportCSV}>Export to CSV</button>
                    <label for="file-csv" className='export-btn btn-blue'>Import from CSV</label>
                    <input onChange={importCSV} id='file-csv' type='file' accept='.csv' className='file-input'/>
                </div>   
            </div>
            <Table  columns={columns} dataSource={sortedTransactions}/>  
        </div>
    </div>
  )
}

export default TransactionTable