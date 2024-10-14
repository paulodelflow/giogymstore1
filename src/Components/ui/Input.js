import React from "react";
import clsx from "clsx";

export const Input = React.forwardRef(({ className, error, ...props }, ref) => {
  const baseStyles =
    "block w-full rounded-md border bg-gray-800 text-white focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50";
  const errorStyles = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300";

  return (
    <input
      ref={ref}
      className={clsx(baseStyles, errorStyles, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";
