// const domain = "http://127.0.0.1:5000"

export const login = (credential, asHost) => {
    const loginUrl = `/auth/login/${asHost ? "host" : "user"}`;

    return fetch(loginUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credential),
    }).then((response) => {
        if(response.status !== 200) {
            throw Error("Fail to log in");
        }

        return response.json();
    });
};

export const register = (credential) => {
    const registerUrl = '/auth/register';
    // const registerUrl = '/register/';
    return fetch(registerUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credential),
    }).then((response) => {
        if(response.status !== 201) {
            throw Error("Fail to register");
        }
    });
};

export const fetchStockAdjustedClose = async (symbol) => {
    const stockPriceUrl = `/trade/price/${symbol}`;
  
    try {
        const response = await fetch(stockPriceUrl, {
            method: "GET", // 更改为GET
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 200) {
            throw new Error("Fail to Get Stock Data");
        }

        const data = await response.json(); // 解析JSON响应
        return data; // 返回解析后的数据
    } catch (error) {
        console.error("Error fetching stock data:", error);
        throw error; // 将错误向上抛出，以便调用者可以处理
    }
};

export const buy = async (symbol, shares) => {
  const response = await fetch(`/trade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ symbol, shares, act: 'buy' })
  });

  if (!response.ok) {
    throw new Error('Failed to execute buy operation');
  }

  return response.json(); // 或者处理响应的其他方式
};

export const sell = async (symbol, shares) => {
  const response = await fetch(`/trade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ symbol, shares, act: 'sell' })
  });

  if (!response.ok) {
    throw new Error('Failed to execute sell operation');
  }

  return response.json(); // 或者处理响应的其他方式
};

export const getAssets = async () => {
  const response = await fetch(`/trade`, { // 假设获取资产使用相同的URL，实际可能不同
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get assets');
  }

  return response.json(); // 假设后端以JSON格式返回资产信息
};

export const getPrice = async (symbol) => {
    try {
        // 调用fetchStockAdjustedClose函数获取股票数据
        const data = await fetchStockAdjustedClose(symbol);
        // 检查是否有数据点
        if (data && data.length > 0) {
            // 将数据按日期排序，确保最新的日期在最前
            const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            // 返回最新的数据点
            return sortedData[0];
        } else {
            throw new Error("No data available for the given symbol.");
        }
    } catch (error) {
        console.error("Error in getPrice:", error);
        throw error;
    }
};