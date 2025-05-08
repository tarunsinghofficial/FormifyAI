"use client";
import React, { useEffect, useState, useCallback } from "react";
import db from "../../../../config";
import { eq, and } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { generatedForms } from "../../../../config/schema";
import { ArrowLeft, Eye, Share2, Copy, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import GeneratedFormUi from "../components/GeneratedFormUi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

const EditForm = ({ params }) => {
  const { user } = useUser();
  const route = useRouter();
  const [data, setData] = useState(null);
  const [record, setRecord] = useState(null);

  const getFormData = useCallback(async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      const res = await db
        .select()
        .from(generatedForms)
        .where(
          and(
            eq(generatedForms.id, params?.formId),
            eq(generatedForms.createdBy, email)
          )
        );

      console.log("Database response:", JSON.parse(res[0].jsonform));
      setRecord(res[0]);
      setData(JSON.parse(res[0].jsonform));
    } catch (error) {
      console.error("Error fetching form data:", error);
    }
  }, [user?.primaryEmailAddress?.emailAddress, params?.formId]);

  useEffect(() => {
    if (user) {
      getFormData();
    }
  }, [user, getFormData]);

  const onFieldUpdate = (value, index) => {
    setData((prevData) => {
      const newData = { ...prevData };
      newData.formFields[index].fieldLabel = value.label;
      newData.formFields[index].placeholder = value.placeholder;
      return newData;
    });

    setData((latestData) => {
      updateFormFieldsInDb(latestData);
      return latestData;
    });
  };

  const deleteField = (indexToRemove) => {
    setData((prevData) => {
      const newData = { ...prevData };
      newData.formFields = newData.formFields.filter(
        (item, index) => index !== indexToRemove
      );
      updateFormFieldsInDb(newData);
      return newData;
    });
  };

  const updateFormFieldsInDb = async (latestData) => {
    try {
      const res = await db
        .update(generatedForms)
        .set({ jsonform: JSON.stringify(latestData) })
        .where(
          and(
            eq(generatedForms.id, record.id),
            eq(
              generatedForms.createdBy,
              user?.primaryEmailAddress?.emailAddress
            )
          )
        );

      console.log("Database update response:", res);
    } catch (error) {
      console.error("Error updating database:", error);
    }
  };

  const copyFormLink = () => {
    const formLink = `${window.location.origin}/preview/${record?.id}`;
    navigator.clipboard.writeText(formLink);
    toast.success("Form link copied to clipboard!");
  };

  const downloadFormData = () => {
    const formData = {
      title: data.formTitle,
      description: data.formSubheading,
      fields: data.formFields,
    };

    const blob = new Blob([JSON.stringify(formData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.formTitle
      .toLowerCase()
      .replace(/\s+/g, "-")}-form-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-[#1C1C1C] border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="flex justify-between items-center px-8 py-4">
          <div className="flex gap-4 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => route.back()}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="dark:text-white text-xl font-semibold">
              {data.formTitle}
            </h1>
          </div>

          <div className="flex gap-2 items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/preview/${record?.id}`} target="_blank">
                    <Button variant="ghost" size="icon">
                      <Eye className="w-5 h-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preview Form</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={copyFormLink}>
                    <Copy className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy Form Link</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={downloadFormData}
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download Form Data</p>
                </TooltipContent>
              </Tooltip>

              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share Form</p>
                  </TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Share Form</AlertDialogTitle>
                    <AlertDialogDescription>
                      Share this form with others using the following link:
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="dark:bg-gray-800 flex gap-2 items-center p-4 bg-gray-100 rounded-lg">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/preview/${record?.id}`}
                      className="focus:outline-none flex-1 bg-transparent border-none"
                    />
                    <Button variant="ghost" size="sm" onClick={copyFormLink}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Scrollable Form Content */}
      <div className="overflow-y-auto flex-1 mt-16 bg-[#F8F9FA]">
        <div className="px-8 py-4">
          <div className="mx-auto max-w-4xl">
            <GeneratedFormUi
              data={data}
              onFieldUpdate={onFieldUpdate}
              deleteField={(index) => deleteField(index)}
              formId={record?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditForm;
