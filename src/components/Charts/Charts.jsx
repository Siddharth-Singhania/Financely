import React, { useEffect, useState } from 'react'
import { Line, Pie } from '@ant-design/charts'
import { Row,Card } from 'antd';
import './Charts.css'
function Charts(props) {
    const [ChartDimension,setChartDimension] = useState({width:850, height: 500});
    const [PieDimension,setPieDimension] = useState({width: 350,height: 500});
    let amountnew = 0;
    const data= props.sortedTransaction.map((item)=>{
        if(item.type === 'income'){
            amountnew += item.amount;
        }else if(item.type === 'expense'){
            amountnew -= item.amount;
        }
        return {date:item.date, amount: amountnew}
    })
    const spendingData = props.sortedTransaction.filter((transaction)=>{
        if(transaction.type === "expense"){
            return {tag:transaction.tag, amount:transaction.amount}
        }
    })
    let finalData =spendingData.reduce((acc,obj)=>{
        let key = obj.tag;
        if(acc[key]){
            acc[key].amount += obj.amount;
        }else{
            acc[key] = {tag: obj.tag, amount: obj.amount}
        }
        return acc;
    },{});
    const config = {
        data: data,
        xField: 'date',
        yField: 'amount',
        width: ChartDimension.width, // Set width here
        height: ChartDimension.height, // Set height here
        autoFit: true, // Disable auto fitting to container
      };
      const pieConfig={
        radius: 1,
        data: Object.values(finalData),
        width: PieDimension.width,
        height: PieDimension.height,
        angleField:"amount",
        colorField:"tag",
        display: "flex",
        } 
        
        useEffect(()=>{
            function handleResize(){
                if(window.innerWidth<1300){
                    setChartDimension({width: window.innerWidth*0.4, height:250})
                    setPieDimension({width: window.innerWidth*0.4, height: 250})
                }else{
                    setChartDimension({width: 800, height:500})
                    setPieDimension({width: 350, height: 500})
                }
            }
            window.addEventListener('resize',handleResize);
            handleResize();
            window.removeEventListener('resize',handleResize);
        },[])


  return (
    <div className="charts-wrapper">
        <Row className = "rows">
            <Card className="cards line" >
                <h2>Financial Statistics</h2>
                <Line {...config}/>
            </Card>
            <Card className="cards pie">
                <h2>Total Spending</h2>
                <Pie {...pieConfig}/>
            </Card>
      </Row>
    </div>
  )
}

export default Charts;