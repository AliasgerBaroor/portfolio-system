
import type { ReactNode } from "react";

interface MatchKeysProps<T extends string> {
    value: T;
    matchKeys: readonly T[];
    children: ReactNode;
}

export function MatchKeys<T extends string>({
    value,
    matchKeys,
    children,
}: MatchKeysProps<T>) {
    if (!matchKeys.includes(value)) {
        return null;
    }

    return <>{children}</>;
}
