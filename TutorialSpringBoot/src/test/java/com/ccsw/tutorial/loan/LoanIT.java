package com.ccsw.tutorial.loan;

import com.ccsw.tutorial.loan.model.LoanDto;
import org.h2.mvstore.Page;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.util.UriComponentsBuilder;

import java.sql.Date;
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

    public static final Long EXISTS_LOAN_ID = 1L;
    public static final Long NOT_EXISTS_LOAN_ID = 0L;

    private static final String GAME_ID_PARAM = "idGame";
    private static final String CLIENT_ID_PARAM = "idClient";

    private static final Long EXISTS_CLIENT = 1L;
    private static final Long NOT_EXISTS_CLIENT = 0L;
    private static final Long EXISTS_GAME = 1L;
    private static final Long NOT_EXISTS_GAME = 0L;

    private static final String NOT_EXISTS_LOANDATE = "NotExists";
    private static final Date EXISTS_LOANDATE = Date.valueOf("2025-04-01");

    private static final String NOT_EXISTS_RETURNDATE = "NotExists";
    private static final Date EXISTS_RETURNDATE = Date.valueOf("2025-04-08");

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    ParameterizedTypeReference<List<LoanDto>> responseType = new ParameterizedTypeReference<List<LoanDto>>() {
    };

    private String getUrlWithParams() {
        return UriComponentsBuilder.fromHttpUrl(LOCALHOST + port + SERVICE_PATH).queryParam(CLIENT_ID_PARAM, "{" + CLIENT_ID_PARAM + "}").queryParam(GAME_ID_PARAM, "{" + GAME_ID_PARAM + "}").encode().toUriString();
    }

    @Test
    public void findWithoutFiltersShouldReturnAllLoansInDB() {

        Map<String, Object> params = new HashMap<>();
        params.put(CLIENT_ID_PARAM, null);
        params.put(GAME_ID_PARAM, null);

        ResponseEntity<List<LoanDto>> response = restTemplate.exchange(getUrlWithParams(), HttpMethod.GET, null, responseType, params);

        assertNotNull(response);
        assertEquals(5, response.getBody().size());
    }

    @Test
    public void findExistsClientShouldReturnLoans() {

    }

    @Test
    public void findNotExistsClientShouldReturnLoans() {

        M
    }

    @Test
    public void findExistsClientAndGameShouldReturnLoans() {

    }

}