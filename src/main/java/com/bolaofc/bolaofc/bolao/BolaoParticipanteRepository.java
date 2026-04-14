package com.bolaofc.bolaofc.bolao;

import com.bolaofc.bolaofc.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BolaoParticipanteRepository extends JpaRepository<BolaoParticipante, UUID> {


    List<BolaoParticipante> findByUserId(UUID userId);

    List<BolaoParticipante> findByUser(User user);

    List<BolaoParticipante> findByBolaoOrderByPontosTotalDesc(Bolao bolao);

    Optional<BolaoParticipante> findByUserAndBolao(User user, Bolao bolao);
}