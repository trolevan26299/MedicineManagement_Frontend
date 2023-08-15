import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LineChart = () => {
  // Dữ liệu mẫu về doanh thu qua từng tháng
  const data = [
    { month: ' 1', revenue: 10000 },
    { month: ' 2', revenue: 15000 },
    { month: '3', revenue: 8000 },
    { month: ' 4', revenue: 7000 },
    { month: ' 5', revenue: 9500 },
    { month: '6', revenue: 8000 },
    { month: ' 7', revenue: 10000 },
    { month: ' 8', revenue: 11000 },
    { month: '9', revenue: 10000 },
    { month: ' 10', revenue: 12000 },
    { month: ' 11', revenue: 15000 },
    { month: '12', revenue: 14000 },
  ];

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
