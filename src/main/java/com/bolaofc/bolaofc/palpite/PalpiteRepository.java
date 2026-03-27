package com.bolaofc.bolaofc.palpite;

import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PalpiteRepository extends JpaRepository<Palpite, UUID> {
    Optional<Palpite> findByUserAndPartida(User user, Partida partida);
    List<Palpite> findByPartida(Partida partida);
}
