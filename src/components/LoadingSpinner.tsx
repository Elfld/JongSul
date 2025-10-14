// components/LoadingSpinner.tsx
'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-sky-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-sky-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
}