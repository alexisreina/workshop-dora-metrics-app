import { describe, it, expect } from 'vitest';
import { getDeploymentEvents } from '~/server/api/df/services/events.service';

describe('GET /api/df/events contract', () => {
  it('returns array of DeploymentEvent', async () => {
    const body = getDeploymentEvents({ preset: '6m' });

    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      const e = body[0];
      expect(typeof e.id).toBe('string');
      expect(typeof e.timestamp).toBe('string');
      expect(typeof e.project).toBe('string');
      expect(typeof e.repository).toBe('string');
      expect(typeof e.environment).toBe('string');
      expect(['success', 'failure']).toContain(e.status);
    }
  });
});
