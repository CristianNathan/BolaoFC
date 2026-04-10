package com.bolaofc.bolaofc.bolao;

import com.bolaofc.bolaofc.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BolaoParticipanteRepository extends JpaRepository<BolaoParticipante, UUID> {
    List<BolaoParticipante> findByBolaoOrderByPontosTotalDesc(Bolao bolao);
    Optional<BolaoParticipante> findByUserAndBolao(User user, Bolao bolao);

    Bolao bolaoId(UUID bolaoId);
}
