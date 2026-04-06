package com.bolaofc.bolaofc.transacao;

import com.bolaofc.bolaofc.user.User;
import com.bolaofc.bolaofc.user.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransacaoService {
    private final TransacaoRepository transacaoRepository;
    private final UserRepository userRepository;

    public TransacaoService(TransacaoRepository transacaoRepository, UserRepository userRepository) {
        this.transacaoRepository = transacaoRepository;
        this.userRepository = userRepository;
    }
    public Transacao registrarTransacao(User user, double valor, Tipo tipo, String descricao){
        Transacao transacao = new Transacao();
        transacao.setUser(user);
        transacao.setValor(valor);
        transacao.setTipo(tipo);
        transacao.setDescricao(descricao);
        transacao.setCriadoem(LocalDateTime.now());
        return transacaoRepository.save(transacao);
    }
    public List<Transacao> buscarExtrato(User user){
        return transacaoRepository.findByUserIdOrderByCriadoemDesc(user.getId());
    }
}
