"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import db from "../../../config";
import { generatedForms, formResponses } from "../../../config/schema";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import Card from "./components/Card";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Dashboard() {
  const [fetchedData, setFetchedData] = useState([]);
  const [totalForms, setTotalForms] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const [todayResponses, setTodayResponses] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const { user } = useUser();

  const handleReload = () => {
    setIsSpinning(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const fetchForms = useCallback(async () => {
    try {
      const forms = await db
        .select()
        .from(generatedForms)
        .where(
          eq(generatedForms.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
        .orderBy(desc(generatedForms.id));

      setFetchedData(forms);
      setTotalForms(forms.length);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayForms = forms.filter((form) => {
        const formDate = new Date(form.createdAt);
        return formDate >= today;
      });

      setTodayCount(todayForms.length);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  const fetchTotalResponses = useCallback(async () => {
    try {
      const responses = await db
        .select()
        .from(formResponses)
        .where(
          eq(formResponses.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
        .orderBy(desc(formResponses.id));
      setTotalResponses(responses.length);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayRes = responses.filter((resp) => {
        const resDate = new Date(resp.createdAt);
        return resDate >= today;
      });

      setTodayResponses(todayRes.length);
    } catch (error) {
      console.log(error);
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    if (user) {
      fetchForms();
      fetchTotalResponses();
    }
  }, [user, fetchForms, fetchTotalResponses]);

  const refreshData = () => {
    fetchForms();
  };

  const barChartData = {
    labels: ["Total Forms Created", "Total Responses Received"],
    datasets: [
      {
        label: "Count",
        data: [totalForms, totalResponses],
        backgroundColor: ["#4CAF50", "#FF9800"],
      },
    ],
  };

  const donutChartData = {
    labels: ["Forms Created Today", "Forms Left"],
    datasets: [
      {
        label: "Today",
        data: [todayCount, 100 - todayCount],
        backgroundColor: ["#2196F3", "#E0E0E0"],
      },
    ],
  };

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#1C1C1C] p-2 md:p-5 lg:p-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="lg:text-3xl md:text-3xl dark:text-white text-xl font-bold text-black">
            Overview
          </h1>
          <h2 className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
            Start managing your <strong>Forms</strong> here!
          </h2>
        </div>
        <div>
          <Button onClick={handleReload} variant="outline" size="sm">
            <RefreshCcw
              className={`mr-2 h-4 w-4 ${isSpinning ? "animate-spin" : ""}`}
            />
            Reload
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-10 mt-10">
        <div className="md:grid-cols-2 h-fit grid w-full grid-cols-1 gap-5">
          <div className="bg-white dark:bg-[#242424] p-10 rounded-lg shadow-md w-full h-[30rem] flex flex-col items-start justify-center">
            <h2 className="mb-4 text-xl font-bold">Overview</h2>
            <Bar data={barChartData} />
          </div>
          <div className="bg-white dark:bg-[#242424] p-10 rounded-lg shadow-md w-full h-[30rem] flex flex-col items-start justify-center">
            <h2 className="mb-4 text-xl font-bold">Today's Stats</h2>
            <Doughnut data={donutChartData} />
          </div>
        </div>
      </div>
      <h1 className="lg:text-3xl md:text-3xl dark:text-white mt-10 text-xl font-bold text-black">
        Recent Forms
      </h1>
      <div className="md:grid-cols-3 lg:grid-cols-3 grid grid-rows-2 gap-10 mt-10">
        {loading
          ? Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="skeleton h-52 w-full"></div>
              ))
          : fetchedData.slice(0, 8).map((form, index) => (
              <div key={index}>
                <Card
                  form={JSON.parse(form.jsonform)}
                  formRecord={form}
                  refreshData={refreshData}
                />
              </div>
            ))}
      </div>
      <div className="mt-20">
        <h1 className="text-7xl text-slate-500 text-opacity-15 font-bold text-center">
          That&apos;s all folks!
        </h1>
        <p className="text-slate-500 text-opacity-30 mt-2 text-lg text-center">
          You have reached the end of the forms.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
