import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";
import { Typography } from "@workspace/ui/components/typography/typography";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
    required?: boolean;
    inputClassName?: string;
    labelClassName?: string;

    startAddon?: React.ReactNode;
    mergeAddon?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            id,
            label,
            required = false,
            className,
            inputClassName,
            labelClassName,
            startAddon,
            mergeAddon = false,
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId();
        const inputId = id ?? generatedId;

        return (
            <div
                className={cn(
                    "flex w-full flex-col gap-2",
                    className
                )}
            >
                {label && (
                    <Typography
                        as="label"
                        htmlFor={inputId}
                        variant="field-label"
                        className={cn(
                            "text-[#221E15]",
                            labelClassName
                        )}
                    >
                        {label}

                        {required && (
                            <Typography
                                as="span"
                                variant="field-label"
                                aria-hidden="true"
                                className="ml-0.5 text-[#F84F2E]"
                            >
                                *
                            </Typography>
                        )}
                    </Typography>
                )}

                <div
                    className={cn(
                        "flex w-full items-center",
                        "rounded-[4px]",
                        "border border-[#E9E8E8]",
                        "bg-white"
                    )}
                >
                    {startAddon && (
                        <div
                            className={cn(
                                "flex shrink-0 items-center justify-center",
                                "border-r border-[#E9E8E8]",
                                "bg-[#F3EFE3]",
                                "px-2 py-1.5",
                                "gap-2"
                            )}
                        >
                            <Typography
                                as="span"
                                variant="inline-text"
                                className="text-[#221E15]/50"
                            >
                                {startAddon}
                            </Typography>
                        </div>
                    )}

                    <div
                        className={cn(
                            "flex min-w-0 flex-1 items-center",
                            "px-2 py-1.5",
                            startAddon && "pl-2"
                        )}
                    >
                        <Typography
                            ref={ref}
                            as="input"
                            variant="field-value"
                            id={inputId}
                            {...props}
                            className={cn(
                                "h-[12px] w-full",
                                "border-0 bg-transparent",
                                "p-0",
                                "outline-none",
                                "ring-0",
                                "text-[#221E15]",
                                "placeholder:text-[#221E15]/50",
                                "focus:border-0",
                                "focus:outline-none",
                                "focus:ring-0",
                                "disabled:cursor-not-allowed",
                                "disabled:opacity-50",
                                inputClassName
                            )}
                        />
                    </div>
                </div>
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };