package com.bolaofc.bolaofc.partida;

import com.bolaofc.bolaofc.bolao.Bolao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PartidaRepository extends JpaRepository<Partida, UUID> {

    List<Partida> findByLigaInAndStatus(List<String> ligas, StatusPartida status);

    List<Partida> findByStatus(StatusPartida status);

    Optional<Partida> findByTimeCasaAndTimeFora(String timeCasa, String timeFora);

    List<Partida> findByBolao(Bolao bolao);


}