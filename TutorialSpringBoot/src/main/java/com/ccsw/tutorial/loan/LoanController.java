package com.ccsw.tutorial.loan;

import com.ccsw.tutorial.game.GameAlredyLoanedException;
import com.ccsw.tutorial.loan.model.Loan;
import com.ccsw.tutorial.loan.model.LoanDto;
import com.ccsw.tutorial.loan.model.LoanSearchDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.stream.Collectors;

/**
 * @author marina31sanchez
 */
@RestController
@CrossOrigin(origins = "*")
@Tag(name = "Loan", description = "API of Loan")
@RequestMapping(value = "/loan")
public class LoanController {

    @Autowired
    LoanService loanService;

    @Autowired
    ModelMapper mapper;

    /**
     * Metodo para recuperar un listado paginado de {@link Loan}
     *
     * @return {@link Page} de {@link LoanDto}
     */
    @Operation(summary = "Find Page", description = "Method that returns a list of Loans, optionally filtered by game and or client")
    @RequestMapping(path = "", method = RequestMethod.POST)
    public Page<LoanDto> find(@RequestParam(value = "idGame", required = false) Long idGame, @RequestParam(value = "idClient", required = false) Long idClient, @RequestParam(value = "date", required = false) LocalDate date,
                              @RequestBody LoanSearchDto loanSearchDto) {

        Page<Loan> loansPage = loanService.findPagedAndFiltered(idGame, idClient, date, loanSearchDto);

        return new PageImpl<>(loansPage.getContent().stream().map(loan -> mapper.map(loan, LoanDto.class)).collect(Collectors.toList()), loansPage.getPageable(), loansPage.getTotalElements());
    }

    /**
     * Metodo para crear o actualizar un {@link Loan}
     *
     * @param dto datos de la entidad
     */
    @Operation(summary = "Save", description = "Method that saves a Loan")
    @RequestMapping(path = "", method = RequestMethod.PUT)
    public void save(@RequestBody LoanDto dto) throws GameAlredyLoanedException {

        this.loanService.save(dto);
    }

    /**
     * Metodo para eliminar un {@link Loan}
     *
     * @param id PK de la entidad
     */
    @Operation(summary = "Delete", description = "Method that deletes a Loan")
    @RequestMapping(path = "/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable("id") Long id) throws Exception {

        this.loanService.delete(id);
    }
}
