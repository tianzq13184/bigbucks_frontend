import React, { useEffect, useState } from 'react';
import { Modal, Button, InputNumber, Table, message } from 'antd';
// import { sell, getAssets, getPrice } from '../../utils';

// 假设这些函数是模拟的，可以替换为实际的函数
const getAssets = async () => {
    return [
        { symbol: "AAPL", shares: 50 },
        { symbol: "GOOGL", shares: 30 },
        { symbol: "MSFT", shares: 20 }
    ];
};

const getPrice = async (symbol) => {
    const prices = {
        "AAPL": { date: "2024-04-06", adjustedClose: 150.00 },
        "GOOGL": { date: "2024-04-06", adjustedClose: 1200.50 },
        "MSFT": { date: "2024-04-06", adjustedClose: 250.75 }
    };
    return prices[symbol];
};

const Sell = () => {
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [sellShares, setSellShares] = useState(0);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const assetsData = await getAssets();
                const pricesPromises = assetsData.map(async asset => ({
                    ...asset,
                    key: asset.symbol,
                    price: await getPrice(asset.symbol).then(res => res.adjustedClose)
                }));
                const assetsWithPrices = await Promise.all(pricesPromises);
                setAssets(assetsWithPrices);
            } catch (error) {
                console.error('Failed to fetch assets', error);
            }
        };

        fetchAssets();
    }, []);

    const columns = [
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
        },
        {
            title: 'Shares',
            dataIndex: 'shares',
            key: 'shares',
        },
        {
            title: 'Current Price',
            dataIndex: 'price',
            key: 'price',
            render: (text) => `$${text.toFixed(2)}`,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button onClick={() => showModal(record)}>Sell</Button>
            ),
        },
    ];

    const handleSell = async () => {
        // 这里是调用sell的逻辑
        // 例如: await sell(selectedAsset.symbol, sellShares);
        message.success(`Sold ${sellShares} shares of ${selectedAsset.symbol}`);
        // 重置选择和输入
        setSelectedAsset(null);
        setSellShares(0);
    };

    const showModal = (record) => {
        setSelectedAsset(record);
        setSellShares(1); // 默认卖出1股
    };

    return (
        <div>
            <Table dataSource={assets} columns={columns} />

            <Modal
                title={`Sell ${selectedAsset?.symbol}`}
                visible={!!selectedAsset}
                onOk={handleSell}
                onCancel={() => setSelectedAsset(null)}
                okText="Confirm"
                cancelText="Cancel"
            >
                <p>How many shares of {selectedAsset?.symbol} do you want to sell?</p>
                <InputNumber
                    min={1}
                    max={selectedAsset?.shares}
                    value={sellShares}
                    onChange={setSellShares}
                />
            </Modal>
        </div>
    );
};

export default Sell;
