/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_BOOKMARKS_ADMIN_HASH?: string;
  readonly PUBLIC_LOGO_DEV_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
/// <reference path="../node_modules/@astrojs/starlight/virtual.d.ts" />
/// <reference path="../node_modules/@astrojs/starlight/virtual-internal.d.ts" />
