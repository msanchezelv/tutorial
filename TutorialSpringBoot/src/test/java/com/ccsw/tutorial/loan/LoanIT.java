package com.ccsw.tutorial.loan;

import com.ccsw.tutorial.client.model.ClientDto;
import com.ccsw.tutorial.common.pagination.PageableRequest;
import com.ccsw.tutorial.config.ResponsePage;
import com.ccsw.tutorial.game.model.GameDto;
import com.ccsw.tutorial.loan.model.LoanDto;
import com.ccsw.tutorial.loan.model.LoanSearchDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * @author marina31sanchez
 */

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class LoanIT {

    public static final String LOCALHOST = "http://localhost:";
    public static final String SERVICE_PATH = "/loan";

    public static final int TOTAL_LOANS = 5;
    public static final int PAGE_SIZE = 5;

    // EXISTS
    public static final Long GAME_ID = 2L;
    public static final Long CLIENT_ID = 1L;
    public static final LocalDate EXISTS_LOANDATE = LocalDate.parse("2025-04-02");
    public static final LocalDate EXISTS_RETURNDATE = LocalDate.parse("2025-04-09");
    public static final Long LOAN_EXISTS_ID = 1L;
    public static final LocalDate DATE_LOAN_1 = LocalDate.parse("2025-04-01");

    // DOESN'T EXIST
    public static final Long NOT_EXISTS_CLIENT = 6L;
    public static final Long NOT_EXISTS_GAME = 7L;
    public static final LocalDate NOT_EXISTS_LOANDATE = LocalDate.parse("2026-01-01");

    // PARAMETERS
    public static final String GAME_PARAM = "idGame";
    public static final String CLIENT_PARAM = "idClient";
    public static final String DATE_PARAM = "date";

    @LocalServerPort
    private int port;

    @Autowired
    TestRestTemplate restTemplate;

    ParameterizedTypeReference<List<LoanDto>> responseTypeList = new ParameterizedTypeReference<List<LoanDto>>() {
    };
    ParameterizedTypeReference<ResponsePage<LoanDto>> responseTypePage = new ParameterizedTypeReference<ResponsePage<LoanDto>>() {
    };

    // game", "client", "loanDate", "returnDate"}
    private String getUrlWithParams() {
        return UriComponentsBuilder.fromHttpUrl(LOCALHOST + port + SERVICE_PATH).queryParam(GAME_PARAM, "{" + GAME_PARAM + "}").queryParam(CLIENT_PARAM, "{" + CLIENT_PARAM + "}").queryParam(DATE_PARAM, "{" + DATE_PARAM + "}").encode().toUriString();
    }

    // Tests con Page funcionan
    @Test
    public void findFirstPageShouldReturnFiveLoans() {

        LoanSearchDto searchDto = new LoanSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));

        ResponseEntity<ResponsePage<LoanDto>> response = restTemplate.exchange(LOCALHOST + port + SERVICE_PATH, HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage);

        assertNotNull(response.getBody());
        assertEquals(TOTAL_LOANS, response.getBody().getTotalElements());
        assertEquals(PAGE_SIZE, response.getBody().getSize());
    }

    @Test
    public void createNewLoanNoIdShouldCreateNewLoan() {
        long newLoanId = TOTAL_LOANS + 1;
        long newLoanSizePage = TOTAL_LOANS + 1;

        ClientDto clientDto = new ClientDto();
        GameDto gameDto = new GameDto();
        LoanDto loanDto = new LoanDto();
        LoanSearchDto searchDto = new LoanSearchDto();

        clientDto.setId(CLIENT_ID);
        gameDto.setId(GAME_ID);
        loanDto.setClient(clientDto);
        loanDto.setGame(gameDto);
        loanDto.setLoanDate(EXISTS_LOANDATE);
        loanDto.setReturnDate(EXISTS_RETURNDATE);

        restTemplate.exchange(LOCALHOST + port + SERVICE_PATH, HttpMethod.PUT, new HttpEntity<>(loanDto), Void.class);

        searchDto.setPageable(new PageableRequest(0, (int) newLoanSizePage));

        ResponseEntity<ResponsePage<LoanDto>> response = restTemplate.exchange(LOCALHOST + port + SERVICE_PATH, HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage);

        assertNotNull(response.getBody());
        assertEquals(newLoanSizePage, response.getBody().getTotalElements());

        LoanDto loanResponse = response.getBody().getContent().stream().filter(loan -> loan.getId().equals(newLoanId)).findFirst().orElse(null);
        assertNotNull(loanResponse);
        assertEquals(loanResponse.getClient().getId(), CLIENT_ID);
        assertEquals(GAME_ID, loanResponse.getGame().getId());


    }

    @Test
    public void deleteLoanExistsIdShouldDeleteExistingLoan() {
        long newLoanSizePage = TOTAL_LOANS - 1;

        restTemplate.exchange(LOCALHOST + port + SERVICE_PATH + "/" + LOAN_EXISTS_ID, HttpMethod.DELETE, null, Void.class);

        LoanSearchDto searchDto = new LoanSearchDto();
        searchDto.setPageable(new PageableRequest(0, TOTAL_LOANS));

        ResponseEntity<ResponsePage<LoanDto>> response = restTemplate.exchange(LOCALHOST + port + SERVICE_PATH, HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage);

        assertNotNull(response);
        assertEquals(newLoanSizePage, response.getBody().getTotalElements());
    }

    // Tests con List no funcionan
    @Test
    public void findWithoutFiltersShouldReturnAll() {
        Map<String, Object> params = new HashMap<>();
        params.put(GAME_PARAM, null);
        params.put(CLIENT_PARAM, null);
        params.put(DATE_PARAM, null);

        ResponseEntity<List<LoanDto>> response = restTemplate.exchange(getUrlWithParams(), HttpMethod.GET, null, responseTypeList, params);

        assertNotNull(response);
        assertEquals(TOTAL_LOANS, response.getBody().size());

    }

    @Test
    public void findExistsClientAndGameShouldReturnLoans() {
        int FILTERED_LOANS = 2;

        Map<String, Object> params = new HashMap<>();
        params.put(GAME_PARAM, null);
        params.put(CLIENT_PARAM, CLIENT_ID);
        params.put(DATE_PARAM, null);

        ResponseEntity<List<LoanDto>> response = restTemplate.exchange(getUrlWithParams(), HttpMethod.GET, null, responseTypeList, params);

    }

}