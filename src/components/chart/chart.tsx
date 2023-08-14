import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ChartComponent: React.FC = () => {
  const options: Highcharts.Options = {
    title: {
      text: 'Biểu đồ Highcharts trong React',
    },
    series: [
      {
        data: [1, 2, 3, 4, 5],
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ChartComponent;
