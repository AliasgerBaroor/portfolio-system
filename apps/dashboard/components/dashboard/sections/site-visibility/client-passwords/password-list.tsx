import PasswordRow from "./password-row";

import type { ClientAccessKey } from "@/types/client-access-key";

interface Props {
    passwords: ClientAccessKey[];

    onRevoke: (
        accessKeyId: string
    ) => Promise<void>;
}

export default function PasswordList({
    passwords,
    onRevoke,
}: Props) {
    return (
        <div className="space-y-2">
            {passwords.map((password) => (
                <PasswordRow
                    key={password.id}
                    password={password}
                    onRevoke={onRevoke}
                />
            ))}
        </div>
    );
}