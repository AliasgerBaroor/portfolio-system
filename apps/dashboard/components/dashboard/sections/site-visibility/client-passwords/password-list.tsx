import PasswordRow from "./password-row";

import type {
    ClientAccessKey,
} from "@/types/client-access-key";

interface Props {
    passwords: ClientAccessKey[];

    selectedCredentialId:
    | string
    | null;

    onSelect: (
        credentialId: string
    ) => void;

    onRevoke: (
        accessKeyId: string
    ) => Promise<void>;
}

export default function PasswordList({
    passwords,
    selectedCredentialId,
    onSelect,
    onRevoke,
}: Props) {
    return (
        <div className="space-y-2">
            {passwords.map(
                (password) => (
                    <PasswordRow
                        key={
                            password.id
                        }
                        password={
                            password
                        }

                        selected={
                            password.id ===
                            selectedCredentialId
                        }

                        onSelect={
                            onSelect
                        }

                        onRevoke={
                            onRevoke
                        }
                    />
                )
            )}
        </div>
    );
}