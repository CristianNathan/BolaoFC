package com.bolaofc.bolaofc.controller;

import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.partida.PartidaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/partidas")
// Removi o BolaoService daqui para deixar a responsabilidade de busca no PartidaService
public class PartidaController {

    private final PartidaService partidaService;

    public PartidaController(PartidaService partidaService) {
        this.partidaService = partidaService;
    }

    @GetMapping("/bolao/{bolaoId}")
    public ResponseEntity<List<Partida>> listarPartidasPorBolao(@PathVariable UUID bolaoId) {
        try {
            List<Partida> partidas = partidaService.buscarPartidasDoBolao(bolaoId);
            return ResponseEntity.ok(partidas);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}