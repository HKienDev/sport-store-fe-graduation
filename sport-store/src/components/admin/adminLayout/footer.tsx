"use client";

export default function Footer() {
  return (
    <footer className="bg-white border-t backdrop-blur-sm" style={{ minHeight: 80 }}>
      <div className="max-w-[clamp(640px,90vw,1920px)] mx-auto px-[clamp(1rem,2vw,1.5rem)] sm:px-[clamp(1.5rem,3vw,2rem)] lg:px-[clamp(2rem,4vw,3rem)] py-[clamp(1rem,2vw,1.5rem)]">
        <div className="flex items-center justify-center gap-[clamp(0.5rem,1vw,1rem)] text-[clamp(0.75rem,1.5vw,1rem)] text-gray-600">
          <span>© 2024 VJU SPORT</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}