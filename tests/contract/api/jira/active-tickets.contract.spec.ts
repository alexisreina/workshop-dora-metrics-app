import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const rootDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(rootDir, '../../../..');
const specPath = resolve(projectRoot, 'specs/001-i-wish-to/contracts/active-tickets.openapi.json');

describe('GET /api/jira/active-tickets contract', () => {
  it('has a valid OpenAPI contract definition', () => {
    const raw = readFileSync(specPath, 'utf-8');
    const apiSpec = JSON.parse(raw);

    expect(apiSpec).toHaveProperty('openapi');
    expect(apiSpec.paths['/api/jira/active-tickets']).toBeDefined();
    expect(apiSpec.components?.schemas?.JiraTicketListResult).toBeDefined();
  });

  it('fails to reach the active tickets endpoint before implementation', async () => {
    await expect(fetch('http://localhost:3000/api/jira/active-tickets')).rejects.toThrow();
  });
});

