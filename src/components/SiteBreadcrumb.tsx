import { Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type SiteBreadcrumbTrail = { name: string; path?: string }[];

/**
 * Breadcrumb visible, discreto, para complementar el `breadcrumbSchema` (JSON-LD,
 * invisible) que ya existe en `seo.ts`. Sin esto Google sólo veía la jerarquía en
 * el schema — nunca en el DOM — y no había enlazado interno real hacia arriba.
 * Último ítem del trail sin `path` = página actual (no clickeable).
 */
export function SiteBreadcrumb({ trail }: { trail: SiteBreadcrumbTrail }) {
  return (
    <Breadcrumb className="px-6 pt-6 sm:pt-8">
      <BreadcrumbList className="mx-auto max-w-3xl font-sans text-xs text-foreground/50">
        {trail.map((item, i) => (
          <div key={item.name} className="flex items-center gap-1.5 sm:gap-2.5">
            <BreadcrumbItem>
              {item.path ? (
                <BreadcrumbLink asChild>
                  <Link to={item.path} className="hover:text-fire">
                    {item.name}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-foreground/70">{item.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {i < trail.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
