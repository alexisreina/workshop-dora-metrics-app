export default defineEventHandler(async (event) => {
  try {
    // Ensure this is a POST request
    assertMethod(event, 'POST');

    // Get the request body
    const body = await readBody(event);

    // Validate request body structure
    if (!body || typeof body !== 'object') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: {
          message: 'Invalid request body',
          code: 'INVALID_REQUEST_BODY',
          details: 'Request body must be a valid JSON object',
        },
      });
    }

    // Extract navigation state update fields
    const { currentRoute, isSidebarOpen, isMobile } = body;

    // Validate optional fields if provided
    if (currentRoute !== undefined && typeof currentRoute !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: {
          message: 'Invalid currentRoute field',
          code: 'INVALID_CURRENT_ROUTE',
          details: 'currentRoute must be a string',
        },
      });
    }

    if (isSidebarOpen !== undefined && typeof isSidebarOpen !== 'boolean') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: {
          message: 'Invalid isSidebarOpen field',
          code: 'INVALID_SIDEBAR_STATE',
          details: 'isSidebarOpen must be a boolean',
        },
      });
    }

    if (isMobile !== undefined && typeof isMobile !== 'boolean') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: {
          message: 'Invalid isMobile field',
          code: 'INVALID_MOBILE_STATE',
          details: 'isMobile must be a boolean',
        },
      });
    }

    // Use provided values or defaults
    const updatedCurrentRoute = currentRoute || '/';
    const updatedIsSidebarOpen = isSidebarOpen || false;
    const updatedIsMobile = isMobile || false;

    // Get updated navigation items based on current route
    const navigationItems = [
      {
        id: 'home',
        label: 'Welcome',
        route: '/',
        isActive: updatedCurrentRoute === '/',
        isVisible: true,
        order: 0,
      },
      {
        id: 'metrics-1',
        label: 'Metrics 1',
        route: '/metrics/1',
        isActive: updatedCurrentRoute === '/metrics/1',
        isVisible: true,
        order: 1,
      },
      {
        id: 'metrics-2',
        label: 'Metrics 2',
        route: '/metrics/2',
        isActive: updatedCurrentRoute === '/metrics/2',
        isVisible: true,
        order: 2,
      },
      {
        id: 'metrics-3',
        label: 'Metrics 3',
        route: '/metrics/3',
        isActive: updatedCurrentRoute === '/metrics/3',
        isVisible: true,
        order: 3,
      },
    ];

    // Sort by order
    navigationItems.sort((a, b) => a.order - b.order);

    // In a real application, you would save this state to a database or session
    // For now, we'll just return the updated state

    // Return updated navigation state according to API contract
    return {
      currentRoute: updatedCurrentRoute,
      isSidebarOpen: updatedIsSidebarOpen,
      isMobile: updatedIsMobile,
      navigationItems,
    };
  } catch (error) {
    // If it's already a created error, re-throw it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    // Handle unexpected errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        message: 'Failed to update navigation state',
        code: 'NAVIGATION_STATE_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
});
