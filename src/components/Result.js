import React from 'react';

import { Statistic, List, Button, Radio } from 'antd';
import { color } from 'echarts/core';
import './Result.css';


export default function Result( {funds, shares, hasGraph, totalFunds, originFunds, singleRet, rets, handleBack, strategies, handleStrategy, strategyRes} ){
    
    if(hasGraph){
  
        return (
            <div style={{width: '90%'}}>

                <Statistic title={<span style={{color: 'white'}}>账户总市值</span>} value={totalFunds} precision={2} 
                    valueStyle={{lineHeight:'2vw', color:'white'}} style={{marginBottom:'8%', paddingTop:'10%', textAlign:'center'}}
                    prefix='￥'/>

            
                <List
                    size = 'small'
                    bordered = {true}
                    // style = {{
                    //     border: '1px solid red'
                    // }}
                    dataSource={[
                    {
                        title: '现金余额: ',
                        value: funds.toFixed(2)
                    },
                    {
                        title: '持股数: ',
                        value: shares.toFixed(0)
                    },
                    {
                        title: '总回报率: ',
                        value: ((totalFunds / originFunds -1)*100).toFixed(2) + '%'
                    },
                    {
                        title: '单次回报率: ',
                        value: (singleRet*100).toFixed(2) + '%'
                    },
                    {
                        title: '交易次数: ',
                        value: function(){
                            if (strategyRes=='all'){
                                return rets.length.toFixed(0)
                            } else {
                                return rets.filter(item => item[1]==strategyRes).length.toFixed(0)
                            }
                        }()
                    },
                    {
                        title: '胜率: ',
                        value: function(){

                            const calc = arrs => arrs.length>0 ? (arrs.filter(item => item[0]>0).length / arrs.length *100).toFixed(2) + '%': ""

                            if (strategyRes=='all'){
                                return calc(rets)
                            } else {
                                return calc(rets.filter(item => item[1]==strategyRes))
                            }
                        }()
                    },
                    {
                        title: '平均赔率: ',
                        value: function(){
                            const ave = arr => arr.reduce((a, b) => a + b, 0) / arr.length

                            const calc = (arrs) => {
                                if(arrs.length>0){
                                    var upside = arrs.filter(item => item[0]>0).length>0 ? ave(arrs.filter(item => item[0]>0).map(item=>item[0])) : 0.
                                    var downside = arrs.filter(item => item[0]<=0).length>0 ? -ave(arrs.filter(item => item[0]<=0).map(item=>item[0])) : 0.
                                    if(upside>0 && downside >0){
                                        return (upside / downside).toFixed(2)
                                    } else {
                                        return ""
                                    }
                                }
                            }

                            
                            if (strategyRes=='all'){
                                return calc(rets)
                            } else {
                                return calc(rets.filter(item => item[1]==strategyRes))
                            }


                        //     if(rets.length>0){
                        //         var upside = rets.filter(item => item>0).length>0 ? ave(rets.filter(item => item>0)) : 0.
                        //         var downside = rets.filter(item => item<=0).length>0 ? -ave(rets.filter(item => item<=0)) : 0.
                        //         if(upside>0 && downside >0){
                        //         return (upside / downside).toFixed(2)
                        //         }
                        //     }
                        // return ""
                        }()
                    },
                    ]}
                    // bordered
                    renderItem={item => (
                    <List.Item style={{display: 'flex', lineHeight:'1vw', color:'white', border: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)'}} key={item.title}>
                        <span>{item.title}</span>
                        <b>{item.value}</b>
                    </List.Item>
                    )}
                />,

                <Radio.Group onChange={handleStrategy} 
                    defaultValue = 'all'
                    size='small' style={{width:'100%', justifyContent:'center', display:'flex', border:'none'}}>
                    <Radio.Button value='all' className='radio'>全部</Radio.Button>
                    {strategies.map(item=><Radio.Button value={item} className='radio'>{item}</Radio.Button>)}
                </Radio.Group>


                <Button type="primary"  style={{width: '50%', marginLeft:'25%', marginTop: '8vh'}} onClick={handleBack}>
                    返回
                </Button>
            </div>
        )
        } else {
        return ""
        }
  }