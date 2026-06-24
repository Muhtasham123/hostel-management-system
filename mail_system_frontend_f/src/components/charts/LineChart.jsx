import Chart from "react-apexcharts";

const LineChart = ({ series, options }) => {
  return (
    <Chart
      options={options}
      type="line"
      width="100%"
      height="100%"
      series={series}
    />
  );
};

export default LineChart;
