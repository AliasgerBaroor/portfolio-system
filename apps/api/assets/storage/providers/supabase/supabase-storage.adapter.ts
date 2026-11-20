
import { Buffer } from "node:buffer";
import type { SupabaseClient } from "@supabase/supabase-js";

import type {
    StorageObjectInput,
    StorageProvider,
    StorageSignedUrlInput,
    StorageUploadInput,
} from "../../storage.interface";

export class SupabaseStorageAdapter implements StorageProvider {
    constructor(
        private readonly client: SupabaseClient,
        private readonly bucket: string,
    ) { }

    async upload(input: StorageUploadInput): Promise<void> {
        const { error } = await this.client.storage
            .from(this.bucket)
            .upload(
                input.storageKey,
                Buffer.from(input.body),
                {
                    contentType: input.contentType,
                    upsert: false,
                },
            );

        if (error) {
            throw error;
        }
    }

    async download(input: StorageObjectInput): Promise<Uint8Array> {
        const { data, error } = await this.client.storage
            .from(this.bucket)
            .download(input.storageKey);

        if (error) {
            throw error;
        }

        return new Uint8Array(await data.arrayBuffer());
    }

    async delete(input: StorageObjectInput): Promise<void> {
        const { error } = await this.client.storage
            .from(this.bucket)
            .remove([input.storageKey]);

        if (error) {
            throw error;
        }
    }

    async getSignedUrl(
        input: StorageSignedUrlInput,
    ): Promise<string> {
        if (
            !Number.isInteger(input.expiresInSeconds) ||
            input.expiresInSeconds <= 0
        ) {
            throw new Error("Signed URL expiry must be a positive integer.");
        }

        const { data, error } = await this.client.storage
            .from(this.bucket)
            .createSignedUrl(
                input.storageKey,
                input.expiresInSeconds,
            );

        if (error) {
            throw error;
        }

        return data.signedUrl;
    }
}
