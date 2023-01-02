// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';

// import * as echarts from 'echarts';
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, LineChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  DatasetComponentOption,
  TransformComponent
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

import React from 'react';
import ReactECharts from 'echarts-for-react';

import { InputNumber, Space, Switch } from 'antd';


// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LineChart
]);


export default function Chart({ data, end, window, hasGraph, current, longTerm, shortTerm, handleAvg, handleLog, isLog, handleWindow }){

    function calculateMA(dayCount, data) {
        var result = [];
        for (var i = 0, len = data.length; i < len; i++) {
          if (i < dayCount) {
            result.push('-');
            continue;
          }
          var sum = 0;
          for (var j = 0; j < dayCount; j++) {
            sum += data[i - j];
          }
          result.push(+(sum / dayCount).toFixed(3));
        }
        return result;
      }



    if (hasGraph) {

        var transData = {...data}
        if (isLog) {
            transData.price = transData.price.map(
                (item) => {
                    return item.map((i) => Math.log(i))
                }
            )
        }
    
        transData = {
            ...transData,
            longTermAvg: calculateMA(longTerm, transData.price.map((item) => item[1])),
            shortTermAvg: calculateMA(shortTerm, transData.price.map((item) => item[1]))
        }
  
        const upColor = '#ec0000';
        const downColor =  '#00da3c';
    
        var filteredData = {
            'title': transData['title'],
            'longTerm': longTerm,
            'shortTerm': shortTerm
        }
        for (var key in transData) {
            if (key !== 'title'){
                filteredData[key] = transData[key].slice(end-window>0 ? end-window: 0, end);
            }
        }
        filteredData['volumeColor'] = []
        for (var i = 0; i < filteredData['price'].length; i++) {
            filteredData['volumeColor'].push([i, filteredData['volume'][i], filteredData['price'][i][0]<=filteredData['price'][i][1] ? 1: -1])
        }
        
        
        const set_option = (data) => {
            
            return {
            animation: false,
    
            // title: {
            //     left: 'center',
            //     text: data.title,
            //     top: '10%'
            // },
    
            grid: [
                {
                    height: '58%',
                    top: '12%',
                    left: '5%',
                    right: '5%',
                },
                {
                    top: '78%',
                    height: '10%',
                    left: '5%',
                    right: '5%',
                }
            ],
    
            tooltip: {
                trigger: 'axis',
                borderWidth: 1,
                borderColor: '#ccc',
                axisPointer: {
                type: 'cross'
                },
            },
    
            // make tooltip include every axis
            axisPointer: {
                link: [
                {
                    xAxisIndex: 'all'
                }
                ],
                label: {
                    backgroundColor: '#777'
                }
            },
    
            xAxis: [
                {
                    type: 'category', 
                    data: data.date,
                    scale: true
                },
        
                {
                    type: 'category', 
                    gridIndex: 1,
                    data: data.date,
                    axisLabel: { show: false },
                    scale: true
    
                },
        
            ],
        
            yAxis: [
                {
                    scale: true, //不显示0坐标
                    splitLine: { show: false } //不显示分割线
                },
                {
                    scale: false,
                    gridIndex: 1,
                    axisLabel: { show: false },
                    splitLine: { show: false }
                },
            ],
    
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                    start: 50,
                    end: 100
                },
                {
                    show: true,
                    xAxisIndex: [0, 1],
                    type: 'slider',
                    top: '92%',
                    start: 50,
                    end: 100
                }
            ],
    
            visualMap: {
                show: false,
                seriesIndex: 1, // control the volume color
                dimension: 2,
                pieces: [
                {
                    value: 1,
                    color: upColor
                },
                {
                    value: -1,
                    color: downColor
                }
                ]
            },
        
            series: [
                {
                    name:'价格',
                    type: 'k',
                    data: data.price,
                    itemStyle: {
                        color: upColor,
                        color0: downColor,
                        borderColor: undefined,
                        borderColor0: undefined
                    },
                    markPoint: function() {
                        if(end===current){
                        return {
                            data: [{
                            name: 'current',
                            coord: [data.date[data.date.length-1], data.price[data.price.length-1][3]*1.01],
                            value: '交易日',
                            itemStyle: {
                                color: function(){
                                if(data.price[data.price.length-1][0]<=data.price[data.price.length-1][1]){
                                    return upColor
                                } else {
                                    return downColor
                                }
                                }()
                            }
                            }]
                        }
                        }
                    }()
    
                    
                },

                {
                    name: '成交量',
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: data.volumeColor,
                },

                {
                    name: 'MA'+shortTerm.toFixed(0),
                    type: 'line',
                    data: data.shortTermAvg,
                    smooth: true,
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    lineStyle: {
                        opacity: 0.5,
                    }
                },

                {
                    name: 'MA'+longTerm.toFixed(0),
                    type: 'line',
                    data: data.longTermAvg,
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5,
                    }
                },


            ]
            }
        
        }

        const fontStyle = {
            fontSize: '12px',
        }
        
        return (
            <div>
                <Space 
                    direction='horizontal' 
                    size='large'
                    style={{
                        display: 'flex', 
                        alignItems: 'center',
                        paddingTop: '2%',
                        lineHeight: '3vh',
                        paddingBottom: '0',
                        width: '100%',
                        // height: '10vh',
                        paddingLeft: '15%',
                        // backgroundColor:'red'
                    }}
                >
                    <div style={{...fontStyle, marginRight: '2vh'}}><label>股票：<b>{data.title}</b></label></div>

                    <div>
                        <label style={fontStyle}>短均线周期：</label>
                        <InputNumber min={2} max={500} defaultValue={shortTerm} size="small" style={{width: '12vh'}} onChange={handleAvg.bind(null, 'short')}/>
                    </div>

                    <div>
                        <label style={fontStyle}>长均线周期：</label>
                        <InputNumber min={5} max={1000} defaultValue={longTerm} size="small" style={{width: '12vh'}} onChange={handleAvg.bind(null, 'long')}/>
                    </div>

                    <div>
                        <label style={fontStyle}>显示周期: </label>
                        <InputNumber min={30} max={500} defaultValue={window} size="small" style={{width: '12vh'}} onChange={handleWindow}/>
                    </div>

                    <div>
                        <label style={{...fontStyle, marginRight: '1vh'}}>对数坐标轴</label>
                        <Switch onChange={handleLog}/>
                    </div>

                </Space>
                <ReactECharts 
                    option={set_option(filteredData)}
                    style={{
                        height: '32vw',
                        paddingTop: '0',
                        marginTop: '0',
                    }}
                />
            </div>
        )

        } else {
        return ""
        }
  
  }