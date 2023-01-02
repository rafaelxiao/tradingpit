import React from "react";
import moment from 'moment';
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn'; // Make the text in picker chinese
import 'antd/dist/antd.css';
import { ConfigProvider, DatePicker, Form, Input, Button, Space} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Field } from "rc-field-form";
import TextArea from "rc-textarea";

moment.locale('zh-cn')



export default function Lookup({lookup, form, hasGraph}) {

    const { RangePicker } = DatePicker;
  
    if (!hasGraph) {
        return(
            <div style={{width: '90%', marginTop: '10%'}}>
                <Form
                    name='lookup'
                    autoComplete="off"
                    form={form}
                >
                    
                <Form.Item
                    id="code"
                    name="stock_code"
                    rules={[{ required: true }]}
                    style={{marginBottom: '1vw'}}
                >   
                    <Input placeholder="股票代码"/>
                </Form.Item>
                
                <ConfigProvider locale={zhCN}>
                    <Form.Item 
                    name="date"
                    style={{marginBottom: '1vw'}}
                    >
                    <RangePicker
                        format="YYYY-MM-DD"
                        style={{width: '100%'}}
                        />
                    </Form.Item>
                </ConfigProvider>


                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={lookup.bind(null, form)} style={{width: '100%'}}>
                    开始
                    </Button>
                </Form.Item>
            
                </Form>
            </div>
        );
    } else {
        return ""
    }
  }
  