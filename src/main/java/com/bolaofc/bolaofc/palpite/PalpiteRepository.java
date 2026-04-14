package com.bolaofc.bolaofc.palpite;

import com.bolaofc.bolaofc.bolao.Bolao;
import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PalpiteRepository extends JpaRepository<Palpite, UUID> {
    Optional<Palpite> findByUserAndPartidaAndBolao(User user, Partida partida, Bolao bolao);
    List<Palpite> findByUser(User user); // ← novo
    List<Palpite> findByPartida(Partida partida);
    List<Palpite> findByUserAndBolaoId(User user, UUID bolaoId);
}