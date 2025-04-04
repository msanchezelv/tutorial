package com.ccsw.tutorial.client.model;

import jakarta.persistence.*;

/**
 * @author marina31sanchez
 *
 */
@Entity
@Table(name = "client")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
}
