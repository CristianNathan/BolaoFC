package com.bolaofc.bolaofc.bolao;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RakingService {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final BolaoParticipanteRepository bolaoParticipanteRepository;
    private final BolaoService bolaoService;

    public RakingService(SimpMessagingTemplate simpMessagingTemplate, BolaoParticipanteRepository bolaoParticipanteRepository, BolaoService bolaoService) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.bolaoParticipanteRepository = bolaoParticipanteRepository;
        this.bolaoService = bolaoService;
    }
    public void atualizarEnviarRaking(UUID bolaoId){
        Bolao bolao = bolaoService.buscarPorId(bolaoId);
        List<BolaoParticipante> ranking = bolaoParticipanteRepository.findByBolaoOrderByPontosTotalDesc(bolao);
        String destino = "/topic/raking/"+ bolaoId;
        System.out.println("Enviando ranking atualizado para o bolão: "+ bolaoId);
        simpMessagingTemplate.convertAndSend(destino,ranking);
    }
}
