"use client";
import React, { useEffect, useState, useCallback } from "react";
import db from "../../../../config";
import { eq, and } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { generatedForms } from "../../../../config/schema";
import { ArrowLeft, ExternalLink, PlusCircle, Share } from "lucide-react";
import { useRouter } from "next/navigation";
import GeneratedFormUi from "../components/GeneratedFormUi";
import DesignControllers from "../components/DesignControllers";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      updateFormFieldsInDb(newData); // Update the database with the new data
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

  if (!data) {
    return <div>Loading...</div>;
  }

  console.log("Form ID:", record?.id);

  return (
    <div className="w-full min-h-screen px-8 py-4 mt-16">
      <div className="flex items-center justify-between">
        <div
          onClick={() => route.back()}
          className="dark:text-white hover:cursor-pointer flex items-center font-semibold text-black"
        >
          <ArrowLeft className="w-6 h-6" />
          Back
        </div>
        <div className="flex gap-4">
          <Link href={`/preview/${record?.id}`} target="_blank">
            <Button className="border-primary-blue text-primary-blue bg-transparent border-2">
              <ExternalLink className="w-6 h-6 mr-2" />
              Preview
            </Button>
          </Link>
          <Button className="bg-primary-blue">
            <Share className="w-6 h-6 mr-2" />
            Share
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-8 mt-10 space-x-4">
        <div className="col-span-6 bg-[#f5f5f5] dark:bg-[#1C1C1C] rounded-lg">
          <div className="overflow-y-scroll px-0 md:px-[10em] lg:px-[20em]">
            <GeneratedFormUi
              data={data}
              onFieldUpdate={onFieldUpdate}
              deleteField={(index) => deleteField(index)}
              formId={record?.id}
            />
          </div>
        </div>
        <div className="col-span-2 bg-[#f5f5f5] dark:bg-[#1C1C1C] rounded-lg">
          <div>
            <DesignControllers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditForm;
