package com.bolaofc.bolaofc.controller;

import com.bolaofc.bolaofc.palpite.Palpite;
import com.bolaofc.bolaofc.palpite.PalpiteRequestDTO;
import com.bolaofc.bolaofc.palpite.PalpiteService;
import com.bolaofc.bolaofc.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/palpites")
@CrossOrigin(origins = "*")
public class PalpiteController {

    private final PalpiteService palpiteService;

    public PalpiteController(PalpiteService palpiteService) {
        this.palpiteService = palpiteService;
    }

    @PostMapping("/salvar")
    public ResponseEntity<Palpite> salvarPalpite(@RequestBody PalpiteRequestDTO data) {
        User usuarioLogado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Palpite novoPalpite = palpiteService.fazerPalpite(data, usuarioLogado);

        return ResponseEntity.ok(novoPalpite);
    }
    @GetMapping("/meus")
    public ResponseEntity<List<Palpite>> meusPalpites() {
        User usuarioLogado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Palpite> palpites = palpiteService.buscarPorUsuario(usuarioLogado);
        return ResponseEntity.ok(palpites);
    }
}