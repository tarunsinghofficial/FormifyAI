"use client";
import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import db from "../../../../config";
import { generatedForms } from "../../../../config/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { RefreshCcw } from "lucide-react";

function MyForms() {
  const [fetchedData, setFetchedData] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    user && fetchForms();
  }, [user]);

  const handleReload = () => {
    setIsSpinning(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const fetchForms = async () => {
    try {
      const res = await db
        .select()
        .from(generatedForms)
        .where(
          eq(generatedForms.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
        .orderBy(desc(generatedForms.id));
      setFetchedData(res);
      setLoading(false);

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const refreshData = () => {
    fetchForms();
  };

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#1C1C1C] h-screen p-2 md:p-5 lg:p-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-black lg:text-3xl md:text-3xl dark:text-white">
            My Forms
          </h1>
          <h2 className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Start managing your <strong>Forms</strong> here!
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
      <div>{/* add the overview of Todays form creation if made */}</div>
      {/* all other forms  */}
      <div className="grid grid-rows-2 gap-5 mt-10 md:grid-cols-3 lg:grid-cols-3">
        {loading
          ? Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="w-full skeleton h-52"></div>
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
    </div>
  );
}

export default MyForms;
