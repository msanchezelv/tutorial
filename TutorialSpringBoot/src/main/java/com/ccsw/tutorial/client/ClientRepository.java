package com.ccsw.tutorial.client;

import com.ccsw.tutorial.client.model.Client;
import org.springframework.data.repository.CrudRepository;

/**
 * @author marina31sanchez
 */
public interface ClientRepository extends CrudRepository<Client, Long> {
}
