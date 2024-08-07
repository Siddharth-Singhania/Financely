import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";
import { collection, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

function UpdateModal({
    fetchTransaction,   
    isupdateModalVisible,
    handleModalCancel,
    value,
    data,
}) {
    const [user] = useAuthState(auth);
    const [date,setdate] = useState(false);
    const [amount,setamount] = useState(false);
    const [type,setType] = useState(false);
    const [tag,setTag] = useState(false);
    const [name,setName] = useState(false);

    useEffect(()=>{
      handletype();  
    },[value])

    function handletype(){
        if(value ==='date') setdate(true);
        else if(value=== 'amount') setamount(true)
        else if(value=== 'type') setType(true)
        else if(value === 'tag') setTag(true);
        else if(value === 'name') setName(true);
    }
    function handleUpdate(values){
      if(value ==='date'){
        setdate(false);
        const updateData = {date: values.date.format("YYYY-MM-DD")}
        Update(updateData);
      }else if(value=== 'amount'){
        setamount(false);
        const updateData = {amount: parseFloat(values.amount)}
        Update(updateData);
      }else if(value=== 'type'){
        setType(false);
        const updateData = {type: values.type}
        Update(updateData);
      }else if(value === 'tag'){
        setTag(false);
        const updateData = {tag: values.tag}
        Update(updateData);
      }else if(value === 'name'){
        setName(false)
        const updateData = {name: values.name}
        Update(updateData);
      }
      
    }
    const Update = async(updateData) =>{
      try {
        const docRef = doc(db,`/users/${user.uid}/transaction`,data.id);
        await updateDoc(docRef,updateData);
        toast.success("Data updated");
        handleModalCancel();
        fetchTransaction();
      } catch (error) {
        toast.error(error.message);
      }
    }
  const [form] = Form.useForm();
  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Update"
      open={isupdateModalVisible}
      onCancel={()=>{
        handleModalCancel();
        setName(false)
        setTag(false);
        setType(false);
        setamount(false)
        setdate(false);
      }}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          handleUpdate(values);
          form.resetFields();
        }}
      >
        {name?
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction!",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>:null}
        {amount?
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Please input the income amount!" },
          ]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>:null}
        {date?
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            { required: true, message: "Please select the income date!" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className="custom-input" />
        </Form.Item>:null}
        {tag?
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Tag"
          name="tag"
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select className="select-input-2">
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="investment">Investment</Select.Option>
            {/* Add more tags here */}
          </Select>
        </Form.Item>:null}
        {type?
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Type"
          name="type"
          rules={[{ required: true, message: "Please select a type!" }]}
        >
          <Select className="select-input-2">
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">expense</Select.Option>
            {/* Add more tags here */}
          </Select>
        </Form.Item>:null}

        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UpdateModal;