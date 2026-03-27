package com.bolaofc.bolaofc.bolao;

import com.bolaofc.bolaofc.user.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class BolaoService {
    private final BolaoRepository bolaoRepository;

    public BolaoService(BolaoRepository bolaoRepository) {
        this.bolaoRepository = bolaoRepository;
    }
    public Bolao criarBolao(Bolao bolao, User user){
        bolao.setDono(user);
        bolao.setCodigoConvite(UUID.randomUUID().toString().substring(0, 8));
        bolao.setCriadoEm(LocalDateTime.now());
        bolao.setStatus(Status.ABERTO);
        return bolaoRepository.save(bolao);
    }
    public Bolao entrarNoBolao(String codigoConvite){
        return bolaoRepository.findByCodigoConvite(codigoConvite);
    }
    public Bolao buscarPorId(UUID id){
        return bolaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bolão não encontrado"));
    }
}

