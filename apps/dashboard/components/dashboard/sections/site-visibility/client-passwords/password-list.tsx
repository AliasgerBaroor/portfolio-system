import PasswordRow from "./password-row";
import { ClientPassword } from "./types";

interface Props {
    passwords: ClientPassword[];
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