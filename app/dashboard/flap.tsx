"use client";

import { useEffect, useRef, useState } from "react";

const CELL_FLIP_MS = 360;
const SWAP_AT_MS = 180;

export function FlapChar({
  char,
  delay = 0,
  size = "md",
  color,
}: {
  char: string;
  delay?: number;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
}) {
  const [display, setDisplay] = useState(char);
  const [flipping, setFlipping] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (char === display) return;

    cancelRef.current?.();

    let alive = true;
    const start = window.setTimeout(() => {
      if (!alive) return;
      setFlipping(true);
      const swap = window.setTimeout(() => {
        if (!alive) return;
        setDisplay(char);
        const end = window.setTimeout(() => {
          if (!alive) return;
          setFlipping(false);
        }, CELL_FLIP_MS - SWAP_AT_MS);
        cancelRef.current = () => clearTimeout(end);
      }, SWAP_AT_MS);
      cancelRef.current = () => clearTimeout(swap);
    }, delay);
    cancelRef.current = () => clearTimeout(start);

    return () => {
      alive = false;
      cancelRef.current?.();
    };
  }, [char, display, delay]);

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { fontSize: "0.95rem", height: "1.4em", width: "0.8em" },
    md: { fontSize: "1.4rem", height: "1.45em", width: "0.85em" },
    lg: { fontSize: "2rem", height: "1.4em", width: "0.8em" },
    xl: { fontSize: "3.4rem", height: "1.3em", width: "0.78em" },
  };

  return (
    <span
      className={`flap-cell ${flipping ? "flipping" : ""}`}
      style={{
        ...sizeStyles[size],
        color: color ?? "var(--color-cream)",
      }}
    >
      <span className="flap-cell-inner">{display === " " ? " " : display}</span>
    </span>
  );
}

export function FlapText({
  value,
  length,
  size = "md",
  color,
  align = "left",
  staggerMs = 35,
}: {
  value: string;
  length: number;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  align?: "left" | "right" | "center";
  staggerMs?: number;
}) {
  const upper = value.toUpperCase();
  const truncated = upper.length > length ? upper.slice(0, length) : upper;
  const padded =
    align === "left"
      ? truncated.padEnd(length, " ")
      : align === "right"
      ? truncated.padStart(length, " ")
      : truncated.padStart(Math.floor((length + truncated.length) / 2), " ").padEnd(length, " ");

  return (
    <span className="inline-flex flex-wrap gap-0">
      {Array.from(padded).map((ch, i) => (
        <FlapChar
          key={i}
          char={ch}
          delay={i * staggerMs}
          size={size}
          color={color}
        />
      ))}
    </span>
  );
}
