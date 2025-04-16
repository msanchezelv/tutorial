package com.ccsw.tutorial.loan;

import com.ccsw.tutorial.game.GameAlredyLoanedException;
import com.ccsw.tutorial.loan.model.Loan;
import com.ccsw.tutorial.loan.model.LoanDto;
import com.ccsw.tutorial.loan.model.LoanSearchDto;
import org.springframework.data.domain.Page;

import java.time.LocalDate;

/**
 * @author marina31sanchez
 */
public interface LoanService {

    Loan get(Long id);

    /**
     * Method to create or update a {@link Loan}
     *
     * @param dto entity's data
     */
    void save(LoanDto dto) throws GameAlredyLoanedException;

    /**
     * Method to delete a {@link Loan}
     *
     * @param id entity's data
     */
    void delete(Long id) throws Exception;

    /**
     * Recupera los {@link Loan} filtrando opcionalmente por juego y/o cliente
     *
     * @param idGame   juego que ha sido prestado
     * @param idClient cliente que ha cogido prestado el juego
     * @param date     fecha
     * @return {@link Loan}
     */
    Page<Loan> findPagedAndFiltered(Long idGame, Long idClient, LocalDate date, LoanSearchDto loanSearchDto);

}
