package com.ccsw.tutorial.tutorial.loan.model;

import com.ccsw.tutorial.tutorial.common.pagination.PageableRequest;

/**
 * @author marina31sanchez
 */
public class LoanSearchDto {
    private PageableRequest pageable;

    public PageableRequest getPageable() {
        return pageable;
    }

    public void setPageable(PageableRequest pageable) {
        this.pageable = pageable;
    }
}
