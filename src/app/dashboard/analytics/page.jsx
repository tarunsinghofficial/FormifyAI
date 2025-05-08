"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import db from "../../../../config";
import { generatedForms, formResponses } from "../../../../config/schema";
import { eq, sql } from "drizzle-orm";
import { RefreshCcw } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { AiChatSession } from "../../../../config/GeminiAiModel";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const CATEGORIZATION_PROMPT = `Analyze the form title and description, and categorize it into one of these categories:
- Education (for academic, learning, training, or educational purposes)
- Health (for medical, wellness, healthcare, or fitness purposes)
- Finance (for financial, business, or economic purposes)
- Marketing (for advertising, promotion, or market research)
- HR (for human resources, employment, or workplace purposes)
- Other (for any other purposes)

Return only the category name, nothing else.`;

function Analytics() {
  const { user } = useUser();
  const [isSpinning, setIsSpinning] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [stats, setStats] = useState({
    topForms: [],
    leastForms: [],
    avgResponses: 0,
    userStats: {
      totalForms: 0,
      totalResponses: 0,
    },
    formCategories: {},
    responseTrends: {
      labels: [],
      data: [],
    },
  });

  const handleReload = () => {
    setIsSpinning(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const categorizeForm = async (formData) => {
    try {
      const prompt = `${CATEGORIZATION_PROMPT}\n\nForm Title: ${formData.formTitle}\nForm Description: ${formData.formSubheading}`;
      const result = await AiChatSession.sendMessage(prompt);
      const category = await result.response.text();
      return category.trim();
    } catch (error) {
      console.error("Error categorizing form:", error);
      return "Other";
    }
  };

  const fetchAnalytics = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      // Get all forms and their response counts
      const formsWithResponses = await db
        .select({
          id: generatedForms.id,
          jsonform: generatedForms.jsonform,
          responseCount: sql`COUNT(${formResponses.id})`.as("responseCount"),
        })
        .from(generatedForms)
        .leftJoin(formResponses, eq(generatedForms.id, formResponses.formRef))
        .where(
          eq(generatedForms.createdBy, user.primaryEmailAddress.emailAddress)
        )
        .groupBy(generatedForms.id, generatedForms.jsonform);

      // Calculate average responses per form
      const totalResponses = formsWithResponses.reduce(
        (acc, form) => acc + Number(form.responseCount),
        0
      );
      const avgResponses = formsWithResponses.length
        ? totalResponses / formsWithResponses.length
        : 0;

      // Get top and least performing forms
      const sortedForms = [...formsWithResponses].sort(
        (a, b) => Number(b.responseCount) - Number(a.responseCount)
      );
      const topForms = sortedForms.slice(0, 5);
      const leastForms = sortedForms.slice(-5).reverse();

      // Get user-specific stats
      const userStats = {
        totalForms: formsWithResponses.length,
        totalResponses: totalResponses,
      };

      // Analyze form categories using AI
      setIsCategorizing(true);
      const categories = {};
      for (const form of formsWithResponses) {
        const formData = JSON.parse(form.jsonform);
        const category = await categorizeForm(formData);
        categories[category] = (categories[category] || 0) + 1;
      }
      setIsCategorizing(false);

      // Get response trends (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0];
      }).reverse();

      const responseTrends = await Promise.all(
        last7Days.map(async (date) => {
          const startDate = new Date(date);
          const endDate = new Date(date);
          endDate.setDate(endDate.getDate() + 1);

          const count = await db
            .select({
              count: sql`COUNT(*)`.as("count"),
            })
            .from(formResponses)
            .where(
              sql`${formResponses.createdAt} >= ${startDate} AND ${formResponses.createdAt} < ${endDate}`
            );

          return {
            date,
            count: Number(count[0]?.count || 0),
          };
        })
      );

      setStats({
        topForms,
        leastForms,
        avgResponses,
        userStats,
        formCategories: categories,
        responseTrends: {
          labels: responseTrends.map((r) => r.date),
          data: responseTrends.map((r) => r.count),
        },
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setIsCategorizing(false);
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, fetchAnalytics]);

  const responseTrendsData = {
    labels: stats.responseTrends.labels,
    datasets: [
      {
        label: "Responses",
        data: stats.responseTrends.data,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const categoriesData = {
    labels: Object.keys(stats.formCategories),
    datasets: [
      {
        data: Object.values(stats.formCategories),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#1C1C1C] h-screen p-2 md:p-5 lg:p-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="lg:text-3xl md:text-3xl dark:text-white text-xl font-bold text-black">
            Analytics
          </h1>
          <h2 className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
            View detailed statistics about your forms and responses
          </h2>
        </div>
        <div>
          <button onClick={handleReload} className="flex items-center gap-1">
            <RefreshCcw
              color="white"
              size={14}
              className={`${isSpinning ? "animate-spin" : "animate-none"}`}
            />
            <p className="text-[14px]">Reload</p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
        {/* User Stats Card */}
        <div className="bg-white dark:bg-[#242424] p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
          <div className="space-y-2">
            <p>Total Forms: {stats.userStats.totalForms}</p>
            <p>Total Responses: {stats.userStats.totalResponses}</p>
            <p>Average Responses per Form: {stats.avgResponses.toFixed(2)}</p>
          </div>
        </div>

        {/* Form Categories Card */}
        <div className="bg-white dark:bg-[#242424] p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Form Categories</h3>
          <div className="h-64">
            {isCategorizing ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
                <span className="ml-2">Categorizing forms...</span>
              </div>
            ) : (
              <Doughnut data={categoriesData} />
            )}
          </div>
        </div>

        {/* Response Trends Card */}
        <div className="bg-white dark:bg-[#242424] p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Response Trends</h3>
          <div className="h-64">
            <Line data={responseTrendsData} />
          </div>
        </div>
      </div>

      {/* Top and Least Performing Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
        {/* Top Performing Forms */}
        <div className="bg-white dark:bg-[#242424] p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Top Performing Forms</h3>
          <div className="space-y-4">
            {stats.topForms.map((form, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#2B2D33] rounded-lg"
              >
                <span className="font-medium">
                  {JSON.parse(form.jsonform).formTitle}
                </span>
                <span className="text-green-600">
                  {form.responseCount} responses
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Least Performing Forms */}
        <div className="bg-white dark:bg-[#242424] p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Least Performing Forms</h3>
          <div className="space-y-4">
            {stats.leastForms.map((form, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#2B2D33] rounded-lg"
              >
                <span className="font-medium">
                  {JSON.parse(form.jsonform).formTitle}
                </span>
                <span className="text-red-600">
                  {form.responseCount} responses
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
