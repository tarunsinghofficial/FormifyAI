"use client";

import Image from "next/image";
import hero from "../app/assets/hero_main.png";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LinkPreview } from "@/components/ui/link-preview";
import Link from "next/link";
import Footer from "./components/Footer";
import { motion } from "framer-motion";
import { useRef } from "react";

import feat1 from "../app/assets/feat_1.png";
import feat2 from "../app/assets/feat_2.png";
import feat3 from "../app/assets/feat_3.png";
import feat4 from "../app/assets/feat_4.png";

export default function Home() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const techStackRef = useRef(null);

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const techStack = [
    {
      name: "Gemini",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/2560px-Google_Gemini_logo.svg.png",
    },
    {
      name: "Next.js",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original-wordmark.svg",
    },
    {
      name: "Tailwind CSS",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-plain-wordmark.svg",
    },
    {
      name: "Clerk",
      image:
        "https://cdn.prod.website-files.com/64c7a317aea92912392c0420/65aaac10cefb21924a62692b_clerk-purple-logo.png",
    },
    {
      name: "PostgreSQL",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original-wordmark.svg",
    },
    {
      name: "Vercel",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original-wordmark.svg",
    },
    {
      name: "Framer Motion",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original-wordmark.svg",
    },
  ];

  return (
    <>
      <main className="md:p-0 lg:p-0 container p-6 mx-auto mt-12 w-full min-h-screen">
        <section className="container mx-auto">
          <div className="flex flex-col items-center">
            <motion.div
              className="flex flex-col items-center gap-10 mt-[5em]"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <motion.div className="space-y-5 max-w-2xl" variants={fadeInUp}>
                <motion.p
                  className="text-primary-blue font-semibold text-center"
                  variants={fadeInUp}
                >
                  COLLECT FORM SUBMISSIONS
                </motion.p>
                <motion.h2
                  className="md:text-3xl lg:text-5xl text-dark-blue dark:text-white text-2xl font-bold text-center"
                  variants={fadeInUp}
                >
                  FormifyAI - Your AI SaaS Form Builder
                </motion.h2>
                <motion.h3
                  className="dark:text-gray-300 text-lg text-center text-gray-700"
                  variants={fadeInUp}
                >
                  Easily create and share online forms using{" "}
                  <span className="font-semibold">AI prompts</span> in seconds⚡
                </motion.h3>
              </motion.div>
              <motion.div variants={fadeInUp}>
                {isSignedIn ? (
                  <h2 className="text-primary-blue text-2xl font-bold">
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
              </motion.div>
              <motion.div
                className="mockup-browser border-base-300 border"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
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
              </motion.div>
            </motion.div>
          </div>
        </section>
        <span className="border-t-[1px] dark:border-[#2B2D33]"></span>

        {/* Features Section */}
        <section className="container flex-col gap-10 py-20 mx-auto my-10 space-y-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="md:text-xl lg:text-xl text-lg font-bold text-center">
              See what you can do with FormifyAI
            </h2>
          </motion.div>
          <div className="flex flex-col gap-20 justify-between items-center">
            {[
              {
                title: "Create forms in seconds",
                description:
                  "Use AI prompts to create forms in seconds. No more manual form-building process.",
                image: feat1,
                reverse: true,
                position: "right",
              },
              {
                title: "Analyze your Forms responses",
                description:
                  "With FormifyAI, you can analyze your form submissions and get insights on your data. See charts with response data update in real-time.",
                image: feat2,
                reverse: false,
                position: "left",
              },
              {
                title: "Send Forms to your Audience",
                description:
                  "Share your forms with your audience and get responses in real-time. Customize colors, images, etc., to adjust the look and feel or reflect your organization's branding.",
                image: feat3,
                reverse: true,
                position: "right",
              },
              {
                title: "Download Responses in Excel",
                description:
                  "Export your form responses directly to Excel format. Organize and analyze your data with ease using familiar spreadsheet tools. Perfect for data analysis and reporting.",
                image: feat4,
                reverse: false,
                position: "left",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`flex flex-col ${
                  feature.reverse
                    ? "md:flex-row-reverse lg:flex-row-reverse"
                    : "md:flex-row lg:flex-row"
                } items-center gap-20`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <motion.div
                  className="flex flex-col justify-start items-start space-y-5 max-w-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="md:text-4xl lg:text-5xl text-3xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="dark:text-gray-300 text-xl text-gray-700">
                    {feature.description}
                  </p>
                </motion.div>
                <motion.div
                  className={`md:w-[50%] md:h-[50%] lg:w-[70%] lg:h-[70%] relative ${
                    feature.position === "right"
                      ? "md:pr-10 lg:pr-20"
                      : "md:pl-10 lg:pl-20"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative w-full h-full">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        feature.position === "right"
                          ? "from-blue-500/20 to-purple-500/20"
                          : "from-green-500/20 to-teal-500/20"
                      } rounded-lg blur-2xl`}
                    />
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={1500}
                      height={1500}
                      className="shadow-3xl relative z-10 rounded-lg"
                    />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="flex flex-col gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="md:text-xl lg:text-xl text-lg font-bold text-center uppercase">
              Built with Most Advanced Technologies
            </h2>
          </motion.div>
          <div className="container flex flex-row justify-between items-end mx-auto w-full">
            <motion.div
              className="flex gap-5"
              animate={{
                x: [0, -1000],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {[...techStack, ...techStack].map((tech, index) => (
                <motion.div
                  key={index}
                  className="w-44 h-24 flex items-center flex-col justify-center gap-2 bg-[#242424] bg-opacity-5 dark:bg-opacity-100 dark:border-opacity-15 dark:hover:border-opacity-40 p-2 rounded-lg"
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={tech.image}
                    alt={tech.name}
                    width={100}
                    height={100}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          className="container py-20 mx-auto my-10 space-y-10 w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="md:text-3xl lg:text-3xl text-xl font-bold text-center">
            Ready to get started?
          </h2>
          <div className="flex justify-center items-center">
            {isSignedIn ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="default">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Button onClick={handleSignUp} variant="default">
                  Get Started
                </Button>
              </motion.div>
            )}
          </div>
        </motion.section>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
