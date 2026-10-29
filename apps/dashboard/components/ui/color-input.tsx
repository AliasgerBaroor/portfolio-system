import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";
import { Typography } from "@workspace/ui/components/typography/typography";

export interface ColorInputProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "type" | "value" | "onChange"
    > {
    value?: string;
    onChange?: (value: string) => void;
    label?: React.ReactNode;
    required?: boolean;
    labelClassName?: string;
    inputClassName?: string;
}

const ColorInput = React.forwardRef<
    HTMLInputElement,
    ColorInputProps
>(
    (
        {
            id,
            value = "#000000",
            onChange,
            label,
            required = false,
            className,
            labelClassName,
            inputClassName,
            disabled,
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId();
        const inputId = id ?? generatedId;

        const colorPickerRef =
            React.useRef<HTMLInputElement>(null);

        const openColorPicker = () => {
            if (disabled) return;

            colorPickerRef.current?.click();
        };

        const handleColorChange = (
            event: React.ChangeEvent<HTMLInputElement>
        ) => {
            onChange?.(event.target.value);
        };

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
                        "bg-white",
                    )}
                >
                    <button
                        type="button"
                        onClick={openColorPicker}
                        disabled={disabled}
                        aria-label="Choose color"
                        className={cn(
                            "h-6 w-6 shrink-0",
                            "rounded-none",
                            "border-0 p-0",
                            "cursor-pointer",
                            "disabled:cursor-not-allowed",
                            "disabled:opacity-50"
                        )}
                        style={{
                            backgroundColor: value,
                        }}
                    />

                    <input
                        ref={colorPickerRef}
                        type="color"
                        value={value}
                        onChange={handleColorChange}
                        disabled={disabled}
                        tabIndex={-1}
                        aria-hidden="true"
                        className="pointer-events-none absolute h-0 w-0 opacity-0"
                    />

                    <Typography
                        ref={ref}
                        as="input"
                        variant="field-value"
                        id={inputId}
                        value={value}
                        disabled={disabled}
                        onChange={(event) =>
                            onChange?.(event.target.value)
                        }
                        className={cn(
                            "ml-2 h-[12px] min-w-0 flex-1",
                            "border-0 bg-transparent",
                            "p-0",
                            "outline-none",
                            "ring-0",
                            "text-[#221E15]",
                            "focus:border-0",
                            "focus:outline-none",
                            "focus:ring-0",
                            "disabled:cursor-not-allowed",
                            "disabled:opacity-50",
                            inputClassName
                        )}
                        {...props}
                    />
                </div>
            </div>
        );
    }
);

ColorInput.displayName = "ColorInput";

export { ColorInput };