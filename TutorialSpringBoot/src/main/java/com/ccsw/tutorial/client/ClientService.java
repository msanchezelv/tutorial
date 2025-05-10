package com.ccsw.tutorial.client;

import com.ccsw.tutorial.client.model.Client;
import com.ccsw.tutorial.client.model.ClientDto;
import com.ccsw.tutorial.client.model.ClientSearchDto;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * @author marina31sanchez
 */
public interface ClientService {
    /**
     * Recupera un {@link Client} a través de su ID
     *
     * @param id PK de la entidad
     * @return {@link Client}
     */
    Client get(Long id);

    /**
     * Metodo para recuperar un listado paginado de {@link Client}
     *
     * @param dto dto de búsqueda
     * @return {@link Page} de {@link Client}
     */
    Page<Client> findPage(ClientSearchDto dto);

    /**
     * Method to create or update a {@link Client}
     *
     * @param id  PK de la entidad
     * @param dto datos de la entidad
     */
    void save(Long id, ClientDto dto);

    /**
     * Method to delete a {@link Client}
     *
     * @param id PK de la entidad
     */
    void delete(Long id) throws Exception;
    
    /**
     * Method to return all {@link Client}
     *
     * @return {@link List} de {@link Client}
     */
    List<Client> findAll();

}
