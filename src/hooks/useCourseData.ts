import { useCourseContext } from '../contexts/CourseContext';

// Re-export types for backward compatibility
export type { Course, Chapter, Lesson, CourseData } from '../contexts/CourseContext';

// Hook wrapper để maintain backward compatibility
export function useCourseData() {
  console.log('🔗 [useCourseData] Using CourseContext');
  return useCourseContext();
}
