import React from "react";
import clsx from "clsx"; // Opcional: Para manejar clases condicionales de forma más limpia

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantStyles = clsx({
      "bg-transparent hover:bg-gray-700": variant === "ghost",
      "bg-yellow-500 hover:bg-yellow-600 text-white": variant === "default",
      "bg-red-500 hover:bg-red-600 text-white": variant === "danger", // Nueva variante
    });
    const sizeStyles = clsx({
      "px-4 py-2 text-sm": size === "md",
      "px-2 py-1 text-xs": size === "sm",
      "px-6 py-3 text-lg": size === "lg", // Tamaño adicional
    });

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variantStyles, sizeStyles, className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
