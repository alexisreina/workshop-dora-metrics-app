export default defineEventHandler(async (event) => {
  try {
    // Get query parameters for filtering/pagination if needed
    const query = getQuery(event);
    const currentRoute = (query.currentRoute as string) || '/';
    const isMobile = query.isMobile === 'true' || false;

    // Mock navigation items (in a real app, this would come from a database)
    const navigationItems = [
      {
        id: 'home',
        label: 'Welcome',
        route: '/',
        isActive: currentRoute === '/',
        isVisible: true,
        order: 0,
      },
      {
        id: 'metrics-1',
        label: 'Deployment Frequency',
        route: '/metrics/1',
        isActive: currentRoute === '/metrics/1',
        isVisible: true,
        order: 1,
      },
      {
        id: 'metrics-2',
        label: 'Metrics 2',
        route: '/metrics/2',
        isActive: currentRoute === '/metrics/2',
        isVisible: true,
        order: 2,
      },
      {
        id: 'metrics-3',
        label: 'Metrics 3',
        route: '/metrics/3',
        isActive: currentRoute === '/metrics/3',
        isVisible: true,
        order: 3,
      },
    ];

    // Sort by order
    navigationItems.sort((a, b) => a.order - b.order);

    // Return navigation response according to API contract
    return {
      items: navigationItems,
      currentRoute,
      isMobile,
    };
  } catch (error) {
    // Handle errors according to API contract
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        message: 'Failed to retrieve navigation items',
        code: 'NAVIGATION_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
});
