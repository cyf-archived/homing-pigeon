declare namespace NodeJS {
  export interface ProcessEnv {
    VERCEL_GIT_COMMIT_SHA: string;
    NEXT_PUBLIC_VERCEL_ENV: string;
    NEXT_PUBLIC_GOOGLE_ID: string;
    NEXT_PUBLIC_GH_TOKEN: string;
    NEXT_PUBLIC_GH_REPO_OWNER: string;
    NEXT_PUBLIC_GH_REPO: string;
    NEXT_PUBLIC_COOKIE_BANNER_ID: string;
    NEXT_PUBLIC_ENV: string;
    POSTGRES_PRISMA_URL: string;
    POSTGRES_URL_NON_POOLING: string;
  }
}
