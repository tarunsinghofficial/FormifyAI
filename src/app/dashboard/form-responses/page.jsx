"use client";
import React, { useEffect, useState } from "react";
import { generatedForms, formResponses } from "../../../../config/schema";
import db from "../../../../config";
import { eq, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import Card from "./components/Card";
import { RefreshCcw } from "lucide-react";

function FormResponses() {
  const { user } = useUser();
  const [responses, setResponses] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    user && getResponses();
  }, [user]);

  const handleReload = () => {
    setIsSpinning(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000); 
  };

  const getResponses = async () => {
    const res = await db
      .select({
        id: generatedForms.id,
        jsonform: generatedForms.jsonform,
        createdBy: generatedForms.createdBy,
        createdAt: generatedForms.createdAt,
        responseCount: sql`COUNT(${formResponses.id})`.as("responseCount"),
        lastResponseDate: sql`MAX(${formResponses.createdAt})`.as(
          "lastResponseDate"
        ),
      })
      .from(generatedForms)
      .leftJoin(formResponses, eq(generatedForms.id, formResponses.formRef))
      .where(
        eq(generatedForms.createdBy, user?.primaryEmailAddress?.emailAddress)
      )
      .groupBy(generatedForms.id);

    console.log("dataa", res);
    setResponses(res);
  };

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#1C1C1C]  h-screen p-2 md:p-5 lg:p-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-black lg:text-3xl md:text-3xl dark:text-white">
            Form Responses
          </h1>
          <h2 className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            View all the responses to your forms
          </h2>
        </div>
        <div>
        <button onClick={handleReload} className="flex items-center gap-1">
            <RefreshCcw color="white" size={14} className={`${isSpinning ? 'animate-spin' : 'animate-none'}`} />
            <p className="text-[14px]">Reload</p>
          </button>
        </div>
      </div>
      <div className="grid grid-rows-2 gap-5 mt-10 md:grid-cols-3 lg:grid-cols-3">
        {responses.map((response, index) => (
          <div key={index}>
            <Card
              form={JSON.parse(response.jsonform)}
              formRecord={response}
              responseCount={Number(response.responseCount)}
              lastUpdated={response.lastResponseDate}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormResponses;
