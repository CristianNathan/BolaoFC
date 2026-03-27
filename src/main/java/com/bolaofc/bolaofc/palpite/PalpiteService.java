package com.bolaofc.bolaofc.palpite;

import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.partida.PartidaRepository; // Importe o repositório de partida
import com.bolaofc.bolaofc.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PalpiteService {
    private final PalpiteRepository palpiteRepository;
    private final PartidaRepository partidaRepository;

    public PalpiteService(PalpiteRepository palpiteRepository, PartidaRepository partidaRepository) {
        this.palpiteRepository = palpiteRepository;
        this.partidaRepository = partidaRepository;
    }

    @Transactional
    public Palpite fazerPalpite(Palpite palpite, User user) {
        Partida partida = partidaRepository.findById(palpite.getPartida().getId())
                .orElseThrow(() -> new RuntimeException("Partida não encontrada com o ID: " + palpite.getPartida().getId()));

        palpite.setPartida(partida);

        Optional<Palpite> palpiteExistente = palpiteRepository.findByUserAndPartida(user, partida);
        if (palpiteExistente.isPresent()) {
            throw new RuntimeException("Você já registrou um palpite para esta partida.");
        }

        if (!partida.getStatus().name().equals("AGENDADA")) {
            throw new IllegalStateException("A partida já iniciou ou foi finalizada. Não é mais possível palpitar.");
        }

        palpite.setUser(user);
        palpite.setStatus(PalpitesStatus.PENDENTE);
        palpite.setPontosGanhos(0);

        return palpiteRepository.save(palpite);
    }

    public List<Palpite> buscarPalpitesPorPartida(Partida partida) {
        return palpiteRepository.findByPartida(partida);
    }
}