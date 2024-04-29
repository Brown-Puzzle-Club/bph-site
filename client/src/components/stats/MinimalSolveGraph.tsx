import { eachHourOfInterval, eachMinuteOfInterval, max, min } from "date-fns";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

import { useBiggraph } from "../../hooks/useDjangoContext";

const findInsertionIndex = (date: Date, dates: Date[]) => {
  let low = 0;
  let high = dates.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (dates[mid] < date) {
      low = mid + 1;
    } else if (dates[mid] > date) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  return low;
};

const MinimalSolveGraph = () => {
  const { data } = useBiggraph();

  if (data === undefined) {
    return null;
  }

  const dates = data.map((solve) => new Date(solve[0]));
  const ticks = eachHourOfInterval({ start: min(dates), end: max(dates) });

  console.log(ticks.map((tick) => dates.filter((date) => date <= tick).length));

  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: "time",
      data: ticks,
      show: true,
      boundaryGap: "false",
    },
    yAxis: {
      type: "value",
      show: true,
    },
    series: [
      {
        data: ticks.map((tick) => dates.filter((date) => date <= tick).length),
        type: "line",
        areaStyle: {},
        smooth: true,
      },
    ],
    tooltip: {
      trigger: "axis",
    },
  };
  GridComponent;
  echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

  return (
    <div className="w-[50vw]">
      <ReactEChartsCore echarts={echarts} option={options} />
    </div>
  );
};

export default MinimalSolveGraph;
