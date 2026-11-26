package com.bolaofc.bolaofc.ranking;

import com.bolaofc.bolaofc.bolao.BolaoParticipante;
import com.bolaofc.bolaofc.bolao.BolaoParticipanteRepository;
import com.bolaofc.bolaofc.palpite.Palpite;
import com.bolaofc.bolaofc.palpite.PalpiteRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class RankingService {

    private final BolaoParticipanteRepository participanteRepository;
    private final PalpiteRepository palpiteRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public RankingService(BolaoParticipanteRepository participanteRepository,
                          PalpiteRepository palpiteRepository,
                          SimpMessagingTemplate messagingTemplate) {
        this.participanteRepository = participanteRepository;
        this.palpiteRepository = palpiteRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<BolaoParticipante> obterRankingDoBolao(UUID bolaoId) {
        return participanteRepository.findAll().stream()
                .filter(p -> p.getBolao().getId().equals(bolaoId))
                .sorted((p1, p2) -> p2.getPontosTotal().compareTo(p1.getPontosTotal()))
                .toList();
    }

    public List<RankingResponseDTO> obterRankingDTO(UUID bolaoId) {
        return obterRankingDoBolao(bolaoId).stream()
                .map(p -> new RankingResponseDTO(
                        p.getUser().getId(),
                        p.getUser().getNickname(),
                        p.getPontosTotal()
                ))
                .toList();
    }

    @Transactional
    public void atualizarEnviarRanking(UUID bolaoId) {
        var participantes = participanteRepository.findAll().stream()
                .filter(p -> p.getBolao().getId().equals(bolaoId))
                .toList();

        for (var participante : participantes) {
            List<Palpite> palpitesDoUsuario = palpiteRepository.findByUserAndBolaoId(participante.getUser(), bolaoId);

            long somaPontos = palpitesDoUsuario.stream()
                    .mapToLong(p -> p.getPontosGanhos() != null ? p.getPontosGanhos().longValue() : 0L)
                    .sum();

            participante.setPontosTotal(somaPontos);
            participanteRepository.save(participante);
        }

        messagingTemplate.convertAndSend("/topic/ranking/" + bolaoId, obterRankingDTO(bolaoId));
    }
}