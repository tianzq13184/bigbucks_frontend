// Trade.js
import React, { useState } from 'react';
import { Menu } from 'antd';
import Buy from './Buy'; // 确保路径正确
import Sell from './Sell';

const Trade = () => {
  const [activeMenu, setActiveMenu] = useState('buy');

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Menu
        style={{ width: 256 }}
        defaultSelectedKeys={['buy']}
        mode="inline"
        onSelect={({ key }) => setActiveMenu(key)}
      >
        <Menu.Item key="buy">Buy</Menu.Item>
        <Menu.Item key="sell">Sell</Menu.Item>
      </Menu>
      <div style={{ flex: 1, padding: '0 20px' }}>
        {activeMenu === 'buy' && <Buy handleSelectData={() => {}} />}
        {activeMenu === 'sell' && <Sell /> }
      </div>
    </div>
  );
};

export default Trade;
