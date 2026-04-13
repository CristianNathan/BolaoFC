package com.bolaofc.bolaofc.controller;

import com.bolaofc.bolaofc.football.FootballApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/futebol")
@CrossOrigin(origins = "http://localhost:5173") // Libera o seu React
public class FootballController {

    private final FootballApiService footballApiService;

    public FootballController(FootballApiService footballApiService) {
        this.footballApiService = footballApiService;
    }

    @GetMapping("/jogos-reais")
    public ResponseEntity<String> getJogos() {
        String dadosBrutos = footballApiService.buscarPartidas();
        return ResponseEntity.ok(dadosBrutos);
    }
}
