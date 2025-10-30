"use client";

import { useSearchParams, usePathname } from "next/navigation";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export function SearchPagination({currentPage, totalPages}: {currentPage: number, totalPages: number}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    function getPageLink(pageNum: number) {
        const clampedPageNum = Math.max(1, Math.min(pageNum, totalPages));
        const params = new URLSearchParams(searchParams);
        params.set("page", clampedPageNum.toString());
        return `${pathname}?${params.toString()}`;
    }

    function generatePagination (currentPage: number, totalPages: number) {
        // If the total number of pages is 7 or less, display all pages without any ellipsis.
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // If the current page is among the first 3 pages,
        // show the first 3, an ellipsis, and the last 2 pages.
        if (currentPage <= 3) {
            return [1, 2, 3, '...', totalPages - 1, totalPages];
        }

        // If the current page is among the last 3 pages,
        // show the first 2, an ellipsis, and the last 3 pages.
        if (currentPage >= totalPages - 2) {
            return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
        }

        // If the current page is somewhere in the middle,
        // show the first page, an ellipsis, the current page and its neighbors,
        // another ellipsis, and the last page.
        return [
            1,
            '...',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            '...',
            totalPages,
        ];
    };

    function getPaginationItems(): Array<React.ReactElement<typeof PaginationItem>> {
        const paginationItems: Array<React.ReactElement<typeof PaginationItem>> = [];
        generatePagination(currentPage, totalPages).map((page, index) => {
            if (page === '...') {
                paginationItems.push(
                    <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            } else {
                paginationItems.push(
                    <PaginationItem key={page}>
                        <PaginationLink
                            href={getPageLink(Number(page))}
                            isActive={page === currentPage}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        });

        return paginationItems;
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href={getPageLink(currentPage - 1)} />
                </PaginationItem>
                {getPaginationItems().map((item) => item)}
                <PaginationItem>
                    <PaginationNext href={getPageLink(currentPage + 1)} />
                </PaginationItem>
            </PaginationContent>
    </Pagination>
  )
}
