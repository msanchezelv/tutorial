package com.ccsw.tutorial.loan.model;

import com.ccsw.tutorial.client.model.Client;
import com.ccsw.tutorial.game.model.Game;

import java.util.Date;

/**
 * @author marina31sanchez
 */
public class LoanDto {

    private Long id;

    private Game game;

    private Client client;

    private Date loanDate;

    private Date returnDate;

    /**
     * @return id
     */
    public Long getId() {

        return this.id;
    }

    /**
     * @param id new value of {@link #getId}.
     */
    public void setId(Long id) {

        this.id = id;
    }

    /**
     * @return game
     */
    public Game getGame() {

        return this.game;
    }

    /**
     * @param game new value of {@link #getGame}.
     */
    public void setName(Game game) {

        this.game = game;
    }

    /**
     * @return client
     */
    public Client getClient() {

        return this.client;
    }

    /**
     * @param client new value of {@link #getClient}.
     */
    public void getClient(Client client) {

        this.client = client;
    }

    /**
     * @return loanDate
     */
    public Date getLoanDate() {
        return loanDate;
    }

    /**
     * @param loanDate new value of {@link #getLoanDate}
     */
    public void setLoanDate(Date loanDate) {
        this.loanDate = loanDate;
    }

    /**
     * @return returnDate
     */
    public Date getReturnDate() {
        return returnDate;
    }

    /**
     * @param returnDate new value of {@link #getReturnDate}
     */
    public void setReturnDate(Date returnDate) {
        this.returnDate = returnDate;
    }
}
