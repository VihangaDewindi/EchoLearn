"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import LandingFooter from "@/components/LandingFooter";
import CourseCard from "@/components/CourseCard";
import { subjects } from "@/lib/subjects";

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

export default function SubjectDiscoveryPage() {
  const { subject } = useParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const subjectData = subjects.find(
    (s) => s.tag.toLowerCase() === (subject as string).toLowerCase()
  );

  useEffect(() => {
    if (subject) {
      setLoading(true);
      fetch(`http://localhost:5000/api/courses?tag=${subject}`)
        .then((res) => res.json())
        .then((data) => {
          setCourses(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [subject]);

  const Icon = subjectData?.icon;

  return (
    <div className="bg-[#F5F7FB] min-h-screen flex flex-col">
      <LandingNavbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* BREADCRUMB / BACK */}
          <Link
            href="/courses"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition mb-6 group"
          >
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to All Courses
          </Link>

          {/* HEADER */}
          <div className={`rounded-3xl p-8 text-white shadow-lg mb-10 bg-gradient-to-br ${subjectData?.color || "from-indigo-600 to-blue-700"}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {Icon && <Icon size={24} className="opacity-90" />}
                  <span className="text-sm font-bold tracking-widest uppercase opacity-80">
                    Subject Discovery
                  </span>
                </div>
                <h1 className="text-4xl font-bold">
                  {subjectData?.name || subject} Exploration
                </h1>
                <p className="mt-4 text-white/80 max-w-2xl text-lg">
                  Master the fundamentals and advanced concepts of {subjectData?.name || subject}.
                  Our curated curriculum is designed to help you excel in this field.
                </p>
              </div>

              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold">{courses.length}</div>
                  <div className="text-xs uppercase tracking-wider opacity-70">Courses Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {subjectData?.name} Courses
            </h2>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-gray-200 h-80 rounded-2xl" />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border shadow-sm">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-bold text-gray-800">No courses found yet</h3>
              <p className="text-gray-500 mt-2">
                We are currently expanding our {subjectData?.name} curriculum. Check back soon!
              </p>
              <Link
                href="/courses"
                className="inline-block mt-6 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition"
              >
                Explore Other Subjects
              </Link>
            </div>
          )}

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
