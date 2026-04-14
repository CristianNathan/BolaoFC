package com.bolaofc.bolaofc.ranking;

import com.bolaofc.bolaofc.bolao.BolaoParticipante;
import com.bolaofc.bolaofc.bolao.BolaoParticipanteRepository;
import com.bolaofc.bolaofc.palpite.Palpite;
import com.bolaofc.bolaofc.palpite.PalpiteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class RankingService {

    private final BolaoParticipanteRepository participanteRepository;
    private final PalpiteRepository palpiteRepository;

    public RankingService(BolaoParticipanteRepository participanteRepository, PalpiteRepository palpiteRepository) {
        this.participanteRepository = participanteRepository;
        this.palpiteRepository = palpiteRepository;
    }

    public List<BolaoParticipante> obterRankingDoBolao(UUID bolaoId) {
        return participanteRepository.findAll().stream()
                .filter(p -> p.getBolao().getId().equals(bolaoId))
                .sorted((p1, p2) -> p2.getPontosTotal().compareTo(p1.getPontosTotal()))
                .toList();
    }

    @Transactional
    public void atualizarEnviarRanking(UUID bolaoId) {
        var participantes = participanteRepository.findAll().stream()
                .filter(p -> p.getBolao().getId().equals(bolaoId))
                .toList();

        for (var participante : participantes) {
            // Chamada corrigida para bater com o Repository
            List<Palpite> palpitesDoUsuario = palpiteRepository.findByUserAndBolaoId(participante.getUser(), bolaoId);

            long somaPontos = palpitesDoUsuario.stream()
                    .mapToLong(p -> p.getPontosGanhos() != null ? p.getPontosGanhos().longValue() : 0L)
                    .sum();

            participante.setPontosTotal(somaPontos);
            participanteRepository.save(participante);
        }
    }
}