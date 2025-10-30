"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { Button } from "./Button";
import { cn } from "../utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ currentPage, totalPages, onPageChange, className }, ref) => {
    const getPageNumbers = () => {
      const delta = 2; // Сколько страниц показывать по бокам от текущей
      const range: (number | "ellipsis")[] = [];

      // Всегда показываем первую страницу
      range.push(1);

      if (currentPage - delta > 2) {
        range.push("ellipsis");
      }

      // Показываем страницы вокруг текущей
      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage + delta < totalPages - 1) {
        range.push("ellipsis");
      }

      // Всегда показываем последнюю страницу, если totalPages > 1
      if (totalPages > 1) {
        range.push(totalPages);
      }

      return range;
    };

    const pageNumbers = getPageNumbers();

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center gap-1", className)}
        role="navigation"
        aria-label="Pagination"
      >
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center text-muted-foreground"
              aria-hidden="true"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChange(page as number)}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);
Pagination.displayName = "Pagination";

export { Pagination };