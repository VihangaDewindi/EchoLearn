import React from "react";
import { getTagStyles, getAccessibilityStyles } from "@/lib/utils";

type Course = {
  _id: string;
  title?: string;
  description?: string;
  rating?: number;
  progress?: number;
  tag?: string;
  image?: string;
  accessibilityRating?: number;
};

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition group">
      {/* HEADER IMAGE */}
      <div className="h-40 relative overflow-hidden">
        <img
          src={course.image || "/science.jpg"}
          alt={course.title || "course"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span className={`absolute top-2 left-2 text-[10px] font-bold tracking-wider text-white px-2 py-1 rounded uppercase shadow-sm ${getTagStyles(course.tag)}`}>
          {course.tag || "COURSE"}
        </span>

        {course.rating && (
          <span className="absolute top-2 right-2 text-[10px] bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
            ⭐ {course.rating}
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-sm line-clamp-1">
          {course.title}
        </h3>

        <p className="text-xs text-gray-500 mt-2 line-clamp-2 min-h-[2.5rem]">
          {course.description}
        </p>

        {/* ACCESSIBILITY BOX */}
        <div className={`mt-3 border text-[10px] px-3 py-2 rounded-xl flex flex-col gap-0.5 ${getAccessibilityStyles(course.accessibilityRating)}`}>
          <span className="opacity-80 font-medium">ACCESSIBILITY RATING</span>
          <span className="font-bold text-xs">
            {course.accessibilityRating && course.accessibilityRating >= 95 
              ? "Excellent" 
              : course.accessibilityRating && course.accessibilityRating >= 85 
                ? "Good" 
                : "Average"} ({course.accessibilityRating || 0}/100)
          </span>
        </div>

        {/* PROGRESS */}
        <div className="mt-4 flex flex-col gap-1.5">
          <div className="flex justify-between text-[10px] font-medium text-gray-400">
             <span>PROGRESS</span>
             <span>{course.progress ?? 0}%</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${getTagStyles(course.tag).split(" ")[0]}`}
              style={{ width: `${course.progress ?? 0}%` }}
            />
          </div>
        </div>

        <button className={`mt-5 w-full text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all hover:brightness-110 active:scale-[0.98] ${getTagStyles(course.tag).split(" ")[0]}`}>
          {(course.progress ?? 0) > 0 ? "Continue Lesson" : "Start Lesson"}
        </button>
      </div>
    </div>
  );
}
