import { useMemo } from 'react';
import '../styles/Pagination.scss';

const usePagination = ({
    totalCount,
    pageSize,
    siblingCount = 1,
    currentPage
}) => {

    const range = (start, end) => {
        return Array.from({ length: end - start + 1 }, (_, index) => index + start);
    };

    const paginationRange = useMemo(() => {

        const totalPageCount = Math.ceil(totalCount / pageSize);

        // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
        const totalPageNumbers = siblingCount + 5;


        // Case 1: If the number of pages is less than the page numbers we want to show in our paginationComponent, we return the range [1..totalPageCount]

        if (totalPageNumbers >= totalPageCount) {
            return range(1, totalPageCount);
        }


        //   Calculate left and right sibling index and make sure they are within range 1 and totalPageCount

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(
            currentPage + siblingCount,
            totalPageCount
        );


        // We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex <= totalPageCount - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;


        //  Case 2: No left dots to show, but rights dots to be shown

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 2 + 2 * siblingCount;
            let leftRange = range(1, leftItemCount);

            return [...leftRange, '...', totalPageCount];
        }


        // Case 3: No right dots to show, but left dots to be shown

        if (shouldShowLeftDots && !shouldShowRightDots) {

            let rightItemCount = 2 + 2 * siblingCount;
            let rightRange = range(
                totalPageCount - rightItemCount + 1,
                totalPageCount
            );
            return [firstPageIndex, '...', ...rightRange];
        }


        // Case 4: Both left and right dots to be shown

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
        }

    }, [totalCount, pageSize, siblingCount, currentPage]);

    return paginationRange || [];
};

const Pagination = props => {
    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize,
    } = props;

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    // If there are less than 2 times in pagination range we shall not render the component
    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];
    return (
        <ul className={'pagination-container'}>
            {/* Left navigation arrow */}
            <li
                className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={onPrevious}
            >
                <div className="arrow left" />
            </li>

            {/* pageNumber */}
            {paginationRange.map(pageNumber => {

                if (pageNumber === '...') {
                    return (
                        <li
                            key={pageNumber}
                            className="pagination-item dots"
                        >
                            &#8230;
                        </li>
                    );
                }

                return (
                    <li
                        key={pageNumber}
                        className={`pagination-item ${pageNumber === currentPage ? 'selected' : ''}`}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </li>
                );
            })}

            {/*  Right Navigation arrow */}
            <li
                className={`pagination-item ${currentPage === lastPage ? 'disabled' : ''}`}
                onClick={onNext}
            >
                <div className="arrow right" />
            </li>
        </ul>
    );
};

export default Pagination;