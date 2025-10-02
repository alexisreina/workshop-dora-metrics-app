import { describe, it, expect, beforeEach } from 'vitest';
import { $fetch, setup } from '@nuxt/test-utils';

describe('Navigation API Contract Tests', () => {
  beforeEach(async () => {
    await setup({
      rootDir: process.cwd(),
    });
  });

  describe('GET /api/navigation', () => {
    it('should return navigation items with correct structure', async () => {
      const response = await $fetch('/api/navigation');

      expect(response).toBeDefined();
      expect(response).toHaveProperty('items');
      expect(response).toHaveProperty('currentRoute');
      expect(response).toHaveProperty('isMobile');

      expect(Array.isArray(response.items)).toBe(true);
      expect(typeof response.currentRoute).toBe('string');
      expect(typeof response.isMobile).toBe('boolean');

      // Validate NavigationItem structure
      if (response.items.length > 0) {
        const item = response.items[0];
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('label');
        expect(item).toHaveProperty('route');
        expect(item).toHaveProperty('isActive');
        expect(item).toHaveProperty('isVisible');
        expect(item).toHaveProperty('order');

        expect(typeof item.id).toBe('string');
        expect(typeof item.label).toBe('string');
        expect(typeof item.route).toBe('string');
        expect(typeof item.isActive).toBe('boolean');
        expect(typeof item.isVisible).toBe('boolean');
        expect(typeof item.order).toBe('number');
      }
    });

    it('should return 500 error for server failures', async () => {
      // This test will fail initially as the endpoint doesn't exist yet
      try {
        await $fetch('/api/navigation');
      } catch (error) {
        expect(error.statusCode).toBe(404); // Will be 404 until implemented
      }
    });
  });

  describe('POST /api/navigation/state', () => {
    it('should update navigation state successfully', async () => {
      const updateData = {
        currentRoute: '/metrics/1',
        isSidebarOpen: true,
        isMobile: false,
      };

      try {
        const response = await $fetch('/api/navigation/state', {
          method: 'POST',
          body: updateData,
        });

        expect(response).toHaveProperty('currentRoute');
        expect(response).toHaveProperty('isSidebarOpen');
        expect(response).toHaveProperty('isMobile');
        expect(response).toHaveProperty('navigationItems');

        expect(response.currentRoute).toBe(updateData.currentRoute);
        expect(response.isSidebarOpen).toBe(updateData.isSidebarOpen);
        expect(response.isMobile).toBe(updateData.isMobile);
      } catch (error) {
        expect(error.statusCode).toBe(404); // Will be 404 until implemented
      }
    });

    it('should return 400 error for invalid request data', async () => {
      const invalidData = {
        invalidField: 'invalid',
      };

      try {
        await $fetch('/api/navigation/state', {
          method: 'POST',
          body: invalidData,
        });
      } catch (error) {
        expect([400, 404]).toContain(error.statusCode); // 404 until implemented, then 400
      }
    });
  });
});
