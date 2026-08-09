import { cn } from "@/lib/utils";

export function Marquee({
  children,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  className,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [--duration:34s] [--gap:1rem]",
        vertical ? "h-full flex-col" : "w-full flex-row",
        className
      )}
    >
      {Array.from({ length: repeat }, (_, index) => (
        <div
          key={index}
          className={cn(
            "flex shrink-0 justify-around gap-[var(--gap)]",
            vertical
              ? "min-h-full flex-col animate-marquee-vertical"
              : "min-w-full flex-row animate-marquee",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
