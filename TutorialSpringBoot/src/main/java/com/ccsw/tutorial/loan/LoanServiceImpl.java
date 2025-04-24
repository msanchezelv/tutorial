package com.ccsw.tutorial.loan;

import com.ccsw.tutorial.client.ClientService;
import com.ccsw.tutorial.common.criteria.SearchCriteria;
import com.ccsw.tutorial.game.GameAlredyLoanedException;
import com.ccsw.tutorial.game.GameService;
import com.ccsw.tutorial.loan.model.Loan;
import com.ccsw.tutorial.loan.model.LoanDto;
import com.ccsw.tutorial.loan.model.LoanSearchDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


/**
 * @author marina31sanchez
 */
@Service
@Transactional
public class LoanServiceImpl implements LoanService {

    @Autowired
    LoanRepository loanRepository;

    @Autowired
    ClientService clientService;

    @Autowired
    GameService gameService;

    /**
     * {@inheritDoc}
     */
    @Override
    public Loan get(Long id) {
        return this.loanRepository.findById(id).orElse(null);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void save(LoanDto dto) throws GameAlredyLoanedException {
        Loan loan = new Loan();

        BeanUtils.copyProperties(dto, loan, "id", "client", "game");

        if (dto.getReturnDate().isBefore(dto.getLoanDate())) {
            throw new GameAlredyLoanedException("La fecha de finalización del préstamos no puede ser anterior a la fecha de inicio");
        }

        if (gameAlreadyLoanedInDates(dto.getGame().getId(), dto.getLoanDate(), dto.getReturnDate())) {
            throw new GameAlredyLoanedException("Este juego ya ha sido prestado para las fechas seleccionadas");
        }

        if (clientAlreadyHasGameLoaned(dto.getClient().getId(), dto.getLoanDate(), dto.getReturnDate())) {
            throw new GameAlredyLoanedException("Este cliente ya dispone de un préstamo para las fechas seleccionadas");
        }

        loan.setGame(gameService.getGameById(dto.getGame().getId()));

        loan.setClient(clientService.getClientById(dto.getClient().getId()));

        this.loanRepository.save(loan);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void delete(Long id) throws Exception {
        if (this.get(id) == null) {
            throw new Exception("Error");
        }

        this.loanRepository.deleteById(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Page<Loan> findPagedAndFiltered(Long idGame, Long idClient, LocalDate date, LoanSearchDto loanSearchDto) {
        Pageable pageable = loanSearchDto.getPageable().getPageable();

        Specification<Loan> specification = Specification.where(null);

        if (idGame != null) {
            LoanSpecification titleSpec = new LoanSpecification(new SearchCriteria("game.id", ":", idGame));
            specification = specification.and(titleSpec);
        }

        if (idClient != null) {
            LoanSpecification clientSpec = new LoanSpecification(new SearchCriteria("client.id", ":", idClient));
            specification = specification.and(clientSpec);
        }

        if (date != null) {
            LoanSpecification dateSpec = new LoanSpecification(new SearchCriteria("loanDate", ":", date));
            specification = specification.and(dateSpec);
        }

        return this.loanRepository.findAll(specification, pageable);
    }

    private boolean clientAlreadyHasGameLoaned(Long id, LocalDate returnDate, LocalDate loanDate) {
        List<Loan> loans = this.loanRepository.findByClientIdAndLoanDateBeforeAndReturnDateAfter(id, returnDate, loanDate);
        return !loans.isEmpty();
    }

    private boolean gameAlreadyLoanedInDates(Long id, LocalDate returnDate, LocalDate loanDate) {
        List<Loan> loans = this.loanRepository.findByGameIdAndLoanDateBeforeAndReturnDateAfter(id, returnDate, loanDate);
        return !loans.isEmpty();
    }
}
