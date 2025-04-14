package com.ccsw.tutorial.tutorial.client;

import com.ccsw.tutorial.tutorial.client.model.Client;
import org.springframework.data.repository.CrudRepository;

/**
 * @author marina31sanchez
 */
public interface ClientRepository extends CrudRepository<Client, Long> {
}
