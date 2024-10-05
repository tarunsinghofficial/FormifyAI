"use client";
import React, { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggler } from "./ThemeToggler";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const path = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false); // Close mobile menu on route change
  }, [path]);

  const handleSignIn = () => router.push("/sign-in");
  const handleSignUp = () => router.push("/sign-up");
  const handleDashboard = () => router.push("/dashboard");

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const menuVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: "-100%" },
  };

  return (
    !path.includes("preview") && (
      <nav className="bg-white dark:bg-[#1C1C1C] border-b-[1px] dark:border-[#2B2D33] fixed top-0 w-full z-50">
        <div className="mx-auto flex h-16 justify-between items-center gap-8 px-4 sm:px-6 lg:px-8">
          <div>
            <Link href="/" className="block text-primary-blue font-bold">
              FormifyAI
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {isSignedIn ? (
              <div className="flex gap-4">
                <Button
                  onClick={handleDashboard}
                  variant="default"
                >
                  Dashboard
                </Button>
                <UserButton />
                <ThemeToggler />
              </div>
            ) : (
              <div className="flex gap-4">
                <Button
                  onClick={handleSignIn}
                  variant="default"
                >
                  Login
                </Button>
                <Button variant="secondary" onClick={handleSignUp}>
                  Register
                </Button>
                <ThemeToggler />
              </div>
            )}
          </div>
          <button
            className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden"
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white dark:bg-[#1C1C1C] border-b dark:border-[#2B2D33]"
            >
              <div className="px-4 pt-2 pb-3 space-y-1">
                {isSignedIn ? (
                  <>
                    <Button
                      onClick={handleDashboard}
                      variant="default"
                    >
                      Dashboard
                    </Button>
                    <div className="flex justify-between items-center mt-2">
                      <UserButton />
                      <ThemeToggler />
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleSignIn}
                      variant="default"
                    >
                      Login
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleSignUp}
                    >
                      Register
                    </Button>
                    <div className="flex justify-end">
                      <ThemeToggler />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    )
  );
};

export default Navbar;
