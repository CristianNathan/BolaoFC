package com.bolaofc.bolaofc.controller;

import com.bolaofc.bolaofc.bolao.BolaoService;
import com.bolaofc.bolaofc.football.FootballApiService;
import com.bolaofc.bolaofc.partida.Gols;
import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.partida.PartidaService;
import com.bolaofc.bolaofc.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping
public class PartidaController {
    private final PartidaService partidaService;
    private final BolaoService bolaoService;
    private final FootballApiService footballApiService;

    public PartidaController(PartidaService partidaService, BolaoService bolaoService, FootballApiService footballApiService) {
        this.partidaService = partidaService;
        this.bolaoService = bolaoService;
        this.footballApiService = footballApiService;
    }

    @PostMapping("/partidas")
    public ResponseEntity partidas(@RequestBody Partida partida){
        var usuarios = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var partidaSalva = partidaService.criarPartida(partida);
        return ResponseEntity.ok(partidaSalva);
    }
    @GetMapping("/partidas/{bolaoId}")
    public ResponseEntity buscarPartidas(@PathVariable UUID bolaoId){
        var bolao = bolaoService.buscarPorId(bolaoId);
        var partidas = partidaService.buscarPartidaPorBolao(bolao);
        return ResponseEntity.ok(partidas);

    }
    @PutMapping("/partidas/{id}/resultado")
    public ResponseEntity resultado(@PathVariable UUID id, @RequestBody Gols gols){
        return ResponseEntity.ok(partidaService.atualizarResultado(id,gols.golsCasa(), gols.golsFora()));
    }
    @GetMapping("/partidas/testar-api")
    public ResponseEntity testarApi(){
        String resultado = footballApiService.buscarPartidas();
        return ResponseEntity.ok(resultado);
    }


}
