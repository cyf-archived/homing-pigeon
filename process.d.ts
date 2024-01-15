declare namespace NodeJS {
  export interface ProcessEnv {
    VERCEL_GIT_COMMIT_SHA: string;
    NEXT_PUBLIC_VERCEL_ENV: string;
    NEXT_PUBLIC_GOOGLE_ID: string;
    NEXT_PUBLIC_COOKIE_BANNER_ID: string;
    NEXT_PUBLIC_GH_TOKEN: string;
    NEXT_PUBLIC_GH_REPO_OWNER: string;
    NEXT_PUBLIC_GH_REPO: string;
    DISTRIBUTION_ENV: string;
    ALIYUN_OSS_REGION: string;
    ALIYUN_OSS_ACCESS_KEY_ID: string;
    ALIYUN_OSS_ACCESS_KEY_SECRET: string;
    ALIYUN_OSS_BUCKET: string;
    ALIYUN_OSS_ENDPOINT: string;
    API_BASE_URL: string;
    ENCRYPT_KEY: string;
    ENCRYPT_IV: string;
    REQUEST_SIGN_KEY: string;
  }
}
