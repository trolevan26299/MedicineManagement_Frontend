import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PieChart = ({ category }: { category: any[] }) => {
  const data = [];

  category?.forEach((item) => {
    const name = item.name;
    const quantity = item.medicines.length;

    data.push({ name, quantity });
  });

  // Tạo cấu trúc dữ liệu cho biểu đồ tròn
  const chartData = data.map((item) => ({
    name: item.name,
    y: item.quantity,
  }));

  // Cấu hình biểu đồ
  const options = {
    chart: {
      type: 'pie',
      height: 350,
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
