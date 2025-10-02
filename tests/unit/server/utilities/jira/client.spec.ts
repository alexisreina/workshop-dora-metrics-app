import { describe, expect, it, beforeEach, vi } from 'vitest';

vi.mock('ofetch', () => ({
  $fetch: vi.fn(),
}));

describe('jira client (pre-implementation)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('refreshes OAuth token when near expiry', async () => {
    const { createJiraClient } = await import('../../../../server/utilities/jira/client');
    const client = createJiraClient({
      baseUrl: 'https://example.atlassian.net',
      clientId: 'id',
      clientSecret: 'secret',
      refreshIntervalMs: 300000,
      maxResults: 50,
      scopes: ['read:jira-user'],
    });

    await client.fetchActiveIssues();

    expect(true).toBe(false); // expect proper token refresh logic
  });

  it('paginates when Jira returns >50 issues', async () => {
    const { createJiraClient } = await import('../../../../server/utilities/jira/client');
    const client = createJiraClient({
      baseUrl: 'https://example.atlassian.net',
      clientId: 'id',
      clientSecret: 'secret',
      refreshIntervalMs: 300000,
      maxResults: 50,
      scopes: ['read:jira-user'],
    });

    await client.fetchActiveIssues();

    expect(true).toBe(false); // expect pagination support
  });

  it('propagates errors from Jira', async () => {
    const { createJiraClient } = await import('../../../../server/utilities/jira/client');
    const client = createJiraClient({
      baseUrl: 'https://example.atlassian.net',
      clientId: 'id',
      clientSecret: 'secret',
      refreshIntervalMs: 300000,
      maxResults: 50,
      scopes: ['read:jira-user'],
    });

    await expect(client.fetchActiveIssues()).rejects.toThrow();
  });
});

