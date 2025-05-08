import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import FieldEdit from "./FieldEdit";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import db from "../../../../config";
import { formResponses } from "../../../../config/schema";
import { SignedIn, SignInButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import toast, { Toaster } from "react-hot-toast";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function GeneratedFormUi({
  data,
  onFieldUpdate,
  deleteField,
  editable = true,
  formId = 0,
}) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const { user, isSignedIn } = useUser();
  const formRef = useRef();

  const pathname = usePathname();
  const isEditFormPage = pathname.startsWith("/edit-form/");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;

    console.log(`File change detected for field: ${fieldName}`, file);

    if (file) {
      setLoading(true);

      try {
        const { data, error } = await supabase.storage
          .from("user-data")
          .upload(`public/${file.name}`, file, { upsert: true });

        if (error) {
          throw error;
        }

        console.log("Supabase upload response:", data);

        const { data: urlData } = supabase.storage
          .from("user-data")
          .getPublicUrl(`public/${file.name}`);

        const fileUrl = urlData.publicUrl;

        console.log(`Generated public URL for ${fieldName}:`, fileUrl);

        setFormData((prevData) => {
          const newData = {
            ...prevData,
            [fieldName]: fileUrl,
          };
          console.log("Updated form data:", newData);
          return newData;
        });
        setUploadedFile({ name: file.name, field: fieldName });
        toast.success("File uploaded successfully");
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload file. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileDelete = async () => {
    if (uploadedFile) {
      setLoading(true);
      try {
        const { error } = await supabase.storage
          .from("user-data")
          .remove([`public/${uploadedFile.name}`]);

        if (error) {
          throw error;
        }

        setFormData((prevData) => {
          const newData = { ...prevData };
          delete newData[uploadedFile.field]; // Use the stored field name
          return newData;
        });
        setUploadedFile(null);
        toast.success("File deleted successfully");
      } catch (error) {
        console.error("Error deleting file:", error);
        toast.error("Failed to delete file. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckBoxChange = (fieldName, itemName, checked) => {
    setFormData((prevData) => {
      const updatedList = prevData[fieldName] || [];

      if (checked) {
        // Add item if checked
        if (!updatedList.includes(itemName)) {
          updatedList.push(itemName);
        }
      } else {
        // Remove item if unchecked
        const index = updatedList.indexOf(itemName);
        if (index !== -1) {
          updatedList.splice(index, 1);
        }
      }

      return {
        ...prevData,
        [fieldName]: updatedList,
      };
    });
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    if (!formId) {
      toast.error("Invalid form ID. Please try again.");
      return;
    }

    console.log("Final form data before submission:", formData);

    try {
      const response = await db.insert(formResponses).values({
        response: JSON.stringify(formData),
        createdAt: new Date(),
        createdBy: user?.primaryEmailAddress?.emailAddress,
        formRef: formId,
      });

      if (response) {
        console.log("Form submitted successfully. Response:", response);
        formRef.current.reset();
        setFormData({});
        setUploadedFile(null);
        toast.success("Form submitted successfully");
        toast.success("Page will close in 3 seconds");
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again later.");
    }
  };

  if (submitted) {
    return (
      <div className="bg-white dark:bg-[#242424] dark:border-[0.5px] dark:border-[#20A072] dark:border-opacity-15 dark:hover:border-opacity-40 transition-all duration-300 rounded-lg p-8 m-4 h-full w-full max-w-[600px] text-center">
        <h2 className="mb-4 text-2xl font-bold">
          Thank you for your submission!
        </h2>
        <p className="mb-4">Your response has been recorded.</p>
        <Button onClick={() => window.close()} className="mr-2">
          Close Window
        </Button>
        <Button onClick={() => window.history.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-auto h-full">
      <form ref={formRef} onSubmit={onHandleSubmit}>
        <div className="bg-white dark:bg-[#242424] dark:border-[0.5px] dark:border-[#20A072] dark:border-opacity-15 dark:hover:border-opacity-40 transition-all duration-300 rounded-lg p-8 m-4 h-full w-full max-w-[600px]">
          <h1 className="text-dark-blue dark:text-white text-3xl font-bold">
            {data?.formTitle}
          </h1>
          <h2 className="text-slate-600 dark:text-slate-300">
            {data?.formSubheading}
          </h2>
          <p className="mt-5 text-sm text-red-400">
            * indicates required field
          </p>
        </div>
        <div className="bg-white dark:bg-[#242424] dark:border-[0.5px] dark:border-[#20A072] dark:border-opacity-15 dark:hover:border-opacity-40 transition-all duration-300 rounded-lg p-8 m-4 h-full w-full max-w-[600px]">
          <div className="mt-5 space-y-4">
            {data?.formFields?.map((field, index) => (
              <div key={index} className="group flex gap-4 items-start">
                {field.fieldType === "checkbox" && (
                  <div className="gap-4 items-start w-full">
                    <div className="space-y-1 w-full">
                      <label className="text-slate-600 dark:text-slate-300">
                        {field?.fieldLabel || field?.formLabel || field?.label}{" "}
                        {field?.isRequired && (
                          <span className="text-red-400">*</span>
                        )}
                      </label>
                      {field.options?.map((item, idx) => {
                        const option =
                          typeof item === "string"
                            ? { value: item, label: item }
                            : item;
                        return (
                          <div
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={option.value}
                              onCheckedChange={(val) =>
                                handleCheckBoxChange(
                                  field.fieldName || field.name,
                                  option.value,
                                  val
                                )
                              }
                            />
                            <Label htmlFor={option.value}>{option.label}</Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {field.fieldType === "radio" && (
                  <div>
                    <div className="space-y-1 w-full">
                      <label className="text-slate-600 dark:text-slate-300">
                        {field?.fieldLabel || field?.formLabel || field?.label}{" "}
                        {field?.isRequired && (
                          <span className="text-red-400">*</span>
                        )}
                      </label>
                      <RadioGroup
                        required={field?.isRequired || field?.required}
                      >
                        {field.options?.map((item, idx) => {
                          const option =
                            typeof item === "string"
                              ? { value: item, label: item }
                              : item;
                          return (
                            <div
                              key={idx}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={option.value}
                                id={option.value}
                                onClick={() =>
                                  handleSelectChange(
                                    field.fieldName || field.name,
                                    option.label
                                  )
                                }
                              />
                              <Label htmlFor={option.value}>
                                {option.label}
                              </Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {field.fieldType === "select" && (
                  <div className="space-y-1 w-full">
                    <label className="text-slate-600 dark:text-slate-300">
                      {field?.fieldLabel || field?.formLabel || field?.label}{" "}
                      {field?.isRequired && (
                        <span className="text-red-400">*</span>
                      )}
                    </label>
                    <Select
                      required={field?.isRequired || field?.required}
                      onValueChange={(v) =>
                        handleSelectChange(field?.fieldName || field?.name, v)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          placeholder={
                            field?.placeholder || field?.placeholderName
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((item, idx) => {
                          const option =
                            typeof item === "string"
                              ? { label: item, value: item }
                              : item;
                          return (
                            <SelectItem key={idx} value={option.value}>
                              {option.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {field.fieldType === "textarea" && (
                  <div className="space-y-1 w-full">
                    <label className="text-slate-600 dark:text-slate-300">
                      {field?.fieldLabel}{" "}
                      {field?.isRequired && (
                        <span className="text-red-400">*</span>
                      )}
                    </label>
                    <Textarea
                      name={field?.fieldName}
                      type={field?.fieldType}
                      placeholder={field?.placeholder || field?.placeholderName}
                      required={field?.isRequired || field?.required}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                )}
                {field.fieldType === "number" && (
                  <div className="space-y-1 w-full">
                    <label className="text-slate-600 dark:text-slate-300">
                      {field?.fieldLabel}{" "}
                      {field?.isRequired && (
                        <span className="text-red-400">*</span>
                      )}
                    </label>
                    <Input
                      name={field?.fieldName}
                      type={field?.fieldType}
                      placeholder={field?.placeholder || field?.placeholderName}
                      required={field?.isRequired || field?.required}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                )}
                {field.fieldType === "file" && (
                  <div className="space-y-1 w-full">
                    <label className="text-slate-600 dark:text-slate-300">
                      {field?.fieldLabel}{" "}
                      {field?.isRequired && (
                        <span className="text-red-400">*</span>
                      )}
                      <span className="text-xs italic">
                        (only jpg, jpeg, pdf, xlsx, docx are allowed.)
                      </span>
                    </label>
                    <input
                      name={field.fieldName} // This should be the dynamic field name
                      type={field.fieldType}
                      required={field.isRequired || field.required}
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                    {uploadedFile && uploadedFile.field === field.fieldName && (
                      <div className="mt-2">
                        <p>Uploaded: {uploadedFile.name}</p>
                        <div className="mt-1 space-x-2">
                          <Button
                            type="button"
                            onClick={() =>
                              document
                                .querySelector(
                                  `input[name="${field.fieldName}"]`
                                )
                                .click()
                            }
                            disabled={loading}
                          >
                            Change File
                          </Button>
                          <Button
                            type="button"
                            onClick={handleFileDelete}
                            disabled={loading}
                            variant="secondary"
                          >
                            Delete File
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {[
                  "select",
                  "radio",
                  "checkbox",
                  "textarea",
                  "number",
                  "file",
                ].indexOf(field.fieldType) === -1 && (
                  <div className="space-y-1 w-full">
                    <label className="text-slate-600 dark:text-slate-300">
                      {field?.fieldLabel}{" "}
                      {field?.isRequired && (
                        <span className="text-red-400">*</span>
                      )}
                    </label>
                    <Input
                      name={field?.fieldName}
                      type={field?.fieldType}
                      placeholder={field?.placeholder || field?.placeholderName}
                      required={field?.isRequired || field?.required}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                )}
                <div>
                  {editable && (
                    <FieldEdit
                      defaultValue={field}
                      onUpdate={(value) => onFieldUpdate(value, index)}
                      onDelete={() => deleteField(index)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            {isEditFormPage ? (
              <Button
                disabled={true}
                type="submit"
                className="bg-primary-blue text-white opacity-50 cursor-not-allowed"
              >
                Submit
              </Button>
            ) : isSignedIn ? (
              <Button type="submit" className="bg-primary-blue text-white">
                Submit
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button className="bg-primary-blue text-white">
                  Sign In to Submit
                </Button>
              </SignInButton>
            )}
          </div>
        </div>

        <Toaster position="top-right" />
      </form>
      <div className="my-5 space-y-4 text-center">
        <p className="text-sm">
          This content is neither created nor endorsed by FormifyAI.
        </p>
        <h1 className="text-xl font-bold">FormifyAI</h1>
      </div>
    </div>
  );
}

export default GeneratedFormUi;
