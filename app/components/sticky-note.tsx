"use client";

interface StickyNoteProps {
  comments: { body: string }[];
}

const CYCLE_DURATION = 16;
const SEGMENT = CYCLE_DURATION / 4;

export const StickyNote = ({ comments }: StickyNoteProps) => {
  const fallback = ['"Leave a comment..."'];
  const items = comments.length > 0 ? comments.map((c) => c.body) : fallback;

  return (
    <div className="sticky-note">
      {items.map((text, i) => (
        <p
          key={i}
          className="font-note"
          style={{ animationDelay: `${i * (CYCLE_DURATION / items.length)}s` }}
        >
          {text}
        </p>
      ))}
    </div>
  );
};
