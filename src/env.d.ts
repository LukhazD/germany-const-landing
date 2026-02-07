/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly CONTENTFUL_SPACE_ID: string;
  readonly CONTENTFUL_DELIVERY_TOKEN: string;
  readonly CONTENTFUL_PREVIEW_TOKEN: string;
  readonly MONGODB_URI: string;
  readonly JWT_SECRET: string;
  readonly ADMIN_DASHBOARD_USER: string;
  readonly ADMIN_DASHBOARD_PASSWORD: string;
  readonly S3_ENDPOINT: string;
  readonly S3_ACCESS_KEY: string;
  readonly S3_SECRET_KEY: string;
  readonly S3_BUCKET_NAME: string;
  readonly S3_REGION: string;
}

declare module "*.riv" {
  const content: any;
  export default content;
}
