import ms, { type StringValue } from "ms";

export function expiryDate(value: StringValue) {
    return new Date(
        Date.now() + ms(value)
    );
}