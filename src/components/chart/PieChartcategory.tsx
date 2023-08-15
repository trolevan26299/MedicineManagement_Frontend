import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PieChart = () => {
  // Dữ liệu mẫu về số lượng thuốc trong từng danh mục
  const data = [
    { name: 'Hệ thần kinh trung ương', quantity: 10 },
    { name: 'Hệ tim mạch & tạo máu', quantity: 20 },
    { name: 'Thuốc chống ung thư', quantity: 15 },
    { name: 'Thuốc kháng sinh', quantity: 30 },
    { name: 'Vitamin', quantity: 35 },
    { name: 'Thuốc cảm', quantity: 15 },
    { name: 'Hệ tiết niệu,sinh dục', quantity: 10 },
    { name: 'Thuốc da liễu', quantity: 20 },
    { name: 'Hệ cơ xương', quantity: 15 },
    { name: 'Hệ ngừa thai', quantity: 10 },
    { name: 'Mắt', quantity: 20 },
    { name: 'Tai,miệng ,họng', quantity: 15 },
    // Thêm dữ liệu danh mục khác nếu cần
  ];

  // Tạo cấu trúc dữ liệu cho biểu đồ tròn
  const chartData = data.map((item) => ({
    name: item.name,
    y: item.quantity,
  }));

  // Cấu hình biểu đồ
  const options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Number of Medicines by Category',
    },
    series: [
      {
        name: 'Number',
        data: chartData,
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default PieChart;
