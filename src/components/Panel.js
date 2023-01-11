import React from 'react';
import { Button,Tooltip } from 'antd';
import './Panel.css';

const Panel = ( {next, prev, buy, sell, hasGraph, strategies } ) => {

    if (hasGraph) {
      return (
        <div>
            {strategies.map((item,index)=><Tooltip title={item[1]}>
            <Button type="primary" className='button' key={index} onClick={buy.bind(null, index)}>买：{item[0]}</Button></Tooltip>)}
            <Button type="primary" className='button' onClick={sell}>卖出</Button>
            <Button type="primary" className='button' style={{opacity: 0.7}} onClick={prev}>前一天</Button>
            <Button type="primary" className='button' style={{opacity: 0.7}}onClick={next}>后一天</Button>
        </div>
      )
    } else {
      return ""
    }
  
  };

export default Panel;