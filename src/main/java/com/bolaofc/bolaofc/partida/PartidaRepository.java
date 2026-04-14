package com.bolaofc.bolaofc.partida;

import com.bolaofc.bolaofc.bolao.Bolao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PartidaRepository extends JpaRepository<Partida, UUID> {

    // Agora que adicionamos o campo 'liga' na entidade, isso vai funcionar:
    List<Partida> findByLigaInAndStatus(List<String> ligas, StatusPartida status);

    List<Partida> findByStatus(StatusPartida status);

    Optional<Partida> findByTimeCasaAndTimeFora(String timeCasa, String timeFora);

    // Se você for usar a busca por bolão direto:
    List<Partida> findByBolao(Bolao bolao);


}