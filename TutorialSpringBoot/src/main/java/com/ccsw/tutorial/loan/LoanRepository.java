package com.ccsw.tutorial.loan;

import com.ccsw.tutorial.loan.model.Loan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.CrudRepository;

/**
 * @author marina31sanchez
 */
public interface LoanRepository extends CrudRepository<Loan, Long> {
    /**
     * Method that returns a pageable list of {@link Loan}
     *
     * @param pageable pageable
     * @return {@link Page} de {@link Loan}
     */

    @EntityGraph(attributePaths = { "game", "client", "loanDate", "returnDate" })
    Page<Loan> findAll(Specification<Loan> spec, Pageable pageable);
}
