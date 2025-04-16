package com.ccsw.tutorial.game;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class GameAlredyLoanedException extends Throwable {
    public GameAlredyLoanedException(String s) {
        super(s);
    }
}
