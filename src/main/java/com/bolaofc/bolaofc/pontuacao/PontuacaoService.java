package com.bolaofc.bolaofc.pontuacao;

import com.bolaofc.bolaofc.palpite.Palpite;
import com.bolaofc.bolaofc.palpite.PalpiteRepository;
import com.bolaofc.bolaofc.palpite.PalpitesStatus;
import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.user.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class PontuacaoService {
    private final PalpiteRepository palpiteRepository;
    private final UserRepository userRepository;

    public PontuacaoService(PalpiteRepository palpiteRepository, UserRepository userRepository) {
        this.palpiteRepository = palpiteRepository;
        this.userRepository = userRepository;
    }
    public void calcularPontuacao(Partida partida) {
            var palpites = palpiteRepository.findByPartida(partida);

            for (var palpite : palpites) {
                int pontos = 0;

                if (palpite.getPalpiteCasa().equals(partida.getGolsCasa()) &&
                        palpite.getPalpiteFora().equals(partida.getGolsFora())) {
                    pontos = 10;
                }
                else if (
                        (palpite.getPalpiteCasa() > palpite.getPalpiteFora() && partida.getGolsCasa() > partida.getGolsFora())
                                || (palpite.getPalpiteFora() > palpite.getPalpiteCasa() && partida.getGolsFora() > partida.getGolsCasa())
                                || (palpite.getPalpiteCasa().equals(palpite.getPalpiteFora()) && partida.getGolsCasa().equals(partida.getGolsFora()))
                ) {
                    pontos = 5;
                }

                palpite.setPontosGanhos(pontos);
                palpite.setStatus(pontos > 0 ? PalpitesStatus.CORRETO : PalpitesStatus.INCORRETO);
                palpiteRepository.save(palpite);

                var user = palpite.getUser();
                user.setSaldo(user.getSaldo() + pontos);
                userRepository.save(user);
            }
        }
    }

