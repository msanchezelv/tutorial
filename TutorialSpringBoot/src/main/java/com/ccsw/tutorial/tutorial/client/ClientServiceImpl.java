package com.ccsw.tutorial.tutorial.client;

import com.ccsw.tutorial.tutorial.client.model.Client;
import com.ccsw.tutorial.tutorial.client.model.ClientDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author marina31sanchez
 *
 */

@Service
@Transactional
public class ClientServiceImpl implements ClientService {

    @Autowired
    ClientRepository clientRepository;

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Client> findAll() {

        return (List<Client>) this.clientRepository.findAll();
    }

    /**
     * {@inheritDoc}
     */
    public void save(Long id, ClientDto dto) {

        Client client;

        if (id == null) {
            client = new Client();
        } else {
            client = this.clientRepository.findById(id).orElse(null);
        }

        client.setName(dto.getName());

        this.clientRepository.save(client);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void delete(Long id) throws Exception {

        if (this.clientRepository.findById(id).orElse(null) == null) {
            throw new Exception("Client with id " + id + " , doesn't exist");
        }

        this.clientRepository.deleteById(id);
    }

    @Override
    public Client getClientById(Long id) {

        return this.clientRepository.findById(id).orElse(null);
    }

}