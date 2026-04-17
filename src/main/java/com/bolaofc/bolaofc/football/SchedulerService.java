package com.bolaofc.bolaofc.football;

import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.partida.PartidaRepository;
import com.bolaofc.bolaofc.partida.StatusPartida;
import com.bolaofc.bolaofc.palpite.PalpiteRepository;
import com.bolaofc.bolaofc.palpite.PalpitesStatus;
import com.bolaofc.bolaofc.pontuacao.PontuacaoService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class SchedulerService {

    private final FootballApiService footballApiService;
    private final PartidaRepository partidaRepository;
    private final PalpiteRepository palpiteRepository;
    private final PontuacaoService pontuacaoService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public SchedulerService(FootballApiService footballApiService,
                            PartidaRepository partidaRepository,
                            PalpiteRepository palpiteRepository,
                            PontuacaoService pontuacaoService) {
        this.footballApiService = footballApiService;
        this.partidaRepository = partidaRepository;
        this.palpiteRepository = palpiteRepository;
        this.pontuacaoService = pontuacaoService;
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

                Optional<Partida> existente = partidaRepository.findByTimeCasaAndTimeFora(timeCasa, timeFora);
                Partida partida = existente.orElse(new Partida());

                partida.setTimeCasa(timeCasa);
                partida.setTimeFora(timeFora);
                partida.setLiga(ligaCodigo);
                partida.setEscudoCasa(escudoCasa);
                partida.setEscudoFora(escudoFora);

                partida.setDataPartida(
                        LocalDateTime.parse(dataStr, DateTimeFormatter.ISO_DATE_TIME)
                );

                StatusPartida status = switch (statusApi) {
                    case "FINISHED" -> StatusPartida.FINALIZADA;
                    case "IN_PLAY", "PAUSED" -> StatusPartida.EM_ANDAMENTO;
                    default -> StatusPartida.AGENDADA;
                };

                partida.setStatus(status);

                if (statusApi.equals("FINISHED")) {
                    JsonNode score = match.get("score").get("fullTime");

                    int golsCasa = score.get("home").isNull() ? 0 : score.get("home").asInt();
                    int golsFora = score.get("away").isNull() ? 0 : score.get("away").asInt();

                    partida.setGolsCasa(golsCasa);
                    partida.setGolsFora(golsFora);
                }

                partidaRepository.save(partida);

                if (statusApi.equals("FINISHED") && partida.getGolsCasa() != null) {

                    boolean jaCalculado = palpiteRepository
                            .findByPartidaId(partida.getId())
                            .stream()
                            .anyMatch(p -> p.getStatus() != PalpitesStatus.PENDENTE);

                    if (!jaCalculado) {
                        pontuacaoService.calcularPontuacao(partida);
                    }
                }
            }

            System.out.println("Partidas sincronizadas com sucesso!");

        } catch (Exception e) {
            System.err.println("Erro ao sincronizar partidas: " + e.getMessage());
        }
    }
}