"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import DateFilter from "@/src/components/dashboard/DateFilter";
import DashboardCard from "@/src/components/dashboard/Card";
import SalesAndOrdersChart from "@/src/components/dashboard/Chart";

// Interfaces
interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

const DashboardPage = () => {
  const [dates, setDates] = useState<DateRange>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 11)),
    endDate: new Date(),
  });

  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: "",
      },
      {
        label: "",
        data: [],
        backgroundColor: "",
      },
    ],
  });

  const allData = useMemo(() => ({
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "Septemper", "October", "November", "December"],
    sales: [300, 600, 800, 900, 500, 300, 100, 700, 600, 600, 700, 300],
    orders: [450, 500, 700, 800, 600, 400, 250, 1000, 550, 500, 400, 200]
  }), []);
    
  const calculateChartData = useCallback(() => {
    const monthLabels = allData.labels.slice(
      dates.startDate.getMonth(),
      dates.endDate.getMonth() + 1
    );
    const salesData = allData.sales.slice(
      dates.startDate.getMonth(),
      dates.endDate.getMonth() + 1
    );
    const ordersData = allData.orders.slice(
      dates.startDate.getMonth(),
      dates.endDate.getMonth() + 1
    );

    return {
      labels: monthLabels,
      datasets: [
        {
          label: "Sales",
          data: salesData,
          backgroundColor: "rgba(255, 99, 132, 0.7)",
        },
        {
          label: "Orders",
          data: ordersData,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
        },
      ],
    };
  }, [dates, allData]); 

  useEffect(() => {
    setChartData(calculateChartData()); 
  }, [calculateChartData]); 

  return (
    <div className="flex flex-col gap-8">
      <DateFilter onDateChange={setDates} />
      <div className="grid grid-cols-2 gap-4">
        <DashboardCard
          title="Total Sales"
          value={`$${chartData.datasets[0].data.reduce((a, b) => a + b, 0)}`}
        />
        <DashboardCard
          title="Total Orders"
          value={`${chartData.datasets[1].data.reduce((a, b) => a + b, 0)}`}
        />
      </div>
      <SalesAndOrdersChart data={chartData} />
    </div>
  );
};

export default DashboardPage;
