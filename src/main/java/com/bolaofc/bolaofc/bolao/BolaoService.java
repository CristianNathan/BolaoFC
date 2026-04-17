package com.bolaofc.bolaofc.bolao;

import com.bolaofc.bolaofc.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BolaoService {

    private final BolaoRepository bolaoRepository;
    private final BolaoParticipanteRepository participanteRepository;

    public BolaoService(BolaoRepository bolaoRepository, BolaoParticipanteRepository participanteRepository) {
        this.bolaoRepository = bolaoRepository;
        this.participanteRepository = participanteRepository;
    }

    @Transactional
    public Bolao criarBolao(BolaoRequestDTO dados, User user){
        Bolao bolao = new Bolao();
        bolao.setNome(dados.nome());
        bolao.setPontosPlacarExato(dados.pontosPlacarExato());
        bolao.setPontosVencedor(dados.pontosVencedor());
        bolao.setPrivado(dados.privado());
        bolao.setLigasPermitidas(dados.ligasPermitidas());
        bolao.setDono(user);
        bolao.setCodigoConvite(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        bolao.setCriadoEm(LocalDateTime.now());
        bolao.setStatus(Status.ABERTO);

        Bolao bolaoSalvo = bolaoRepository.save(bolao);

        BolaoParticipante participante = new BolaoParticipante();
        participante.setUser(user);
        participante.setBolao(bolaoSalvo);
        participante.setPontosTotal(0L);
        participanteRepository.save(participante);

        return bolaoSalvo;
    }

    public Bolao entrarNoBolao(String codigoConvite){
        return bolaoRepository.findByCodigoConvite(codigoConvite);
    }

    public List<Bolao> listarBoloesDoUsuario(UUID userId) {
        List<BolaoParticipante> participacoes = participanteRepository.findByUserId(userId);
        return participacoes.stream()
                .map(BolaoParticipante::getBolao)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Bolao> listarBoloesPublicos(List<String> ligas, UUID userId) {
        if (ligas != null && !ligas.isEmpty()) {
            return bolaoRepository.findByPrivadoFalseAndLigasAndDonoIdNot(ligas, userId);
        }
        return bolaoRepository.findByPrivadoFalseAndDonoIdNot(userId);
    }
    public Optional<Bolao> buscarPorId(UUID id){
        return bolaoRepository.findById(id);
    }
}