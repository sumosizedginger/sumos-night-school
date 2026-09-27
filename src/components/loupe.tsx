import { useRef, useState } from "react";

export function ArtLoupe({ src, alt }: { src: string; alt: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const [glass, setGlass] = useState<{ x: number; y: number; bgX: number; bgY: number } | null>(null);

  function place(clientX: number, clientY: number) {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(rect.width, Math.max(0, clientX - rect.left));
    const y = Math.min(rect.height, Math.max(0, clientY - rect.top));
    setGlass({
      x: x - 78,
      y: y - 78,
      bgX: (x / rect.width) * 100,
      bgY: (y / rect.height) * 100,
    });
  }

  return (
    <div
      ref={frame}
      className="loupe-plate"
      onMouseMove={(event) => place(event.clientX, event.clientY)}
      onMouseLeave={() => setGlass(null)}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        if (touch) place(touch.clientX, touch.clientY);
      }}
      onTouchMove={(event) => {
        const touch = event.touches[0];
        if (touch) place(touch.clientX, touch.clientY);
      }}
      onTouchEnd={() => setGlass(null)}
    >
      <img src={src} alt={alt} className="block w-full" draggable={false} />
      {glass ? (
        <span
          className="loupe-glass"
          style={{
            left: glass.x,
            top: glass.y,
            backgroundImage: `url(${src})`,
            backgroundSize: "280%",
            backgroundPosition: `${glass.bgX}% ${glass.bgY}%`,
          }}
        />
      ) : null}
      <p className="loupe-hint">Move across the picture. The glass stays on the plate.</p>
    </div>
  );
}
