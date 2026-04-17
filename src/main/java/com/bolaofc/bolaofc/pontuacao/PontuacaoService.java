package com.bolaofc.bolaofc.pontuacao;

import com.bolaofc.bolaofc.bolao.Bolao;
import com.bolaofc.bolaofc.bolao.BolaoRepository;
import com.bolaofc.bolaofc.palpite.Palpite;
import com.bolaofc.bolaofc.palpite.PalpiteRepository;
import com.bolaofc.bolaofc.palpite.PalpitesStatus;
import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.ranking.RankingService;
import com.bolaofc.bolaofc.transacao.Tipo;
import com.bolaofc.bolaofc.transacao.TransacaoService;
import com.bolaofc.bolaofc.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PontuacaoService {
    private final PalpiteRepository palpiteRepository;
    private final UserRepository userRepository;
    private final TransacaoService transacaoService;
    private final RankingService rankingService;
    private final BolaoRepository bolaoRepository;

    public PontuacaoService(PalpiteRepository palpiteRepository,
                            UserRepository userRepository,
                            TransacaoService transacaoService,
                            RankingService rankingService,
                            BolaoRepository bolaoRepository) {
        this.palpiteRepository = palpiteRepository;
        this.userRepository = userRepository;
        this.transacaoService = transacaoService;
        this.rankingService = rankingService;
        this.bolaoRepository = bolaoRepository;
    }

    public void calcularPontuacao(Partida partida) {
        List<Palpite> palpites = palpiteRepository.findByPartidaId(partida.getId()); // <-- corrigido

        for (Palpite palpite : palpites) {

            Bolao bolao = palpite.getBolao();
            int pontosPlacarExato = bolao.getPontosPlacarExato() != null ? bolao.getPontosPlacarExato() : 10;
            int pontosVencedor = bolao.getPontosVencedor() != null ? bolao.getPontosVencedor() : 5;

            int pontos = 0;

            boolean placarExato =
                    palpite.getPalpiteCasa().equals(partida.getGolsCasa()) &&
                            palpite.getPalpiteFora().equals(partida.getGolsFora());

            boolean acertouVencedor =
                    (palpite.getPalpiteCasa() > palpite.getPalpiteFora() && partida.getGolsCasa() > partida.getGolsFora()) ||
                            (palpite.getPalpiteFora() > palpite.getPalpiteCasa() && partida.getGolsFora() > partida.getGolsCasa()) ||
                            (palpite.getPalpiteCasa().equals(palpite.getPalpiteFora()) && partida.getGolsCasa().equals(partida.getGolsFora()));

            if (placarExato) {
                pontos = pontosPlacarExato;
            } else if (acertouVencedor) {
                pontos = pontosVencedor;
            }

            var user = palpite.getUser();

            if (pontos > 0) {
                transacaoService.registrarTransacao(
                        user,
                        pontos,
                        Tipo.CREDITO,
                        "Palpite correto - " + partida.getTimeCasa() + " x " + partida.getTimeFora()
                );
                user.setSaldo(user.getSaldo() + pontos);
                userRepository.save(user);
            }

            palpite.setPontosGanhos(pontos);
            palpite.setStatus(pontos > 0 ? PalpitesStatus.CORRETO : PalpitesStatus.INCORRETO);
            palpiteRepository.save(palpite);

            // Atualiza ranking do bolão deste palpite
            rankingService.atualizarEnviarRanking(bolao.getId()); // <-- corrigido
        }
    }
}