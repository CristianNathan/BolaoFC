package com.bolaofc.bolaofc.controller;

import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.partida.PartidaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/futebol")
@CrossOrigin(origins = "http://localhost:5173")
public class FootballController {

    private final PartidaRepository partidaRepository;

    public FootballController(PartidaRepository partidaRepository) {
        this.partidaRepository = partidaRepository;
    }

    @GetMapping("/jogos-reais")
    public ResponseEntity<Map<String, Object>> getJogos() {
        LocalDateTime inicio = LocalDateTime.now(ZoneOffset.UTC).minusDays(4);
        LocalDateTime fim = LocalDateTime.now(ZoneOffset.UTC).plusDays(15);

        System.out.println("Buscando entre: " + inicio + " e " + fim);

        List<Partida> partidas = partidaRepository
                .findByDataPartidaBetweenOrderByDataPartidaAsc(inicio, fim);

        System.out.println("Partidas encontradas: " + partidas.size());

        List<Map<String, Object>> matches = partidas.stream().map(p -> Map.of(
                "id", p.getId(),
                "utcDate", p.getDataPartida().toString() + "Z",
                "status", switch (p.getStatus()) {
                    case FINALIZADA -> "FINISHED";
                    case EM_ANDAMENTO -> "IN_PLAY";
                    default -> "TIMED";
                },
                "competition", Map.of(
                        "name", p.getLiga().equals("WC") ? "FIFA World Cup" : p.getLiga(),
                        "code", p.getLiga()
                ),
                "homeTeam", Map.of(
                        "name", p.getTimeCasa(),
                        "shortName", p.getTimeCasa(),
                        "crest", p.getEscudoCasa() != null ? p.getEscudoCasa() : ""
                ),
                "awayTeam", Map.of(
                        "name", p.getTimeFora(),
                        "shortName", p.getTimeFora(),
                        "crest", p.getEscudoFora() != null ? p.getEscudoFora() : ""
                ),
                "score", Map.of(
                        "fullTime", Map.of(
                                "home", p.getGolsCasa() != null ? p.getGolsCasa() : 0,
                                "away", p.getGolsFora() != null ? p.getGolsFora() : 0
                        )
                )
        )).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("matches", matches));
    }
}