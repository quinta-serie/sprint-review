/// <reference types="vite/client" />



interface ImportMetaEnv {
    readonly VITE_VERSION: string;
    readonly VITE_GANDALF_API: string;
    readonly VITE_ACCOUNT_API: string;
    readonly VITE_TRACKER_URL: string;
    readonly VITE_PORTAL_URL: string;
    readonly VITE_MY_ACCOUNT_API: string;
    readonly VITE_GLOSSARY_API: string;
    readonly VITE_ZAP_LDP: string;
    readonly VITE_VIVAREAL_LDP: string;
    readonly VITE_NEGOTIATION_URL: string;
    readonly VITE_ONLINE_SALE: string;
    readonly VITE_ACCOUNT_OLD: string;
    readonly VITE_HELP_URL: string;
    readonly VITE_THEME: 'vivareal' | 'zap';
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
