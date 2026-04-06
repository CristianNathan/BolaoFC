package com.bolaofc.bolaofc.palpite;

import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.partida.PartidaRepository;
import com.bolaofc.bolaofc.transacao.Tipo;
import com.bolaofc.bolaofc.transacao.TransacaoService;
import com.bolaofc.bolaofc.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PalpiteService {
    private final PalpiteRepository palpiteRepository;
    private final PartidaRepository partidaRepository;
    private final TransacaoService transacaoService;

    public PalpiteService(PalpiteRepository palpiteRepository,
                          PartidaRepository partidaRepository,
                          TransacaoService transacaoService) {
        this.palpiteRepository = palpiteRepository;
        this.partidaRepository = partidaRepository;
        this.transacaoService = transacaoService;
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
            throw new IllegalStateException("A partida já iniciou ou foi finalizada.");
        }

        palpite.setUser(user);
        palpite.setStatus(PalpitesStatus.PENDENTE);
        palpite.setPontosGanhos(0);

        Palpite palpiteSalvo = palpiteRepository.save(palpite);

        transacaoService.registrarTransacao(
                user,
                10.0,
                Tipo.DEBITO,
                "Aposta: " + partida.getTimeCasa() + " x " + partida.getTimeFora()
        );

        return palpiteSalvo;
    }

    public List<Palpite> buscarPalpitesPorPartida(Partida partida) {
        return palpiteRepository.findByPartida(partida);
    }
}