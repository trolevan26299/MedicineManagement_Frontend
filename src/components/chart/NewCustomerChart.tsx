import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ColumnChart = ({ customer }: { customer: any[] }) => {
  // Dữ liệu mẫu về lượng khách hàng mới trong 12 tháng

  const data = [
    { month: 'Tháng 1', customers: 0 },
    { month: 'Tháng 2', customers: 0 },
    { month: 'Tháng 4', customers: 0 },
    { month: 'Tháng 5', customers: 0 },
    { month: 'Tháng 6', customers: 0 },
    { month: 'Tháng 7', customers: 0 },
    { month: 'Tháng 8', customers: 0 },
    { month: 'Tháng 9', customers: 0 },
    { month: 'Tháng 10', customers: 0 },
    { month: 'Tháng 11', customers: 0 },
    { month: 'Tháng 12', customers: 0 },
  ];
  customer?.forEach((customer) => {
    const createdAt = new Date(customer.created_at);
    const month = createdAt.getMonth();
    const year = createdAt.getFullYear();

    if (year === 2023) {
      data[month - 1].customers += 1;
    }
  });

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
      text: 'Statistics of new customers in 12 months in 2023',
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
