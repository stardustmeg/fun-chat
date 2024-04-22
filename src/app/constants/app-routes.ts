export const APP_ROUTE = {
  About: 'about',
  Authorization: 'authorization',
  Main: 'main',
} as const;

export const NOT_FOUND_PAGE_NAME = '404';

type AppRoute = (typeof APP_ROUTE)[keyof typeof APP_ROUTE] | typeof NOT_FOUND_PAGE_NAME;

export type { AppRoute };
