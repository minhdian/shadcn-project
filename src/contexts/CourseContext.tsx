import React, { createContext, useContext, useEffect, useState } from 'react';

// Interface cho API response
interface MediaFile {
  type: 'file';
  name: string;
  url: string;
}

interface MediaFolder {
  type: 'folder';
  name: string;
  children: (MediaFile | MediaFolder)[];
}

// Interface cho course data đã transform
interface Lesson {
  id: number;
  title: string;
  type: 'video';
  url: string;
  subtitle?: string;
}

interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  image: string;
  description: string;
  chapters: Chapter[];
}

interface CourseData {
  courses: Course[];
}

interface CourseContextType {
  courseData: CourseData;
  loading: boolean;
  error: string | null;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const API_URL = 'https://wordpress-media-api.test/wp-json/media-api/v1/files';

// Fallback data trong trường hợp API không hoạt động
const FALLBACK_COURSE_DATA: CourseData = {
  courses: [
    {
      id: 1,
      title: 'English for Beginners',
      image: 'https://example.com/images/basic-english.jpg',
      description: 'Khóa học dành cho người mới bắt đầu học tiếng Anh.',
      chapters: [{
        id: 1,
        title: 'Basic Lessons',
        lessons: [
          {
            id: 1,
            title: 'Greetings',
            type: 'video',
            url: 'https://wordpress-media-api.test/wp-content/uploads/filester/courses/sample-5s.mp4',
            subtitle: 'https://wordpress-media-api.test/wp-content/uploads/filester/courses/01-basic-english/lesson-01-greetings.srt'
          }
        ]
      }]
    }
  ]
};

// Function để transform API data thành course format
function transformApiToCourseData(apiData: any): CourseData {
  console.log('🔄 API Response received:', apiData);
  
  // Kiểm tra xem apiData có phải là object không
  if (!apiData || typeof apiData !== 'object') {
    console.warn('⚠️ API data is not an object:', apiData);
    return { courses: [] };
  }

  // Kiểm tra xem có children không
  if (!apiData.children || !Array.isArray(apiData.children)) {
    console.warn('⚠️ API data.children is not an array:', apiData.children);
    return { courses: [] };
  }

  const coursesFolder = apiData.children.find((child: any) => child && child.name === 'courses');
  
  if (!coursesFolder || coursesFolder.type !== 'folder') {
    console.warn('⚠️ Courses folder not found or invalid:', coursesFolder);
    return { courses: [] };
  }

  // Kiểm tra coursesFolder.children
  if (!coursesFolder.children || !Array.isArray(coursesFolder.children)) {
    console.warn('⚠️ Courses folder children is not an array:', coursesFolder.children);
    return { courses: [] };
  }

  console.log('✅ Found courses folder with children:', coursesFolder.children.length);

  const courses: Course[] = coursesFolder.children
    .filter((folder: any): folder is MediaFolder => folder && folder.type === 'folder')
    .map((courseFolder: MediaFolder, courseIndex: number) => {
      // Extract course info from folder name
      const courseName = courseFolder.name;
      let title = '';
      let description = '';
      
      switch (courseName) {
        case '01-basic-english':
          title = 'English for Beginners';
          description = 'Khóa học dành cho người mới bắt đầu học tiếng Anh.';
          break;
        case '02-intermediate-english':
          title = 'Intermediate English';
          description = 'Khóa học tiếng Anh trình độ trung cấp.';
          break;
        case '03-advanced-english':
          title = 'Advanced English';
          description = 'Khóa học tiếng Anh trình độ cao cấp.';
          break;
        case '04-business-english':
          title = 'Business English';
          description = 'Khóa học tiếng Anh thương mại.';
          break;
        case '05-ielts-preparation':
          title = 'IELTS Preparation';
          description = 'Khóa học luyện thi IELTS.';
          break;
        case '06-english':
          title = 'General English Course';
          description = 'Khóa học tiếng Anh tổng quát.';
          break;
        default:
          title = courseName.replace(/^\d+-/, '').replace(/-/g, ' ');
          title = title.charAt(0).toUpperCase() + title.slice(1);
          description = `Khóa học ${title}`;
      }

      // Group files into lessons
      const files = courseFolder.children.filter((item): item is MediaFile => item.type === 'file');
      const lessons: Lesson[] = [];
      
      console.log(`📁 Processing course: ${courseName}, found ${files.length} files:`, files.map(f => f.name));
      
      // Group by lesson number (extract from filename)
      const lessonGroups: { [key: string]: { video?: string; subtitle?: string; title?: string } } = {};
      
      files.forEach(file => {
        // Support nhiều format: 
        // - "lesson-01-title.mp4" 
        // - "lesson1.mp4"
        // - "lesson01.mp4" 
        let match = file.name.match(/^lesson-?0?(\d+)(?:-(.+))?\.(mp4|srt)$/i);
        
        if (match) {
          const lessonNum = match[1].padStart(2, '0'); // Ensure 2-digit format for consistency
          const titlePart = match[2];
          const extension = match[3].toLowerCase();
          
          console.log(`🔍 Matched file: ${file.name} → lesson ${lessonNum}, title: ${titlePart || 'none'}, ext: ${extension}`);
          
          if (!lessonGroups[lessonNum]) {
            lessonGroups[lessonNum] = {};
          }
          
          if (extension === 'mp4') {
            lessonGroups[lessonNum].video = file.url;
          } else if (extension === 'srt') {
            lessonGroups[lessonNum].subtitle = file.url;
            if (titlePart) {
              lessonGroups[lessonNum].title = titlePart.replace(/-/g, ' ');
            }
          }
        } else {
          console.warn('⚠️ File does not match lesson pattern:', file.name);
        }
      });

      console.log(`📚 Course: ${courseName}, lessonGroups:`, lessonGroups);

      // Convert to lessons array
      Object.entries(lessonGroups).forEach(([lessonNum, lessonData], index) => {
        if (lessonData.video) {
          lessons.push({
            id: index + 1,
            title: lessonData.title ? 
              lessonData.title.charAt(0).toUpperCase() + lessonData.title.slice(1) : 
              `Lesson ${lessonNum}`,
            type: 'video',
            url: lessonData.video,
            subtitle: lessonData.subtitle
          });
        }
      });

      // Sort lessons by lesson number
      lessons.sort((a, b) => {
        const aNum = parseInt(a.title.match(/\d+/)?.[0] || '0');
        const bNum = parseInt(b.title.match(/\d+/)?.[0] || '0');
        return aNum - bNum;
      });

      console.log(`✅ Course: ${courseName}, final lessons (${lessons.length}):`, lessons.map(l => ({ id: l.id, title: l.title, hasSubtitle: !!l.subtitle })));

      return {
        id: courseIndex + 1,
        title,
        image: `https://example.com/images/${courseName}.jpg`,
        description,
        chapters: [{
          id: 1,
          title: 'Main Course',
          lessons
        }]
      };
    });

  return { courses };
}

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [courseData, setCourseData] = useState<CourseData>({ courses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        setLoading(true);
        console.log('🌐 [CourseProvider] Fetching course data from:', API_URL);
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiData = await response.json();
        console.log('📡 [CourseProvider] Raw API response:', apiData);
        
        // Kiểm tra response trước khi transform
        if (!apiData) {
          throw new Error('API returned null or undefined');
        }
        
        const transformedData = transformApiToCourseData(apiData);
        console.log('🔄 [CourseProvider] Transformed data:', transformedData);
        
        setCourseData(transformedData);
        setError(null);
      } catch (err) {
        console.error('❌ [CourseProvider] Error fetching course data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch course data');
        
        // Sử dụng fallback data thay vì empty data
        console.log('🔄 [CourseProvider] Using fallback course data');
        setCourseData(FALLBACK_COURSE_DATA);
      } finally {
        setLoading(false);
      }
    }

    fetchCourseData();
  }, []); // Chỉ gọi một lần khi provider mount

  return (
    <CourseContext.Provider value={{ courseData, loading, error }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourseContext() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
}

export type { Course, Chapter, Lesson, CourseData };
