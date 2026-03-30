package com.bolaofc.bolaofc.partida;

import com.bolaofc.bolaofc.bolao.Bolao;
import com.bolaofc.bolaofc.pontuacao.PontuacaoService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PartidaService {
    private final PartidaRepository partidaRepository;
    private final PontuacaoService pontuacaoService;

    public PartidaService(PartidaRepository partidaRepository, PontuacaoService pontuacaoService) {
        this.partidaRepository = partidaRepository;
        this.pontuacaoService = pontuacaoService;
    }
    public Partida criarPartida(Partida partida){
        return partidaRepository.save(partida);
    }
    public List<Partida> buscarPartidaPorBolao(Bolao bolao){
        return partidaRepository.findByBolao(bolao);
    }
    public List<Partida> buscarPartidaPorStatus(StatusPartida status){
        return  partidaRepository.findByStatus(status);
    }
    public Partida atualizarResultado(UUID id,Integer golsCasa,Integer golsFora){
        Partida partida = partidaRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Partida não encontrada"));
            partida.setGolsCasa(golsCasa);
            partida.setGolsFora(golsFora);
            partida.setStatus(StatusPartida.FINALIZADA);

            Partida partidaAtualizada = partidaRepository.save(partida);

            pontuacaoService.calcularPontuacao(partidaAtualizada);

            return partidaAtualizada;

    }
}
