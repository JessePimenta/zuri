const TESTIMONIALS = [
  '"The grain in the first video is breathtaking."\n\n— User99',
  '"I found a hidden sequence in the login page..."\n\n— S.M.',
  '"Is there a physical copy of these zines?"\n\n— Collector',
  '"Everything is blurry, just like real life."\n\n— Ghost',
];

export const StickyNote = () => (
  <div className="sticky-note">
    {TESTIMONIALS.map((text, i) => (
      <p key={i} className="font-note">
        {text.split("\n").map((line, j) => (
          <span key={j}>
            {line}
            {j < text.split("\n").length - 1 && <br />}
          </span>
        ))}
      </p>
    ))}
  </div>
);
