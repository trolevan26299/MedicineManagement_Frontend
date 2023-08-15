import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ColumnChart = () => {
  // Dữ liệu mẫu về lượng khách hàng mới trong 12 tháng
  const data = [
    { month: 'Tháng 1', customers: 100 },
    { month: 'Tháng 2', customers: 150 },
    { month: 'Tháng 4', customers: 200 },
    { month: 'Tháng 5', customers: 70 },
    { month: 'Tháng 6', customers: 300 },
    { month: 'Tháng 7', customers: 400 },
    { month: 'Tháng 8', customers: 250 },
    { month: 'Tháng 9', customers: 180 },
    { month: 'Tháng 10', customers: 220 },
    { month: 'Tháng 11', customers: 200 },
    { month: 'Tháng 12', customers: 300 },
  ];

  // Tạo cấu trúc dữ liệu cho biểu đồ cột
  const chartData = data.map((item) => ({
    name: item.month,
    y: item.customers,
  }));

  // Cấu hình biểu đồ
  const options = {
    chart: {
      type: 'spline',
    },
    title: {
      text: 'Statistics of new customers in 12 months',
    },
    xAxis: {
      categories: data.map((item) => item.month),
    },
    yAxis: {
      title: {
        text: 'Number',
      },
    },
    series: [
      {
        name: 'New Customer',
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

export default ColumnChart;
