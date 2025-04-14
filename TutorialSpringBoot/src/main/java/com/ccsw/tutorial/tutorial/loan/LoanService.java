package com.ccsw.tutorial.tutorial.loan;

import com.ccsw.tutorial.tutorial.loan.model.Loan;
import com.ccsw.tutorial.tutorial.loan.model.LoanDto;
import com.ccsw.tutorial.tutorial.loan.model.LoanSearchDto;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

/**
 * @author marina31sanchez
 */
public interface LoanService {

    /**
     * Returns a {@link Loan} by Getting its ID
     *
     * @param id PK de la entidad
     * @return {@link Loan}
     */
    Loan get(Long id);

    //    /**
    //     * Method to return a Pageable list of {@link Loan}
    //     * @param dto dto de búsqueda
    //     * @return {@link Page} de {@link Loan}
    //     */
    //    Page<Loan> findPage(LoanSearchDto dto);

    /**
     *Method to create or update a {@link Loan}
     *
     * @param id entity's PK
     * @param dto entity's data
     */
    public void save(Long id, LoanDto dto);

    /**
     * Method to delete a {@link Loan}
     * Throws an {@link Exception} when not found
     *
     * @param id
     */
    public void delete(Long id) throws Exception;

    /**
     *Method that returns a list of {@link Loan}
     * @return
     */
    public List<Loan> findAll();

    Page<Loan> findPagedAndFiltered(Long idGame, Long idClient, LocalDate date, LoanSearchDto loanSearchDto);

}
