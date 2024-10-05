"use client";

import Image from "next/image";
import hero from "../app/assets/herobg.png";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LinkPreview } from "@/components/ui/link-preview";
import Link from "next/link";
import Footer from "./components/Footer";

export default function Home() {
  const { user, isSignedIn } = useUser();

  const router = useRouter();

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <>
      <main className="min-h-screen w-full container mx-auto p-6 md:p-0 lg:p-0 mt-12">
        <section className="container mx-auto">
          <div className="flex flex-col items-center ">
            <div className="flex flex-col items-center gap-10 mt-[5em]">
              <div className="max-w-2xl space-y-5">
                <p className="text-primary-blue text-center font-semibold">
                  COLLECT FORM SUBMISSIONS
                </p>
                <h2 className="text-2xl md:text-3xl lg:text-5xl text-dark-blue dark:text-white font-bold text-center">
                  FormifyAI - Your AI SaaS Form Builder
                </h2>
                <h3 className="text-gray-700 dark:text-gray-300 text-center text-lg">
                  Easily create and share online forms using{" "}
                  <span className="font-semibold">AI prompts</span> in seconds⚡
                </h3>
              </div>
              <div>
                {isSignedIn ? (
                  <h2 className="text-2xl text-primary-blue font-bold">
                    Welcome back, {user.fullName}! Go to{" "}
                    <LinkPreview url="/dashboard" imageSrc={hero} isStatic>
                      Dashboard
                    </LinkPreview>
                  </h2>
                ) : (
                  <Button onClick={handleSignUp} variant="default">
                    Get Started
                  </Button>
                )}
              </div>
              <div className="mockup-browser border-base-300 border">
                <div className="mockup-browser-toolbar">
                  <div className="input border-base-300 border">
                    https://formifyai.com
                  </div>
                </div>
                <div className="border-base-300 flex justify-center border-t">
                  <Image
                    src={hero}
                    alt="hero"
                    width={1200}
                    height={1500}
                    layout="intrinsic"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <span className="border-t-[1px] dark:border-[#2B2D33]"></span>
        <section className="w-full container mx-auto py-20 my-10 space-y-10 flex-col gap-10">
          <div>
            <h2 className="text-lg md:text-xl lg:text-xl font-bold text-center">
              See what you can do with FormifyAI
            </h2>
          </div>
          <div className="flex flex-col items-center justify-between gap-20">
            <div className="flex flex-col md:flex-row-reverse lg:flex-row-reverse items-center gap-20">
              <div className="flex flex-col items-start justify-start max-w-xl space-y-5">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Create forms in seconds
                </h3>
                <p className="text-xl text-gray-700 dark:text-gray-300">
                  Use AI prompts to create forms in seconds. No more manual
                  form-building process.
                </p>
              </div>
              <div className="md:w-[50%] md:h-[50%] lg:w-[70%] lg:h-[70%]">
                <Image
                  src="https://images.unsplash.com/photo-1721843431268-b8e380c6892f?q=80&w=2027&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="hero"
                  width={1500}
                  height={1500}
                  className="rounded-lg shadow-3xl"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row lg:flex-row items-center gap-20">
              <div className="flex flex-col items-start justify-start max-w-xl space-y-5">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Analyze your Forms responses
                </h3>
                <p className="text-xl text-gray-700 dark:text-gray-300">
                  With FormifyAI, you can analyze your form submissions and get
                  insights on your data. See charts with response data update in
                  real-time.
                </p>
              </div>
              <div className="md:w-[50%] md:h-[50%] lg:w-[70%] lg:h-[70%]">
                <Image
                  src="https://images.unsplash.com/photo-1721843431268-b8e380c6892f?q=80&w=2027&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="hero"
                  width={1500}
                  height={1500}
                  className="rounded-lg shadow-3xl"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row-reverse lg:flex-row-reverse items-center gap-20">
              <div className="flex flex-col items-start justify-start max-w-xl space-y-5">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Send Forms to your Audience
                </h3>
                <p className="text-xl text-gray-700 dark:text-gray-300">
                  Share your forms with your audience and get responses in
                  real-time. Customize colors, images, etc., to adjust the look
                  and feel or reflect your organization’s branding.
                </p>
              </div>
              <div className="md:w-[50%] md:h-[50%] lg:w-[70%] lg:h-[70%]">
                <Image
                  src="https://images.unsplash.com/photo-1721843431268-b8e380c6892f?q=80&w=2027&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="hero"
                  width={1500}
                  height={1500}
                  className="rounded-lg shadow-3xl"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full container mx-auto py-20 my-10 space-y-10">
          <div>
            <h2 className="text-lg md:text-xl lg:text-xl uppercase font-bold text-center">
              Built with Most Advanced Technologies
            </h2>
            <div>
              <div className="flex flex-col items-center gap-5 mt-10">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-5">
                  <div className="w-44 h-24 flex items-center flex-col justify-center gap-2 bg-[#242424] bg-opacity-5 dark:bg-opacity-100 dark:border-opacity-15 dark:hover:border-opacity-40 p-2 rounded-lg">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/2560px-Google_Gemini_logo.svg.png"
                      alt="Gemini"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="w-44 h-24 flex items-center flex-col justify-center gap-2 bg-[#242424] bg-opacity-5 dark:bg-opacity-100 dark:border-opacity-15 dark:hover:border-opacity-40 p-2 rounded-lg">
                    <Image
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original-wordmark.svg"
                      alt="Next.js"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="w-44 h-24 flex items-center flex-col justify-center gap-2 bg-[#242424] bg-opacity-5 dark:bg-opacity-100 dark:border-opacity-15 dark:hover:border-opacity-40 p-2 rounded-lg">
                    <Image
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original-wordmark.svg"
                      alt="Tailwind CSS"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="w-44 h-24 flex items-center flex-col justify-center gap-2 bg-[#242424] bg-opacity-5 dark:bg-opacity-100 dark:border-opacity-15 dark:hover:border-opacity-40 p-2 rounded-lg">
                    <Image
                      src="https://cdn.prod.website-files.com/64c7a317aea92912392c0420/65aaac10cefb21924a62692b_clerk-purple-logo.png"
                      alt="Clerk"
                      width={100}
                      height={100}
                    />
                  </div>

                  <div className="w-44 h-24 flex items-center flex-col justify-center gap-2 bg-[#242424] bg-opacity-5 dark:bg-opacity-100 dark:border-opacity-15 dark:hover:border-opacity-40 p-2 rounded-lg">
                    <Image
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original-wordmark.svg"
                      alt="Postgresql"
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="w-44 h-24 flex items-center flex-col justify-center gap-2 bg-[#242424] bg-opacity-5 dark:bg-opacity-100 dark:border-opacity-15 dark:hover:border-opacity-40 p-2 rounded-lg">
                    <Image
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original-wordmark.svg"
                      alt="Vercel"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="w-44 h-24 flex items-center flex-col justify-center gap-2 bg-[#242424] bg-opacity-5 dark:bg-opacity-100 dark:border-opacity-15 dark:hover:border-opacity-40 p-2 rounded-lg">
                    <Image
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original-wordmark.svg"
                      alt="Framer"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      
        <section className="w-full container mx-auto py-20 my-10 space-y-10">
          <h2 className="text-xl md:text-3xl lg:text-3xl font-bold text-center">
            Ready to get started?
          </h2>
          <div className="flex items-center justify-center">
            {isSignedIn ? (
              <Button variant="default">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button onClick={handleSignUp} variant="default">
                Get Started
              </Button>
            )}
          </div>
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
