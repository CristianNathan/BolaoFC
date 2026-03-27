package com.bolaofc.bolaofc.partida;

import com.bolaofc.bolaofc.bolao.Bolao;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartidaService {
    private final PartidaRepository partidaRepository;

    public PartidaService(PartidaRepository partidaRepository) {
        this.partidaRepository = partidaRepository;
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
}
