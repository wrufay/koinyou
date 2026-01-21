"use client";

import { useEffect, useState } from "react";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: "leaf" | "star" | "dot";
}

export default function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Generate random floating elements
    const generated: FloatingElement[] = [];
    const types: ("leaf" | "star" | "dot")[] = ["leaf", "star", "dot"];

    for (let i = 0; i < 30; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 12 + Math.random() * 20,
        duration: 20 + Math.random() * 25,
        delay: Math.random() * -15,
        type: types[Math.floor(Math.random() * types.length)],
      });
    }
    setElements(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute animate-float-drift"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            animationDuration: `${el.duration}s`,
            animationDelay: `${el.delay}s`,
          }}
        >
          {el.type === "leaf" && (
            <svg
              width={el.size}
              height={el.size}
              viewBox="0 0 24 24"
              className="text-pine/40"
              fill="currentColor"
            >
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          )}
          {el.type === "star" && (
            <svg
              width={el.size * 0.8}
              height={el.size * 0.8}
              viewBox="0 0 24 24"
              className="text-cream/70"
              fill="currentColor"
            >
              <path d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z" />
            </svg>
          )}
          {el.type === "dot" && (
            <div
              className="rounded-full bg-white/30"
              style={{ width: el.size * 0.5, height: el.size * 0.5 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
