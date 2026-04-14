package com.bolaofc.bolaofc.palpite;

import com.bolaofc.bolaofc.bolao.Bolao;
import com.bolaofc.bolaofc.bolao.BolaoRepository;
import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.partida.PartidaRepository;
import com.bolaofc.bolaofc.transacao.Tipo;
import com.bolaofc.bolaofc.transacao.TransacaoService;
import com.bolaofc.bolaofc.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PalpiteService {
    private final PalpiteRepository palpiteRepository;
    private final PartidaRepository partidaRepository;
    private final BolaoRepository bolaoRepository;
    private final TransacaoService transacaoService;

    public PalpiteService(PalpiteRepository palpiteRepository,
                          PartidaRepository partidaRepository,
                          BolaoRepository bolaoRepository,
                          TransacaoService transacaoService) {
        this.palpiteRepository = palpiteRepository;
        this.partidaRepository = partidaRepository;
        this.bolaoRepository = bolaoRepository;
        this.transacaoService = transacaoService;
    }

    @Transactional
    public Palpite fazerPalpite(PalpiteRequestDTO data, User user) {
        Partida partida = partidaRepository.findById(data.jogoId())
                .orElseThrow(() -> new RuntimeException("Partida não encontrada"));

        Bolao bolao = bolaoRepository.findById(data.bolaoId())
                .orElseThrow(() -> new RuntimeException("Bolão não encontrado"));

        // Validação de status
        String status = partida.getStatus().toString();
        if (!status.equals("AGENDADA") && !status.equals("TIMED")) {
            throw new IllegalStateException("A partida já iniciou.");
        }

        Optional<Palpite> palpiteExistente = palpiteRepository.findByUserAndPartidaAndBolao(user, partida, bolao);

        Palpite palpite = palpiteExistente.orElse(new Palpite());

        if (palpite.getId() == null) {
            palpite.setUser(user);
            palpite.setPartida(partida);
            palpite.setBolao(bolao);

            transacaoService.registrarTransacao(user, 10.0, Tipo.DEBITO, "Palpite no Bolão: " + bolao.getNome());
        }

        palpite.setPalpiteCasa(data.golsMandante());
        palpite.setPalpiteFora(data.golsVisitante());
        palpite.setStatus(PalpitesStatus.PENDENTE);
        palpite.setPontosGanhos(0);

        return palpiteRepository.save(palpite);
    }
    public List<Palpite> buscarPorUsuario(User user) {
        return palpiteRepository.findByUser(user);
    }
}