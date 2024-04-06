import React, { useState } from 'react';
import { Input, Button, Modal, DatePicker, InputNumber, message, Row, Col, Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip'; // 确保路径正确
import moment from 'moment';
import 'antd/dist/antd.css'; // 导入Ant Design样式

const fetchStockAdjustedClose = async (symbol) => {
    return Promise.resolve([
        { date: "2024-04-03", adjustedClose: 8.19 },
        { date: "2024-04-02", adjustedClose: 8.5 },
        // 添加更多数据点...
    ]);
};

const Buy = ({ handleSelectData }) => {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState([]);
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleSearch = async () => {
    if (!symbol) {
      message.error("Please enter a stock symbol.");
      return;
    }
    try {
      const stockData = await fetchStockAdjustedClose(symbol);
      setData(stockData);
    } catch (error) {
      message.error("Failed to fetch stock data.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Input.Search
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              onSearch={handleSearch}
              placeholder="Enter stock symbol"
              enterButton="Search"
              size="large"
            />
          </Card>
        </Col>
        {data.length > 0 && (
          <>
            <Col span={24}>
              <Card>
                <LineChart width={730} height={250} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip onSelect={handleSelectData} />} />
                  <Legend />
                  <Line type="monotone" dataKey="adjustedClose" stroke="#8884d8" />
                </LineChart>
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <DatePicker onChange={setDate} style={{ width: '100%' }} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <InputNumber
                  min={1}
                  onChange={setAmount}
                  placeholder="Amount"
                  style={{ width: '100%' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Button type="primary" onClick={() => setConfirmVisible(true)} block>Submit</Button>
            </Col>
          </>
        )}
      </Row>
      <Modal
        title="Confirm Purchase"
        visible={confirmVisible}
        onOk={() => {
          message.success(`Successfully prepared to purchase ${amount} shares of ${symbol} on ${date.format('YYYY-MM-DD')}.`);
          setConfirmVisible(false);
        }}
        onCancel={() => setConfirmVisible(false)}
      >
        <p>Are you sure you want to purchase {amount} shares of {symbol} on {date && date.format('YYYY-MM-DD')}?</p>
      </Modal>
    </div>
  );
};

export default Buy;
