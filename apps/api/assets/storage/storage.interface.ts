
export interface StorageUploadInput {
    readonly storageKey: string;
    readonly body: Uint8Array;
    readonly contentType: string;
}

export interface StorageObjectInput {
    readonly storageKey: string;
}

export interface StorageSignedUrlInput {
    readonly storageKey: string;
    readonly expiresInSeconds: number;
}

/**
 * Provider-independent contract for private object storage.
 *
 * Implementations may use Supabase Storage, AWS S3, Cloudflare R2,
 * or another storage provider.
 */
export interface StorageProvider {
    upload(input: StorageUploadInput): Promise<void>;

    download(input: StorageObjectInput): Promise<Uint8Array>;

    /**
     * Deletes an object.
     *
     * Idempotent: succeeds if the object exists or is already absent.
     * Throws only when deletion cannot be confirmed due to a real
     * storage or provider error.
     */
    delete(input: StorageObjectInput): Promise<void>;

    getSignedUrl(input: StorageSignedUrlInput): Promise<string>;
}
