package com.bolaofc.bolaofc.bolao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface BolaoRepository extends JpaRepository<Bolao, UUID> {
    List<Bolao> findByPrivadoFalse();
    Bolao findByCodigoConvite(String codigoConvite);
    @Query("SELECT p.bolao FROM BolaoParticipante p WHERE p.user.id = :userId")
    List<Bolao> findByUserId(@Param("userId") UUID userId);
}