"use client";

import { Mic } from "lucide-react";

export default function VoiceAssistantButton() {
  const handleVoiceClick = () => {
    alert("Voice assistant activated!");
  };

  return (
    <button
      onClick={handleVoiceClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#2D3E75] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#1e2a52] transition"
    >
      <Mic size={26} />
    </button>
  );
}
