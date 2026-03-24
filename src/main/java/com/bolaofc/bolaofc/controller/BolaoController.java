package com.bolaofc.bolaofc.controller;

import com.bolaofc.bolaofc.domain.Bolao;
import com.bolaofc.bolaofc.domain.BolaoService;
import com.bolaofc.bolaofc.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BolaoController {
    private final BolaoService bolaoService;


    public BolaoController(BolaoService bolaoService) {
        this.bolaoService = bolaoService;
    }
    @PostMapping("/bolaos")
    public ResponseEntity bolaos(@RequestBody Bolao bolao){
        var usuarios = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var bolaoSalvo = bolaoService.criarBolao(bolao, usuarios);
        return ResponseEntity.ok(bolaoSalvo);
    }
    @PostMapping("/bolaos/entrar")
    public ResponseEntity entrarNoBolao (@RequestBody String codigoConvite){
        var bolaoEncontrado = bolaoService.entrarNoBolao(codigoConvite);
        return ResponseEntity.ok(bolaoEncontrado);
    }

}
