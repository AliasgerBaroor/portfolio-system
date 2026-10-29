const SUPABASE_URL =
    process.env.NEXT_PUBLIC_SUPABASE_URL!;

const STORAGE_BUCKET = "portfolio-assets";

export function getStoragePublicUrl(path: string): string {
    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}