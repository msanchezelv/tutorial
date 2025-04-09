package com.ccsw.tutorial.loan;

import com.ccsw.tutorial.client.ClientService;
import com.ccsw.tutorial.common.criteria.SearchCriteria;
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
    public void save(Long id, LoanDto data) {

        Loan loan;

        if (id == null) {
            loan = new Loan();
        } else {
            loan = this.get(id);
        }

        BeanUtils.copyProperties(data, loan, "id", "game", "client");

        loan.setClient(clientService.getClientById(data.getClient().getId()));
        loan.setGame(gameService.getGameById(data.getGame().getId()));

        this.loanRepository.save(loan);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void delete(Long id) throws Exception {

        if (this.get(id) == null) {
            throw new Exception("Not exists");
        }

        this.loanRepository.deleteById(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Loan> findAll() {

        return (List<Loan>) this.loanRepository.findAll();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Page<Loan> findPagedAndFiltered(Long idGame, Long idClient, LocalDate date, LoanSearchDto loanSearchDto) {
        Pageable pageable = loanSearchDto.getPageable().getPageable();

        Specification<Loan> spec = Specification.where(null);

        if (idGame != null) {
            LoanSpecification titleSpec = new LoanSpecification(new SearchCriteria("gameId", ":", idGame));
            spec = spec.and(titleSpec);
        }
        if (idClient != null) {
            LoanSpecification clientSpec = new LoanSpecification(new SearchCriteria("clientId", ":", idClient));
            spec = spec.and(clientSpec);
        }
        if (date != null) {
            LoanSpecification dateSpec = new LoanSpecification(new SearchCriteria("loanDate", ":", date));
            spec = spec.and(dateSpec);
        }

        return this.loanRepository.findAll(spec, pageable);
    }
}
