package com.bolaofc.bolaofc.football;

import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.partida.PartidaRepository;
import com.bolaofc.bolaofc.partida.PartidaService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SchedulerService {
    private final FootballApiService footballApiService;
    private final PartidaRepository partidaRepository;
    private final PartidaService partidaService;
    private final ObjectMapper objectMapper;

    public SchedulerService(FootballApiService footballApiService,
                            PartidaRepository partidaRepository,
                            PartidaService partidaService,
                            ObjectMapper objectMapper) {
        this.footballApiService = footballApiService;
        this.partidaRepository = partidaRepository;
        this.partidaService = partidaService;
        this.objectMapper = objectMapper;
    }

    @Scheduled(fixedDelay = 300000)
    public void atualizarPartidas() {
        try {
            String json = footballApiService.buscarPartidas();
            JsonNode root = objectMapper.readTree(json);
            JsonNode matches = root.path("matches");

            if (matches.isArray()) {
                for (JsonNode match : matches) {
                    String status = match.path("status").asText();

                    if ("FINISHED".equals(status)) {
                        String timeCasa = match.path("homeTeam").path("name").asText();
                        String timeFora = match.path("awayTeam").path("name").asText();
                        Integer golsCasa = match.path("score").path("fullTime").path("home").asInt();
                        Integer golsFora = match.path("score").path("fullTime").path("away").asInt();

                        Optional<Partida> partidaLocal = partidaRepository.findByTimeCasaAndTimeFora(timeCasa, timeFora);

                        if (partidaLocal.isPresent() && !partidaLocal.get().getStatus().name().equals("FINALIZADA")) {
                            partidaService.atualizarResultado(
                                    partidaLocal.get().getId(),
                                    golsCasa,
                                    golsFora
                            );
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}