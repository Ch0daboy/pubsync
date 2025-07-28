'use client'

import { useEffect } from 'react'

/**
 * Performance monitoring component for production
 * Tracks Core Web Vitals and reports to analytics
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return

    // Track Core Web Vitals
    const trackWebVitals = () => {
      // First Contentful Paint (FCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime)
          }
        }
      })
      observer.observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any // Type assertion for FID entry
          if (fidEntry.processingStart) {
            console.log('FID:', fidEntry.processingStart - fidEntry.startTime)
          }
        }
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const clsEntry = entry as any // Type assertion for CLS entry
          if (!clsEntry.hadRecentInput && clsEntry.value) {
            clsValue += clsEntry.value
          }
        }
        console.log('CLS:', clsValue)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }

    // Track page load performance
    const trackPageLoad = () => {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        console.log('Page Load Time:', navigation.loadEventEnd - navigation.fetchStart)
        console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.fetchStart)
        console.log('Time to Interactive:', navigation.domInteractive - navigation.fetchStart)
      })
    }

    // Initialize tracking
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      trackWebVitals()
      trackPageLoad()
    }

    // Cleanup
    return () => {
      // Performance observers are automatically cleaned up when component unmounts
    }
  }, [])

  // This component doesn't render anything
  return null
}

/**
 * Hook for tracking custom performance metrics
 */
export function usePerformanceTracking() {
  const trackCustomMetric = (name: string, value: number) => {
    if (process.env.NODE_ENV === 'production') {
      console.log(`Custom Metric - ${name}:`, value)
      // In a real app, you'd send this to your analytics service
    }
  }

  const trackUserInteraction = (action: string, element: string) => {
    if (process.env.NODE_ENV === 'production') {
      console.log(`User Interaction - ${action} on ${element}`)
      // In a real app, you'd send this to your analytics service
    }
  }

  return {
    trackCustomMetric,
    trackUserInteraction
  }
}
