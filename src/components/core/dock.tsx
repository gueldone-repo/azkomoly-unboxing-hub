import {
  createContext,
  useContext,
  useRef,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { cn } from "@/lib/utils";

type DockContextValue = {
  mouseX: MotionValue<number>;
  baseSize: number;
  magnifiedSize: number;
  distance: number;
};

const DockContext = createContext<DockContextValue | null>(null);

function useDockContext(): DockContextValue {
  const ctx = useContext(DockContext);
  if (!ctx) throw new Error("Dock components must be rendered inside <Dock>");
  return ctx;
}

export type DockProps = ComponentPropsWithoutRef<typeof motion.div> & {
  baseSize?: number;
  magnifiedSize?: number;
  distance?: number;
};

export function Dock({
  children,
  className,
  baseSize = 48,
  magnifiedSize = 72,
  distance = 150,
  ...props
}: DockProps) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

  return (
    <DockContext.Provider value={{ mouseX, baseSize, magnifiedSize, distance }}>
      <motion.div
        onMouseMove={(event: MouseEvent<HTMLDivElement>) => mouseX.set(event.clientX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        className={cn(
          "flex items-end gap-2 rounded-[28px] border border-black/10 bg-white/88 px-3 py-2 shadow-[0_18px_55px_rgba(13,13,13,0.18)] backdrop-blur-xl",
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  );
}

export type DockItemProps = ComponentPropsWithoutRef<"div">;

export function DockItem({ children, className, ...props }: DockItemProps) {
  return (
    <div className={cn("group relative flex items-end justify-center", className)} {...props}>
      {children}
    </div>
  );
}

export type DockIconProps = ComponentPropsWithoutRef<typeof motion.div> & {
  children: ReactNode;
};

export function DockIcon({ children, className, ...props }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { mouseX, baseSize, magnifiedSize, distance } = useDockContext();

  const size = useTransform(mouseX, (latest: number) => {
    if (prefersReducedMotion || !Number.isFinite(latest)) return baseSize;

    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return baseSize;

    const center = bounds.left + bounds.width / 2;
    const proximity = Math.max(0, 1 - Math.abs(latest - center) / distance);
    return baseSize + (magnifiedSize - baseSize) * proximity;
  });

  const springSize = useSpring(size, { mass: 0.12, stiffness: 220, damping: 18 });

  return (
    <motion.div
      ref={ref}
      style={{ width: springSize, height: springSize }}
      className={cn("grid shrink-0 place-items-center", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export type DockLabelProps = ComponentPropsWithoutRef<"span">;

export function DockLabel({ children, className, ...props }: DockLabelProps) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0D0D0D] px-2 py-1 font-sans text-[11px] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
