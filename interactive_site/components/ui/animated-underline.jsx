"use client";

export default function AnimatedUnderline({ label, active = false, onClick }) {
  return (
    <button
      type="button"
      className={`animated-underline ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span>{label}</span>
    </button>
  );
}
