import { DialogPrimitive } from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";

function DialogPopup({
    className,
    ...props
}: DialogPrimitive.Popup.Props) {
    return (
        <DialogPrimitive.Popup
            className={cn(
                "fixed left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2 outline-none",
                className
            )}
            {...props}
        />
    );
}

export default DialogPopup;