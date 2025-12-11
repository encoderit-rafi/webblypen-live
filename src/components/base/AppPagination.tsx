"use client";

import { type ReactNode } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useManageUrl } from "@/hooks/use-manage-url";

export interface PaginationWithLinksProps {
  page: number;
  lastPage: number;
}

export function AppPagination({ page, lastPage }: PaginationWithLinksProps) {
  const { buildUrl } = useManageUrl();

  const renderPageNumbers = () => {
    const items: ReactNode[] = [];
    const maxVisiblePages = 5;

    if (lastPage <= maxVisiblePages) {
      for (let i = 1; i <= lastPage; i++) {
        items.push(
          <PaginationItem key={`page-${i}`}>
            <PaginationLink href={buildUrl({ page: i })} isActive={page === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // First page
      items.push(
        <PaginationItem key="page-1">
          <PaginationLink href={buildUrl({ page: 1 })} isActive={page === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Ellipsis before middle range
      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Middle range
      const start = Math.max(2, page - 1);
      const end = Math.min(lastPage - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={`page-${i}`}>
            <PaginationLink href={buildUrl({ page: i })} isActive={page === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Ellipsis after middle range
      if (page < lastPage - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Last page
      items.push(
        <PaginationItem key={`page-${lastPage}`}>
          <PaginationLink
            href={buildUrl({ page: lastPage })}
            isActive={page === lastPage}
          >
            {lastPage}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <Pagination className="mt-5">
      <PaginationContent className="max-sm:gap-0">
        {/* Previous button */}
        <PaginationItem key="prev">
          <PaginationPrevious
            href={buildUrl({ page: Math.max(page - 1, 1) })}
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : undefined}
            className={
              page === 1 ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>

        {/* Page numbers */}
        {renderPageNumbers()}

        {/* Next button */}
        <PaginationItem key="next">
          <PaginationNext
            href={buildUrl({ page: Math.min(page + 1, lastPage) })}
            aria-disabled={page === lastPage}
            tabIndex={page === lastPage ? -1 : undefined}
            className={
              page === lastPage ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
