import { DialogPrimitive } from "@workspace/ui/components/dialog";

import { cn } from "@workspace/ui/lib/utils";

function DialogPopup({
    className,
    ...props
}: DialogPrimitive.Popup.Props) {
    return (
        <DialogPrimitive.Popup
            className={cn(
                "fixed inset-0 z-[60] h-[100dvh] w-full outline-none",
                className
            )}
            {...props}
        />
    );
}

export default DialogPopup;