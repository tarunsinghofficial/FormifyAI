"use client";
import React, { useEffect, useState, useCallback } from "react";
import { generatedForms, formResponses } from "../../../../config/schema";
import db from "../../../../config";
import { eq, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import Card from "./components/Card";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

function FormResponses() {
  const { user } = useUser();
  const [responses, setResponses] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);

  const getResponses = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

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
        eq(generatedForms.createdBy, user.primaryEmailAddress.emailAddress)
      )
      .groupBy(generatedForms.id);

    console.log("dataa", res);
    setResponses(res);
  }, [user?.primaryEmailAddress?.emailAddress]); // Add user email as dependency

  useEffect(() => {
    if (user) {
      getResponses();
    }
  }, [user, getResponses]); // Add getResponses as dependency

  const handleReload = () => {
    setIsSpinning(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#1C1C1C]  h-screen p-2 md:p-5 lg:p-10">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="lg:text-3xl md:text-3xl dark:text-white text-xl font-bold text-black">
            Form Responses
          </h1>
          <h2 className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
            View all the responses to your forms
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
      <div className="md:grid-cols-3 lg:grid-cols-3 grid grid-rows-2 gap-5 mt-10">
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
