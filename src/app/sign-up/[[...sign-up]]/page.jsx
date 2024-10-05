import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 py-10">
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center text-black dark:text-white max-w-4xl mt-24">
        The easiest and AI powered way to create your Forms
      </h1>
      <SignUp  />
    </div>
  )
}