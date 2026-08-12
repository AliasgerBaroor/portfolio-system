import PasswordRow from "./password-row";

import type { ClientAccessKey } from "@/types/client-access-key";

interface Props {
    passwords: ClientAccessKey[];
}

export default function PasswordList({
    passwords,
}: Props) {
    return (
        <div className="space-y-2">
            {passwords.map((password) => (
                <PasswordRow
                    key={password.id}
                    password={password}
                />
            ))}
        </div>
    );
}