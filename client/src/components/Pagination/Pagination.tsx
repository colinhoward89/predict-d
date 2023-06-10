import React, { FC } from 'react';
import styles from './Pagination.module.css';

const Pagination: FC<PaginationProps> = ({ fixturesPerPage, totalFixtures, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalFixtures / fixturesPerPage);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const handlePrevious = () => {
    if (hasPrevious) {
      paginate(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      paginate(currentPage + 1);
    }
  };

  return (
    <div className={styles.pagination}>
      <button className={hasPrevious ? '' : 'disabled'} onClick={handlePrevious} disabled={!hasPrevious}>
        Previous
      </button>
      <button className={hasNext ? '' : 'disabled'} onClick={handleNext} disabled={!hasNext}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
