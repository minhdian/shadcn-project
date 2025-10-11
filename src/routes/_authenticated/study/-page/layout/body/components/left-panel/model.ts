export interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}
export interface Lesson {
  id: number;
  title: string;
  type: "video" | "audio";
  url: string;
  subtitle: string;
}
