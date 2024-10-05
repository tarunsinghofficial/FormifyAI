import { SignIn } from "@clerk/nextjs";

export default function Page() {

  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 py-10">
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center text-black dark:text-white max-w-4xl mt-24">
        The easiest and AI powered way to create your Forms
      </h1>
      <SignIn 
        appearance={{
          layout: 'centered',
          elements: {
            cardBox: "bg-[#344E41] ",
            socialButtonsBlockButton: "text-white bg-[#344E41] hover:bg-[#344E41] bg-opacity-50 hover:bg-opacity-70",
            card: "bg-[#242424] border-[1px] border-[#e9ecec] dark:border-[0.5px] dark:border-[#20A072] dark:border-opacity-15 dark:hover:border-opacity-40",
            headerTitle: "text-white dark:text-white",
            headerSubtitle: "text-white dark:text-white",
            footer: "dark:bg-[#344E41] text-white dark:text-white",
            formFieldLabel: "text-white dark:text-white",
            formFieldInput: "text-white bg-[#242424] border-[1px] border-[#e9ecec] dark:border-[0.5px] dark:border-[#20A072] dark:border-opacity-15 dark:hover:border-opacity-40",
            dividerRow: "dark:text-white",
          }
        }}
      />
    </div>
  );
}