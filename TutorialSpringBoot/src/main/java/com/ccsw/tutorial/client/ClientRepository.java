package com.ccsw.tutorial.client;

import com.ccsw.tutorial.client.model.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

/**
 * @author marina31sanchez
 */
public interface ClientRepository extends CrudRepository<Client, Long> {
    /**
     * Metodo para recuperar un listado paginado de {@link Client}
     *
     * @param pageable pageable
     * @return {@link Page} de {@link Client}
     */
    Page<Client> findAll(Pageable pageable);
}
