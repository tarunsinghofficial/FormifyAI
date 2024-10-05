"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { AiChatSession } from "../../../../config/GeminiAiModel";
import { useUser } from "@clerk/nextjs";
import db from "../../../../config";
import { generatedForms } from "../../../../config/schema";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const PROMPT =
  "Based on the description provided, please generate a JSON format for the form with the following structure: formTitle, formSubheading, and formFields. Include details for each field such as fieldName, fieldLabel, placeholderName, fieldType, isRequired, and options if applicable. Ensure the JSON structure remains consistent across different form types, including text inputs, number inputs, checkboxes, radio buttons, and any other specified field types.";

export default function CreateForm() {
  const [formInput, setFormInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onFormSubmit = async () => {
    if (formInput.trim() === "") {
      toast.error("Form input cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const res = await AiChatSession.sendMessage(
        `Description: ${formInput} ${PROMPT}`
      );
      const result = await res.response.text();

      if (result) {
        const response = await db
          .insert(generatedForms)
          .values({
            jsonform: result,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: new Date(),
          })
          .returning({ id: generatedForms.id });

        console.log("Added the form to DB", response[0].id);
        if (response[0].id) {
          router.push(`/edit-form/${response[0].id}`);
        }

        toast.success("Form created successfully");
      } else {
        toast.error("Failed to create form");
      }
    } catch (error) {
      console.error("Error creating form:", error);
      toast.error("An error occurred while creating the form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle className="w-6 h-6 mr-2" />
          Create Form
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter your prompt to create a Form</DialogTitle>
        </DialogHeader>
        <div className="w-full py-4">
          <Textarea
            onChange={(e) => setFormInput(e.target.value)}
            id="name"
            placeholder="Create a form for students to get their feedback on the course"
            value={formInput}
            required
          />
        </div>
        <DialogFooter>
          <Button
            disabled={loading || formInput.trim() === ""}
            onClick={onFormSubmit}
            variant="default"
            type="submit"
          >
            {loading ? (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
      <Toaster position="top-right" />
    </Dialog>
  );
}
