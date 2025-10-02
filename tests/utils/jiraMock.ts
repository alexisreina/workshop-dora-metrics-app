import type { FetchOptions } from 'ofetch';

export interface MockOAuthToken {
  accessToken: string;
  expiresIn: number;
}

export interface MockJiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
    updated: string;
  };
}

export interface MockSearchResponse {
  issues: MockJiraIssue[];
  startAt: number;
  maxResults: number;
  total: number;
}

export interface MockErrorPayload {
  errorMessages?: string[];
  errors?: Record<string, string>;
}

export const createTokenResponse = (overrides: Partial<MockOAuthToken> = {}) => ({
  access_token: overrides.accessToken ?? 'mock-access-token',
  expires_in: overrides.expiresIn ?? 3600,
  token_type: 'Bearer',
});

export const createIssue = (overrides: Partial<MockJiraIssue> = {}): MockJiraIssue => ({
  id: overrides.id ?? '10001',
  key: overrides.key ?? 'PROJ-1',
  fields: {
    summary: overrides.fields?.summary ?? 'Example summary',
    status: {
      name: overrides.fields?.status?.name ?? 'In Progress',
    },
    updated: overrides.fields?.updated ?? new Date().toISOString(),
  },
});

export const createSearchResponse = (
  overrides: Partial<MockSearchResponse> = {},
): MockSearchResponse => ({
  issues: overrides.issues ?? [createIssue()],
  startAt: overrides.startAt ?? 0,
  maxResults: overrides.maxResults ?? 50,
  total: overrides.total ?? overrides.issues?.length ?? 1,
});

export const createErrorPayload = (overrides: Partial<MockErrorPayload> = {}): MockErrorPayload => ({
  errorMessages: overrides.errorMessages ?? ['Mock Jira error'],
  errors: overrides.errors ?? {},
});

export const mockFetchOptions = (overrides: FetchOptions<'json'> = {}): FetchOptions<'json'> => ({
  method: overrides.method ?? 'GET',
  headers: {
    'Content-Type': 'application/json',
    ...(overrides.headers ?? {}),
  },
  ignoreResponseError: overrides.ignoreResponseError ?? false,
  ...overrides,
});

export const paginateIssues = (issues: MockJiraIssue[], page: number, size: number) => {
  const start = page * size;
  return issues.slice(start, start + size);
};

export const createPaginatedResponses = (
  issues: MockJiraIssue[],
  size = 50,
) => {
  const totalPages = Math.ceil(issues.length / size);
  return Array.from({ length: totalPages }).map((_, index) =>
    createSearchResponse({
      issues: paginateIssues(issues, index, size),
      startAt: index * size,
      maxResults: size,
      total: issues.length,
    }),
  );
};

