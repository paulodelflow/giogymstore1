import React from "react";
import clsx from "clsx"; // Si necesitas manejar variantes más adelante

export const Card = ({ className, variant = "default", children }) => {
  const variantStyles = clsx({
    "bg-gray-800 text-white": variant === "default",
    "bg-white text-gray-900": variant === "light",
  });

  return (
    <div className={clsx("rounded-lg overflow-hidden shadow-lg", variantStyles, className)}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children }) => (
  <div className={clsx("p-4 bg-gray-800", className)}>{children}</div>
);

export const CardContent = ({ className, children }) => (
  <div className={clsx("p-4", className)}>{children}</div>
);

export const CardTitle = ({ className, children }) => (
  <h2 className={clsx("text-lg font-bold", className)}>{children}</h2>
);

export const CardDescription = ({ className, children }) => (
  <p className={clsx("text-sm text-gray-400", className)}>{children}</p>
);
