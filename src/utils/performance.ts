
/**
 * Performance monitoring utilities for the application
 */

// Simple performance metrics store
interface PerformanceMetrics {
  navigationStart: number;
  loadComplete: number;
  firstContentfulPaint?: number;
  timeToInteractive?: number;
  resourceLoadTimes: Record<string, number>;
  componentRenderTimes: Record<string, number[]>;
}

// Initialize metrics object
const metrics: PerformanceMetrics = {
  navigationStart: Date.now(),
  loadComplete: 0,
  resourceLoadTimes: {},
  componentRenderTimes: {},
};

/**
 * Records the initial page load time
 */
export const recordPageLoad = (): void => {
  metrics.loadComplete = Date.now();
  
  const loadTime = metrics.loadComplete - metrics.navigationStart;
  console.log(`[Performance] Page loaded in ${loadTime}ms`);
  
  // In a production app, you might send this to an analytics service
  if (loadTime > 3000) {
    console.warn('[Performance] Page load time exceeded 3 seconds');
  }
};

/**
 * Records the rendering time of a component
 * @param componentName Name of the component being rendered
 * @param startTime Start time of render
 */
export const recordComponentRender = (componentName: string, startTime: number): void => {
  const renderTime = Date.now() - startTime;
  
  if (!metrics.componentRenderTimes[componentName]) {
    metrics.componentRenderTimes[componentName] = [];
  }
  
  metrics.componentRenderTimes[componentName].push(renderTime);
  
  // Log slow renders
  if (renderTime > 100) {
    console.warn(`[Performance] Slow render for ${componentName}: ${renderTime}ms`);
  }
};

/**
 * Records the loading time of a resource
 * @param resourceName Name of the resource being loaded
 * @param startTime Start time of load
 */
export const recordResourceLoad = (resourceName: string, startTime: number): void => {
  const loadTime = Date.now() - startTime;
  metrics.resourceLoadTimes[resourceName] = loadTime;
  
  // Log slow resource loads
  if (loadTime > 1000) {
    console.warn(`[Performance] Slow resource load for ${resourceName}: ${loadTime}ms`);
  }
};

/**
 * Creates a performance monitoring HOC for React components
 * @param Component Component to wrap with performance monitoring
 * @param componentName Name to use for the component in metrics
 * @returns Wrapped component with performance monitoring
 */
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.FC<P> => {
  const WithPerformance: React.FC<P> = (props) => {
    const startTime = Date.now();
    
    // Use an effect to record render time
    React.useEffect(() => {
      recordComponentRender(componentName, startTime);
    }, []);
    
    return <Component {...props} />;
  };
  
  WithPerformance.displayName = `WithPerformance(${componentName})`;
  return WithPerformance;
};

/**
 * Returns all collected performance metrics
 * @returns Current performance metrics
 */
export const getPerformanceMetrics = (): PerformanceMetrics => {
  return { ...metrics };
};

/**
 * Reset performance metrics
 */
export const resetPerformanceMetrics = (): void => {
  metrics.navigationStart = Date.now();
  metrics.loadComplete = 0;
  metrics.resourceLoadTimes = {};
  metrics.componentRenderTimes = {};
};

// Initialize performance monitoring on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', recordPageLoad);
}
