import { Button } from "@/components/ui/button";
import { Copy, CrossIcon, Edit2, Share2, Trash2, X } from "lucide-react";
import { SocialIcon } from "react-social-icons";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import db from "../../../../config";
import { and, eq } from "drizzle-orm";
import { generatedForms, formResponses } from "../../../../config/schema";
import { useUser } from "@clerk/nextjs";
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
import toast, { Toaster } from "react-hot-toast";
import {
  LinkedinShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  FacebookShareButton,
  EmailShareButton,
} from "react-share";
import { format } from "date-fns";

const Card = ({ form, formRecord, refreshData }) => {
  const route = useRouter();
  const { user } = useUser();
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [hasResponses, setHasResponses] = useState(false);

  const handleDeleteForm = async () => {
    try {
      // Check if there are associated responses
      const responses = await db
        .select()
        .from(formResponses)
        .where(eq(formResponses.formRef, formRecord.id));

      if (responses.length > 0) {
        setHasResponses(true);
        setShowWarningDialog(true);
        return;
      }

      // No responses, delete the form directly
      await deleteFormAndResponses();
    } catch (error) {
      toast.error("Failed to check responses. Please try again.");
      console.error(error);
    }
  };

  const deleteFormAndResponses = async () => {
    try {
      // Delete associated responses
      await db
        .delete(formResponses)
        .where(eq(formResponses.formRef, formRecord.id));

      // Delete the form
      const res = await db
        .delete(generatedForms)
        .where(
          and(
            eq(generatedForms.id, formRecord.id),
            eq(
              generatedForms.createdBy,
              user?.primaryEmailAddress?.emailAddress
            )
          )
        );

      if (res) {
        toast.success("Form and its responses deleted successfully");
        refreshData();
      }
    } catch (error) {
      toast.error("Failed to delete form. Please try again.");
      console.error(error);
    } finally {
      setShowWarningDialog(false);
    }
  };

  const handleEdit = () => {
    route.push(`/edit-form/${formRecord.id}`);
  };

  const formatDate = (date) => {
    if (!date) return "No responses yet";
    const formattedDate = format(new Date(date), "MMM dd, yyyy");
    return formattedDate;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      process.env.NEXT_PUBLIC_BASE_URL + `preview/${formRecord.id}`
    );
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="bg-white dark:bg-[#242424] border-[1px] border-[#e9ecec] dark:border-[0.5px] dark:border-[#20A072] dark:border-opacity-15 dark:hover:border-opacity-40 transition-all duration-300 hover:scale-105 hover:cursor-pointer rounded-3xl p-4 w-[100%] m:w-[100%] lg:w-[24.5em] h-auto md:h-auto lg:h-[12em] space-y-4 flex flex-col justify-between">
      <div className="flex gap-3 justify-between items-start">
        <div>
          <h1 className="dark:text-white line-clamp-2 text-xl font-bold text-black">
            {form?.formTitle}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 line-clamp-2 text-sm">
            {form?.formSubheading}
          </p>
        </div>
      </div>
      <div className="lg:flex-row lg:items-center flex flex-col justify-between space-y-1">
        <div className="flex flex-wrap gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="hover:cursor-pointer flex gap-1 justify-center items-center px-2 py-1 w-auto h-auto bg-red-400 bg-opacity-10 rounded-full">
                <span>
                  <Trash2 size={11} className="text-red-500" />
                </span>
                <span className="text-xs font-semibold text-red-500">
                  Delete
                </span>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure want to delete this form?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your form from the FormifyAI database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteForm()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div
            onClick={() => handleEdit()}
            className="bg-[#9d4edd] w-auto h-auto px-2 py-1 gap-1 rounded-full bg-opacity-10 flex items-center justify-center hover:cursor-pointer"
          >
            <Edit2 size={11} className="text-[#9d4edd]" />
            <span className="text-xs font-semibold text-[#9d4edd]">Edit</span>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="bg-primary-blue hover:cursor-pointer flex gap-1 justify-center items-center px-2 py-1 w-auto h-auto bg-opacity-10 rounded-full">
                <Share2 size={11} className="text-primary-blue" />
                <span className="text-primary-blue text-xs font-semibold">
                  Share
                </span>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Share this form with your team or friends on:
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter className="grid grid-cols-3 gap-5 place-content-center place-items-center">
                <AlertDialogAction className="flex items-center gap-2 hover:bg-transparent bg-transparent text-lg text-[#057FB1]">
                  <LinkedinShareButton
                    url={
                      process.env.NEXT_PUBLIC_BASE_URL +
                      `preview/${formRecord.id}`
                    }
                    title={
                      "Thanks for using FormifyAI. Build forms using AI in seconds! Sharing the form - " +
                      form?.formTitle
                    }
                    summary={form?.formSubheading}
                  >
                    <SocialIcon network="linkedin" />
                    <span>LinkedIn</span>
                  </LinkedinShareButton>
                </AlertDialogAction>
                <AlertDialogAction className="flex items-center gap-2 hover:bg-transparent bg-transparent text-lg text-[#25D466]">
                  <WhatsappShareButton
                    url={
                      process.env.NEXT_PUBLIC_BASE_URL +
                      `preview/${formRecord.id}`
                    }
                    title={form?.formTitle}
                  >
                    <SocialIcon network="whatsapp" />
                    <span>Whatsapp</span>
                  </WhatsappShareButton>
                </AlertDialogAction>
                <AlertDialogAction className="flex items-center gap-2 hover:bg-transparent bg-transparent text-lg text-[#000]">
                  <TwitterShareButton
                    url={
                      process.env.NEXT_PUBLIC_BASE_URL +
                      `preview/${formRecord.id}`
                    }
                    title={
                      "Thanks for using FormifyAI. Build forms using AI in seconds! Sharing the form - " +
                      form?.formTitle
                    }
                  >
                    <SocialIcon network="x" />
                    <span>Twitter</span>
                  </TwitterShareButton>
                </AlertDialogAction>
                <AlertDialogAction className="flex items-center gap-2 hover:bg-transparent bg-transparent text-lg text-[#3C5997]">
                  <FacebookShareButton
                    url={
                      process.env.NEXT_PUBLIC_BASE_URL +
                      `preview/${formRecord.id}`
                    }
                    quote={
                      "Thanks for using FormifyAI. Build forms using AI in seconds! Sharing the form - " +
                      form?.formTitle
                    }
                  >
                    <SocialIcon network="facebook" />
                    <span>Facebook</span>
                  </FacebookShareButton>
                </AlertDialogAction>
                <AlertDialogAction className="flex items-center gap-2 hover:bg-transparent bg-transparent text-lg text-[#7F7F7F] ">
                  <EmailShareButton
                    url={
                      process.env.NEXT_PUBLIC_BASE_URL +
                      `preview/${formRecord.id}`
                    }
                    subject={form?.formTitle}
                    body={
                      "Thanks for using FormifyAI. Build forms using AI in seconds! Sharing the form - " +
                      form?.formSubheading
                    }
                  >
                    <SocialIcon network="email" />
                    <span>Mail</span>
                  </EmailShareButton>
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={copyToClipboard}
                  className="hover:bg-transparent flex gap-2 items-center text-lg text-red-400 bg-transparent"
                >
                  <div className="bg-red-400 p-[12px] rounded-full text-white">
                    <Copy />
                  </div>
                  <span>Copy Link</span>
                </AlertDialogAction>
              </AlertDialogFooter>
              <AlertDialogCancel className="absolute top-2 right-2 border-none">
                <X size={24} className="hover:cursor-pointer text-red-400" />
              </AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-300 text-[12px]">
            {formatDate(formRecord.createdAt)}
          </p>
        </div>
      </div>
      <Toaster position="top-right" />
      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {hasResponses
                ? "This form has associated responses"
                : "Are you sure you want to delete this form?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {hasResponses
                ? "Deleting this form will also delete all its associated responses. This action cannot be undone."
                : "This action cannot be undone. This will permanently delete your form from the FormifyAI database."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteFormAndResponses}>
              {hasResponses ? "Delete Form and Responses" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Card;
