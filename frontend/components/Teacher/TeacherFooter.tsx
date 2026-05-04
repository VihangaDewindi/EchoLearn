import React from 'react';
import Link from 'next/link';

export default function TeacherFooter() {
  return (
    <footer className="bg-white border-t border-[#E5E9F0] py-10 px-8 mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-[#8793AC]">
                © 2024 EchoLearn Education Platforms. All rights reserved.
            </span>
        </div>

        <div className="flex items-center gap-10">
          <Link href="/privacy" className="text-[13px] font-bold text-[#8793AC] hover:text-[#33478D] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-[13px] font-bold text-[#8793AC] hover:text-[#33478D] transition-colors">
            Terms of Service
          </Link>
          <Link href="/support" className="text-[13px] font-bold text-[#8793AC] hover:text-[#33478D] transition-colors">
            Support Center
          </Link>
        </div>

      </div>
    </footer>
  );
}
