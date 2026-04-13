package com.bolaofc.bolaofc.bolao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BolaoRepository extends JpaRepository<Bolao, UUID> {
    Bolao findByCodigoConvite(String codigoConvite);
}