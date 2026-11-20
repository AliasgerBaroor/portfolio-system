
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
    ApplicationCredentialScopeSchema,
    CreateApplicationCredentialSchema,
} from "./create-application-credential.validator";

describe("Application credential scope validation", () => {
    it("accepts all four supported scopes", () => {
        for (const scope of [
            "content.read",
            "content.write",
            "assets.read",
            "assets.write",
        ]) {
            assert.equal(
                ApplicationCredentialScopeSchema.safeParse(scope).success,
                true,
            );
        }
    });

    it("rejects unsupported scopes", () => {
        assert.equal(
            ApplicationCredentialScopeSchema.safeParse("admin").success,
            false,
        );
    });

    it("rejects duplicate scopes", () => {
        const result = CreateApplicationCredentialSchema.safeParse({
            name: "Asset Upload",
            scopes: ["assets.write", "assets.write"],
        });

        assert.equal(result.success, false);
    });

    it("rejects credentials without scopes", () => {
        const result = CreateApplicationCredentialSchema.safeParse({
            name: "Asset Upload",
            scopes: [],
        });

        assert.equal(result.success, false);
    });
});
