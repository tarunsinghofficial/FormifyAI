// pages/preview/[formId].js

"use client";
import React, { useEffect, useState, useCallback } from "react";
import { generatedForms, formResponses } from "../../../../config/schema";
import db from "../../../../config";
import { eq, and } from "drizzle-orm";
import GeneratedFormUi from "@/app/edit-form/components/GeneratedFormUi";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const PreviewPage = ({ params }) => {
  const [previewData, setPreviewData] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, isSignedIn, isLoaded } = useUser();

  const fetchFormData = useCallback(async () => {
    try {
      const res = await db
        .select()
        .from(generatedForms)
        .where(eq(generatedForms.id, params?.formId));

      if (res.length > 0) {
        const formData = JSON.parse(res[0].jsonform);
        setPreviewData(formData);
        console.log("Database response:", formData);
      } else {
        console.error(`Form with ID ${params?.formId} not found.`);
      }
    } catch (error) {
      console.error("Error fetching form data:", error);
    } finally {
      setLoading(false);
    }
  }, [params?.formId]);

  const checkPreviousSubmission = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      console.log("No user email available");
      return;
    }

    try {
      const result = await db
        .select()
        .from(formResponses)
        .where(
          and(
            eq(formResponses.createdBy, user.primaryEmailAddress.emailAddress),
            eq(formResponses.formRef, params?.formId)
          )
        );

      setHasSubmitted(result.length > 0);
      console.log("Previous submission check result:", result);
    } catch (error) {
      console.error("Error checking previous submission:", error);
    }
  }, [user?.primaryEmailAddress?.emailAddress, params?.formId]);

  useEffect(() => {
    if (params) {
      fetchFormData();
    }
  }, [params, fetchFormData]);

  useEffect(() => {
    if (isSignedIn && params) {
      checkPreviousSubmission();
    }
  }, [isSignedIn, params, checkPreviousSubmission]);

  if (!isLoaded || loading) {
    return (
      <div className="bg-primary-blue flex items-center justify-center min-h-screen">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!previewData) {
    return (
      <div className="bg-primary-blue flex items-center justify-center min-h-screen">
        <p className="text-white">Form not found or error loading form data.</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="bg-primary-blue flex items-center justify-center min-h-screen">
        <div className="p-8 text-center bg-white rounded-lg">
          <h2 className="text-dark-blue mb-4 text-2xl font-bold">
            Sign in to submit the form
          </h2>
          <p className="text-dark-blue mb-4">
            You need to be signed in to submit this form.
          </p>
          <SignInButton mode="modal">
            <Button className="bg-primary-blue text-white">Sign In</Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="bg-primary-blue flex items-center justify-center min-h-screen">
        <div className="p-8 text-center bg-white rounded-lg">
          <h2 className="text-dark-blue mb-4 text-2xl font-bold">
            You&apos;ve already submitted this form
          </h2>
          <p className="text-dark-blue mb-4">
            Thank you for your submission. You can only submit this form once.
          </p>
          <Button onClick={() => window.close()}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-blue flex items-center justify-center min-h-screen">
      <GeneratedFormUi
        editable={false}
        data={previewData}
        formId={params?.formId}
      />
    </div>
  );
};

export default PreviewPage;
