import { Request } from 'express';

export function extractJwtFromCookie(request: Request): string | null {
  if (request.cookies && request.cookies.access_token) {
    return request.cookies.access_token as string;
  }
  return null;
}

export function extractRefreshJwtFromCookie(request: Request): string | null {
  if (request.cookies && request.cookies.refresh_token) {
    return request.cookies.refresh_token as string;
  }
  return null;
}
