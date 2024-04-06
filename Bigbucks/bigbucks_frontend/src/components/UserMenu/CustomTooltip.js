const CustomTooltip = ({ active, payload, label, onSelect }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#f5f5f5', padding: '10px', border: '1px solid #ccc' }}
      onClick={() => {
        console.log(payload[0].payload); // 打印数据结构
        onSelect(payload[0].payload);
      }}
      >
        <p>{label}</p>
        <p>{`Adjusted Close: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
