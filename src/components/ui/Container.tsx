import { cn } from "@/lib/cn";

/** Largura máxima consistente + padding lateral responsivo. */
export function Container({
  as: Tag = "div",
  className,
  children,
  id,
}: {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={cn("mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </Tag>
  );
}
