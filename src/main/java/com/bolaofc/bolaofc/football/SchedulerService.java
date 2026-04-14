package com.bolaofc.bolaofc.football;

import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.partida.PartidaRepository;
import com.bolaofc.bolaofc.partida.StatusPartida;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class SchedulerService {

    private final FootballApiService footballApiService;
    private final PartidaRepository partidaRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SchedulerService(FootballApiService footballApiService,
                            PartidaRepository partidaRepository) {
        this.footballApiService = footballApiService;
        this.partidaRepository = partidaRepository;
    }

    @Scheduled(fixedRate = 21600000)
    public void sincronizarPartidas() {
        try {
            String json = footballApiService.buscarPartidas();
            JsonNode root = objectMapper.readTree(json);
            JsonNode matches = root.get("matches");

            if (matches == null || !matches.isArray()) {
                System.out.println("Nenhuma partida retornada da API.");
                return;
            }

            for (JsonNode match : matches) {
                String timeCasa = match.get("homeTeam").get("shortName").asText();
                String timeFora = match.get("awayTeam").get("shortName").asText();
                String ligaCodigo = match.get("competition").get("code").asText();
                String dataStr = match.get("utcDate").asText();
                String statusApi = match.get("status").asText();
                String escudoCasa = match.get("homeTeam").get("crest").asText();
                String escudoFora = match.get("awayTeam").get("crest").asText();

                if (partidaRepository.findByTimeCasaAndTimeFora(timeCasa, timeFora).isPresent()) {
                    continue;
                }

                Partida partida = new Partida();
                partida.setTimeCasa(timeCasa);
                partida.setTimeFora(timeFora);
                partida.setLiga(ligaCodigo);
                partida.setEscudoCasa(escudoCasa);
                partida.setEscudoFora(escudoFora);
                partida.setDataPartida(
                        LocalDateTime.parse(dataStr, DateTimeFormatter.ISO_DATE_TIME)
                );
                partida.setStatus(
                        statusApi.equals("FINISHED") ? StatusPartida.FINALIZADA : StatusPartida.AGENDADA
                );

                partidaRepository.save(partida);
            }

            System.out.println("Partidas sincronizadas com sucesso!");

        } catch (Exception e) {
            System.err.println("Erro ao sincronizar partidas: " + e.getMessage());
        }
    }
}