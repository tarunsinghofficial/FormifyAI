import { Button } from "@/components/ui/button";
import { Copy, CrossIcon, Edit2, Share2, Trash2, X } from "lucide-react";
import { SocialIcon } from "react-social-icons";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import db from "../../../../config";
import { and, eq } from "drizzle-orm";
import { generatedForms } from "../../../../config/schema";
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

  const handleDeleteForm = async () => {
    const res = await db
      .delete(generatedForms)
      .where(
        and(
          eq(generatedForms.id, formRecord.id),
          eq(generatedForms.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      );

    if (res) {
      toast.success("Form deleted successfully");
      refreshData();
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
      process.env.NEXT_PUBLIC_BASE_URL + `/preview/${formRecord.id}`
    );
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="bg-white dark:bg-[#242424] border-[1px] border-[#e9ecec] dark:border-[0.5px] dark:border-[#20A072] dark:border-opacity-15 dark:hover:border-opacity-40 transition-all duration-300 hover:scale-105 hover:cursor-pointer rounded-3xl p-4 w-[100%] m:w-[100%] lg:w-[24.5em] h-auto md:h-auto lg:h-[12em] space-y-4 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
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
              <div className="bg-opacity-10 hover:cursor-pointer flex items-center justify-center w-auto h-auto gap-1 px-2 py-1 bg-red-400 rounded-full">
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
              <div className="bg-primary-blue bg-opacity-10 hover:cursor-pointer flex items-center justify-center w-auto h-auto gap-1 px-2 py-1 rounded-full">
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
              <AlertDialogFooter className="place-items-center place-content-center grid grid-cols-3 gap-5">
                <AlertDialogAction className="flex items-center gap-2 hover:bg-transparent bg-transparent text-lg text-[#057FB1]">
                  <LinkedinShareButton
                    url={
                      process.env.NEXT_PUBLIC_BASE_URL +
                      `/preview/${formRecord.id}`
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
                      `/preview/${formRecord.id}`
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
                      `/preview/${formRecord.id}`
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
                      `/preview/${formRecord.id}`
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
                      `/preview/${formRecord.id}`
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
                  className="hover:bg-transparent flex items-center gap-2 text-lg text-red-400 bg-transparent"
                >
                  <div className="bg-red-400 p-[12px] rounded-full text-white">
                    <Copy />
                  </div>
                  <span>Copy Link</span>
                </AlertDialogAction>
              </AlertDialogFooter>
              <AlertDialogCancel className="right-2 top-2 absolute border-none" >
                <X size={24} className=" hover:cursor-pointer text-red-400" />
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
    </div>
  );
};

export default Card;
