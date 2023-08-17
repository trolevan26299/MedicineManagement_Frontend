import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LineChart = ({ orders }: { orders: any[] }) => {
  // Dữ liệu mẫu về doanh thu qua từng tháng
  const data = [
    { month: '1', revenue: 0 },
    { month: '2', revenue: 0 },
    { month: '3', revenue: 0 },
    { month: '4', revenue: 0 },
    { month: '5', revenue: 0 },
    { month: '6', revenue: 0 },
    { month: '7', revenue: 0 },
    { month: '8', revenue: 0 },
    { month: '9', revenue: 0 },
    { month: '10', revenue: 0 },
    { month: '11', revenue: 0 },
    { month: '12', revenue: 0 },
  ];
  orders?.forEach((order) => {
    const createdAt = new Date(order.created_at);
    const month = createdAt.getMonth() + 1;
    const year = createdAt.getFullYear();

    if (year === 2023) {
      data[month - 1].revenue += order.total_price;
    }
  });
  console.log('data revenue', data);
  // Tạo cấu trúc dữ liệu cho biểu đồ đường
  const chartData = data.map((item) => ({
    name: item.month,
    y: item.revenue,
  }));

  // Cấu hình biểu đồ
  const options = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Monthly revenue statistics',
    },
    xAxis: {
      categories: data.map((item) => item.month),
    },
    yAxis: {
      title: {
        text: 'Revenue',
      },
    },
    series: [
      {
        name: 'Revenue',
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

export default LineChart;
