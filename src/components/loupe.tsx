import { useRef, useState } from "react";

export function ArtLoupe({ src, alt }: { src: string; alt: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const [glass, setGlass] = useState<{ x: number; y: number; bgX: number; bgY: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const fine = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  return (
    <div>
      <div
        ref={frame}
        className="relative overflow-hidden rounded-card"
        onMouseMove={(event) => {
          if (!fine || !frame.current) return;
          const rect = frame.current.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          setGlass({
            x: x - 72,
            y: y - 72,
            bgX: (x / rect.width) * 100,
            bgY: (y / rect.height) * 100,
          });
        }}
        onMouseLeave={() => setGlass(null)}
      >
        <img src={src} alt={alt} className="block w-full" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }} />
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
      </div>
      <label className="mt-3 block text-sm text-muted">
        Examine the picture
        <input
          className="mt-2 block w-full"
          type="range"
          min={1}
          max={2.4}
          step={0.1}
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
        />
      </label>
    </div>
  );
}
