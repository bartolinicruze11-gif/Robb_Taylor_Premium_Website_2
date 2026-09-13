'use client';

// Native scrolling responds immediately to mouse, touch and keyboard input.
// No permanent animation loop is needed to wrap the page content.
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
