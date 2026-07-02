import { HttpErrorResponse } from '@angular/common/http';

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  const body = error.error as
    | {
        detail?: unknown;
        message?: unknown;
        errors?: Record<string, unknown>;
      }
    | string
    | null
    | undefined;

  if (typeof body === 'string') {
    return body;
  }

  if (!body) {
    return fallback;
  }

  if (body.errors) {
    const firstError = Object.values(body.errors)[0];

    if (Array.isArray(firstError) && typeof firstError[0] === 'string') {
      return firstError[0];
    }

    if (typeof firstError === 'string') {
      return firstError;
    }
  }

  if (typeof body.detail === 'string') {
    return body.detail;
  }

  if (typeof body.message === 'string') {
    return body.message;
  }

  return fallback;
}
