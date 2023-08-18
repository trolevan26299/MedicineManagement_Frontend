import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const TotalOrderChartComponent = ({ orders }: { orders: any[] }) => {
  const dates = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push({ date: date.toISOString().slice(0, 10), orderCount: 0 });
  }

  orders?.forEach((order) => {
    const createdAt = new Date(order.created_at);
    const orderDate = createdAt.toISOString().slice(0, 10);

    const index = dates.findIndex((date) => date.date === orderDate);
    if (index !== -1) {
      dates[index].orderCount += 1;
    }
  });
  const data = dates.map((date) => date.orderCount);
  const options: Highcharts.Options = {
    title: {
      text: 'Total number of orders by day in 30 day',
    },
    chart: {
      type: 'column',
      height: 300,
    },
    xAxis: { categories: dates.map((date) => date.date) },
    yAxis: {
      title: {
        text: 'Number of orders',
      },
    },
    series: [
      {
        name: 'Number of orders',
        data: data,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default TotalOrderChartComponent;
