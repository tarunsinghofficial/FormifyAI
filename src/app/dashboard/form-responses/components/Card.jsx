import { useRouter } from "next/navigation";
import React from "react";
import db from "../../../../../config";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { formResponses } from "../../../../../config/schema";
import * as XLSX from "xlsx";
import { ArrowDownToLine, ArrowRightFromLine } from "lucide-react";
import { format, toZonedTime } from "date-fns-tz";

const Card = ({ form, formRecord, responseCount, lastUpdated }) => {
  const { user } = useUser();

  const handleDownloadData = async () => {
    let formResData = [];
    const res = await db
      .select()
      .from(formResponses)
      .where(eq(formResponses.formRef, formRecord.id));

    if (res) {
      res.forEach((item) => {
        const data = JSON.parse(item.response);
        formResData.push(data);
      });
    }
    getResponsesAsExcel(formResData);
  };

  const getResponsesAsExcel = (data) => {
    const transformedData = data.map((response) => {
      const transformedResponse = {};
      for (const key in response) {
        if (Array.isArray(response[key])) {
          transformedResponse[key] = response[key].join(", ");
        } else {
          transformedResponse[key] = response[key];
        }
      }
      return transformedResponse;
    });
    // Create a new workbook and a worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(transformedData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Responses");

    // Generate a binary string from the workbook
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Convert the binary string to a Blob
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // Create a link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${form.formTitle}_responses.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to convert a string to an ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  const formatDate = (date) => {
    if (!date) return "No responses yet";
    console.log(date);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDate = toZonedTime(new Date(date), timeZone);
    const formattedDate = format(zonedDate, "MMM dd, yyyy 'at' h:mm a");
    return formattedDate;
  };

  return (
    <div className="bg-white dark:bg-[#242424] border-[1px] border-[#e9ecec] dark:border-[0.5px] dark:border-[#20A072] dark:border-opacity-15 dark:hover:border-opacity-40 duration-300 hover:scale-105 transition-all rounded-3xl p-4 w-[100%] m:w-[100%] lg:w-[24.5em] h-auto md:h-auto lg:h-[13em] space-y-4 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white line-clamp-1">
          {form?.formTitle}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 line-clamp-1">
          {form?.formSubheading}
        </p>
      </div>
      <div>
        <h2 className="text-black dark:text-white">Total Responses</h2>
        <p className="font-bold text-slate-600 dark:text-slate-300">
          {responseCount}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div
          onClick={handleDownloadData}
          className="bg-green-700 px-[8px] w-fit py-[5px] gap-1 rounded-full bg-opacity-10 flex items-center hover:cursor-pointer"
        >
          <span className="text-sm font-semibold text-[#1AA574]">Download</span>
          <ArrowDownToLine size={12} className="text-[#1AA574]" />
        </div>
        <div>
          <p className="text-[12px] dark:text-slate-300">
            Modified {formatDate(lastUpdated)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
