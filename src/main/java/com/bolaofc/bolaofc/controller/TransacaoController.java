package com.bolaofc.bolaofc.controller;

import com.bolaofc.bolaofc.transacao.Tipo;
import com.bolaofc.bolaofc.transacao.Transacao;
import com.bolaofc.bolaofc.transacao.TransacaoService;
import com.bolaofc.bolaofc.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping
public class TransacaoController {
    private final TransacaoService transacaoService;

    public TransacaoController(TransacaoService transacaoService) {
        this.transacaoService = transacaoService;
    }
    @GetMapping("/transacoes/extrato")
    public ResponseEntity TransacaoExtrato(){
        var usuario =(User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var transacaos = transacaoService.buscarExtrato(usuario);
        return ResponseEntity.ok(transacaos);

    }
    @PostMapping("transacoes/depositar")
    public ResponseEntity<Transacao> depositar(@RequestBody Map<String, Double> payload) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Double valor = payload.get("valor");

        Transacao t = transacaoService.registrarTransacao(user, valor, Tipo.CREDITO, "Depósito Inicial");

        return ResponseEntity.ok(t);
    }
}
