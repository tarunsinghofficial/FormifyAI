import React from "react";

const Footer = () => {
  return (
    <div className="w-full container mx-auto border-t-[1px] dark:border-[#2B2D33] flex flex-col md:flex-row lg:flex-row items-center justify-between text-center py-20">
      <p className="dark:text-gray-300 text-gray-600">
        Made with ❤️ by{" Tarun Singh"}
      </p>
      <p className="dark:text-gray-300 text-gray-600">
        © 2024 FormifyAI. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
