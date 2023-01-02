import React from 'react';
import { Card, Input, Button } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import "./Cards.css"
import TextArea from 'rc-textarea';

export default function Cards({ hasGraph, strategies, handleAdd, handleRemove }) {

    const strategyName = React.useRef('')
    const strategyDetail = React.useRef('')

    if (!hasGraph) {
        return(
            <>
                <div className='inputArea'>
                    <Input placeholder='策略名称' style={{gridColumn: '3/7', gridRow: '2/3', }} onChange={(e)=>{strategyName.current=e.target.value}}/>
                    <TextArea placeholder='策略描述' style={{gridColumn: '3/7', gridRow: '3/8', textIndent: '1vh'}} rows={5} onChange={(e)=>{strategyDetail.current=e.target.value}}/>
                    <Button type="primary" style={{gridColumn: '7/8', gridRow: '5/6', width: '3vw'}} onClick={()=>{
                        handleAdd(strategyName.current, strategyDetail.current)
                    }}><PlusOutlined/></Button>
                </div>
                <div style={{height: '60vh', display:'flex', justifyContent:'flex-start', flexWrap: 'wrap', alignItems:'flex-start'}}>
                    {strategies.map((item, index) => (
                        <Card size="small" title={<h3 style={{fontWeight: 'bold'}}>{item[0]}</h3>} id={index} key={index} extra={<a href="#">
                            <MinusCircleOutlined onClick={()=>{handleRemove(index)}}/></a>} className='cards'>
                            <p>{item[1]}</p>
                        </Card>
                    ))}
                </div>

            </>
        );
    } else {
        return ""
    }
  }
  