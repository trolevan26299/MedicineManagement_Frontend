import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const TotalOrderChartComponent: React.FC = () => {
  const data = [
    97, 86, 72, 157, 67, 143, 199, 75, 136, 55, 112, 64, 66, 123, 156, 100, 80, 68, 141, 163, 134, 103, 178, 69, 72,
    196, 184, 140, 114, 121,
  ];
  const options: Highcharts.Options = {
    title: {
      text: 'Total number of orders by day in 1 month',
    },
    chart: {
      type: 'column',
    },
    xAxis: {
      categories: [
        'Date 1',
        'Date 2',
        'Date 3',
        'Date 4',
        'Date 5',
        'Date 6',
        'Date 7',
        'Date 8',
        'Date 9',
        'Date 10',
        'Date 11',
        'Date 12',
        'Date 13',
        'Date 14',
        'Date 15',
        'Date 16',
        'Date 17',
        'Date 18',
        'Date 19',
        'Date 20',
        'Date 21',
        'Date 22',
        'Date 23',
        'Date 24',
        'Date 25',
        'Date 26',
        'Date 27',
        'Date 28',
        'Date 29',
        'Date 30',
      ],
    },
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
