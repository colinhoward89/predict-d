import { FC } from 'react';
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
      <button
        className={hasPrevious ? styles.button : `${styles.button} ${styles.disabled}`}
        onClick={handlePrevious}
        disabled={!hasPrevious}
        aria-label="Previous"
      >
        Previous
      </button>
      <button
        className={hasNext ? styles.button : `${styles.button} ${styles.disabled}`}
        onClick={handleNext}
        disabled={!hasNext}
        aria-label="Next"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;