import React from 'react';
import './App.css';
import './Grid.css';
import { PageHeader, Form } from 'antd';
import axios from 'axios';
import Lookup from './components/Lookup';
import Chart from './components/Chart';
import Panel from './components/Panel';
import Result from './components/Result';
import Cards from './components/Cards';

const App = () => {

  const initVal = {
    minDuration: 300,
    apiToken: "35af6d2ab71cbe2acff916f8344a00c2ba056d9e819bf75746f09737",
    ticks: {},
    window: 60,
    current: 60,
    end: 60,
    funds: 100000.,
    totalFunds: 100000.,
    originFunds: 100000.,
    shares: 0,
    hasGraph: false,
    singleRet: 0.,
    rets: [],
    buyPrice: 0.,
    longTerm: 50,
    shortTerm: 10,
    isLogAxis: false,
    strategyId: 0,
    strategies: [
      ['突破','从底部整理区域放量上攻'],
      ['回调','股票走到相对低点买入'],
      ['均线','快速均线上穿慢速均线'],
    ],
    strategyRes: 'all'
  }

  const [form] = Form.useForm();
  const [stockList, setStockList] = React.useState({});
  const [val, setVal] = React.useState({...initVal});

  React.useEffect(()=>{
    axios.post('/api', {
      "api_name": "stock_basic",
      "token": val.apiToken,
    })
    .then(({data})=>{
      var sList = {};
      for (var i of data.data.items) {
        sList[i[1]] = {
          'name': i[2],
          'list_date': i[6]
        };
      }
      setStockList(sList)
    })
  }, [])


  React.useEffect(
    ()=>{
      if (val.ticks.hasOwnProperty('price')){
        setVal({...val, hasGraph: true})
      } else {
        setVal({...val, hasGraph: false})
      }
    }, [val.ticks]
  )

  React.useEffect(
    ()=>{
      if (val.hasGraph) {
        const price = val.ticks['price'][val.current-1][1]
        const totalFunds = val.funds + val.shares * price
        const ret = price / val.buyPrice - 1
        if (val.buyPrice !== 0.){
          setVal({...val, totalFunds: totalFunds, singleRet: ret})
        } else {
          setVal({...val, totalFunds: totalFunds})
        }
      }
    }, [val.current]
  )

  React.useEffect(
    ()=>{
      if (val.hasGraph) {
        const price = val.ticks['price'][val.current-1][1]
        const totalFunds = val.funds + val.shares * price
        const ret = price / val.buyPrice - 1
        setVal({...val, totalFunds: totalFunds})
        if (val.buyPrice !== 0.){
          setVal({...val, totalFunds: totalFunds, singleRet: ret})
        } else {
          setVal({...val, totalFunds: totalFunds})
        }
      }
    }, [val.current]
  )


  const handleLookup = (form) => {

    var { stock_code, date } = form.getFieldsValue();
    if (stockList.hasOwnProperty(stock_code)) {

      var date_diff = date[1].diff(date[0], 'days')
      date_diff = date_diff <= val.minDuration ? val.minDuration: date_diff
  
      const params = {
        ts_code: stock_code[0]=='6'?stock_code+'.SH':stock_code+'.SZ',
        end_date: date[1].format("YYYYMMDD"),
        start_date: date[1].subtract(date_diff, 'days').format("YYYYMMDD")
      };
  
      const toPost = {
        "api_name": "daily",
        "token": val.apiToken,
        "params": params,
        "fields": ""
      };
  
      axios.post('/api', toPost)
        .then(({data}) => {
          var tick = data
          axios.post('/api', {...toPost, "api_name": "adj_factor"}).then(
            ({data}) => {
              const recentAdj = parseFloat(data.data.items[0][2]);
              if (data.data.length == tick.data.length) {
                const p = tick.data
                const strategies = val.strategies
                setVal({...initVal, strategies: strategies,
                  ticks: {
                  code: p.items[0][0],
                    price: p.items.map((item, index) => [
                      parseFloat(item[2]) / recentAdj * parseFloat(data.data.items[index][2]),
                      parseFloat(item[5]) / recentAdj * parseFloat(data.data.items[index][2]),
                      parseFloat(item[4]) / recentAdj * parseFloat(data.data.items[index][2]),
                      parseFloat(item[3]) / recentAdj * parseFloat(data.data.items[index][2])
                  ]).reverse(),
                  volume: p.items.map(item => parseInt(item[10])).reverse(),
                  date: p.items.map(item => item[1]).reverse(),
                  title: stockList[stock_code]['name']
                }});  
              };
            }
          )
        })
    }

  }

  const handleAvgWindow = (type, dur) => {
    if (type == 'long') {
      setVal({...val, longTerm: dur})
    } else if (type == 'short') {
      setVal({...val, shortTerm: dur})
    } else {
      return
    }
  };

  const handleNext = () => {
    const end = val.end + 1
    if (val.end === val.current) {
      const current = val.current + 1
      setVal({...val, 
        current: current,
        end:end
      });
    } else {
      setVal({...val, end:end})
    }
  }

  const handleBack = () => {
    setVal({...val, hasGraph: false})
  }

  const handlePrev = () => {
    if (val.end - val.window > 0) {
      const end = val.end - 1
      setVal({...val, end: end});
    }
  }


  const handleBuy = (strategy_id) => {

    if (val.shares === 0) {
      const price = val.ticks['price'][val.current-1][1]
      const sharesToBuy = Math.floor(val.funds / (price * 100)) * 100
      const funds = val.funds - sharesToBuy*price
      setVal({...val, 
        funds: funds,
        shares: sharesToBuy,
        buyPrice: price,
        strategyId: strategy_id
      })
    }
  }

  const handleSell = () => {
    if (val.shares !== 0) {
      const funds = val.totalFunds
      const rets = [...val.rets, [val.singleRet, val.strategies[val.strategyId][0]]]
      setVal({...val, 
        funds: funds,
        shares: 0,
        singleRet: 0.,
        rets: rets,
        buyPrice: 0.,
        strategyId: 0
      })
    }
  }

  const handleStrategyRes = (e) => {
    setVal({...val, strategyRes: e.target.value})
  }

  const handleAddStrategy = (name, detail) => {
    const strategies = [...val.strategies, [name, detail]]
    setVal({...val, strategies: strategies})
  }

  const handleRemoveStrategy = (id) => {
    var strategies = val.strategies
    strategies.splice(id, 1)
    setVal({...val, strategies: strategies})
  }

  return (
    <div className='main_grid'>
      <div className='header'>
        <PageHeader
          // onBack={() => null}
          title= {<h3 style={{color: 'rgb(24, 144, 255)'}}>Trading Pit</h3>}
          subTitle={<span style={{color: 'lightgrey'}}>Practice works</span>}
        />
      </div>

      <div className='lookup'>
        <Lookup 
          lookup = {handleLookup}
          form = {form}
          hasGraph = {val.hasGraph}
        />
      </div>

      <div className='result'>
        <Result funds={val.funds} shares={val.shares} hasGraph={val.hasGraph} totalFunds={val.totalFunds} 
          originFunds={val.originFunds} singleRet={val.singleRet} rets={val.rets} handleBack={handleBack} 
          strategies={val.strategies.map(item=>item[0])} handleStrategy={handleStrategyRes} strategyRes={val.strategyRes}
        />
      </div>

      <div className='graph' id='chart'>
        <Chart data={val.ticks} end={val.end} window={val.window} hasGraph={val.hasGraph} 
          current={val.current} handleAvg={handleAvgWindow} longTerm={val.longTerm} shortTerm={val.shortTerm}
          handleLog={(checked)=>{setVal({...val, isLogAxis: checked})}} isLog={val.isLogAxis}
          handleWindow={(window)=>{setVal({...val, window: window})}}
          />

        <Cards hasGraph={val.hasGraph} strategies={val.strategies} handleAdd={handleAddStrategy} handleRemove={handleRemoveStrategy}
          />
      </div>

      <div className='panel'>
        <Panel 
          next={handleNext} 
          prev={handlePrev}
          buy={handleBuy}
          sell={handleSell}
          hasGraph={val.hasGraph}
          strategies={val.strategies}
        />
      </div>
      
    </div>
  );
}

export default App;