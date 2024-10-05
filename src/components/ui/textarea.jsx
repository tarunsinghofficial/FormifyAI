import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border dark:border-[0.5px] dark:border-[#20A072] dark:border-opacity-15 dark:hover:border-opacity-40 duration-300 transition-all bg-[#F8FAFC] dark:bg-[#242424] px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground dark:placeholder:text-[#C3C3C3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
