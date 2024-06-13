import ReactEChartsCore from "echarts-for-react/lib/core";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  ToolboxComponent,
  DataZoomComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

import { useTotalSolves } from "@/hooks/useDjangoContext";

const TotalSolveGraph = () => {
  const { data } = useTotalSolves();

  if (data === undefined) {
    return null;
  }

  const seriesList = Object.entries(data).map(([name, solveData]) => ({
    name,
    type: "line",
    symbolSize: 4,
    data: solveData.map((solve, idx) => [new Date(solve.solvedAt), idx + 1, solve.puzzle_name]),
  }));

  const options = {
    grid: { containLabel: true },
    xAxis: {
      type: "time",
      show: true,
    },
    yAxis: {
      type: "value",
      show: true,
    },
    legend: {
      type: "scroll",
      orient: "horizontal",
      align: "left",
      bottom: 35,
      data: seriesList.map((series) => series.name),
      textStyle: {
        color: "#fff",
      },
    },
    tooltip: {
      formatter: (params: {
        seriesName: string;
        color: string;
        data: [string, number, string];
      }) => {
        const teamName = params.seriesName;

        const date = params.data[0];
        const score = params.data[1];
        const info = params.data[2];

        // team name and color;
        const div1 = document.createElement("div");
        const span = document.createElement("span");
        span.className = "tooltip-colored-circle";
        span.style.backgroundColor = params.color;
        div1.appendChild(span);
        div1.appendChild(document.createTextNode(teamName));

        const div2 = document.createElement("div");
        const sl = document.createElement("small");
        sl.textContent = "Solved: ";
        div2.appendChild(sl);
        div2.appendChild(document.createTextNode(info));
        const ns = document.createElement("strong");
        ns.textContent = " → " + score;
        div2.appendChild(ns);

        const div3 = document.createElement("div");
        div3.textContent = date.toLocaleString();

        const div = document.createElement("div");
        div.appendChild(div1);
        div.appendChild(div2);
        div.appendChild(div3);
        return div.outerHTML;
      },
    },
    dataZoom: {
      start: 0,
      end: 100,
      height: 20,
      top: 35,
    },
    toolbox: {
      color: "#fff",
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        saveAsImage: {},
      },
    },
    series: seriesList,
    textStyle: {
      color: "#fff",
    },
  };
  GridComponent;
  echarts.use([
    GridComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition,
    LegendComponent,
    ToolboxComponent,
    TooltipComponent,
    DataZoomComponent,
  ]);
  echarts.registerTheme("dark", {});

  return (
    <div className="w-screen">
      <ReactEChartsCore echarts={echarts} option={options} />
    </div>
  );
};

export default TotalSolveGraph;
