import { env } from "../../lib/env";
import { supabase } from "../../lib/supabase";

import { SupabaseStorageAdapter } from "./providers/supabase/supabase-storage.adapter";
import type { StorageProvider } from "./storage.interface";

function createStorageProvider(): StorageProvider {
    switch (env.ASSET_STORAGE_PROVIDER) {
        case "supabase":
            return new SupabaseStorageAdapter(
                supabase,
                env.SUPABASE_STORAGE_BUCKET,
            );

        default:
            throw new Error(
                `Unsupported asset storage provider: ${env.ASSET_STORAGE_PROVIDER}`,
            );
    }
}

export const storageProvider = createStorageProvider();