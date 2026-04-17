package com.bolaofc.bolaofc.controller;

import com.bolaofc.bolaofc.bolao.*;
import com.bolaofc.bolaofc.user.User;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/bolao")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BolaoController {

    private final BolaoService bolaoService;
    private final BolaoRepository bolaoRepository;
    private final BolaoParticipanteRepository bolaoParticipanteRepository;

    public BolaoController(BolaoService bolaoService, BolaoRepository bolaoRepository, BolaoParticipanteRepository bolaoParticipanteRepository) {
        this.bolaoService = bolaoService;
        this.bolaoRepository = bolaoRepository;
        this.bolaoParticipanteRepository = bolaoParticipanteRepository;
    }

    @PostMapping("/criar")
    public ResponseEntity<Bolao> criarBolao(@RequestBody BolaoRequestDTO dados){
        var user = getUsuarioLogado();
        if (user == null) return ResponseEntity.status(401).build();

        var bolaoSalvo = bolaoService.criarBolao(dados, user);
        return ResponseEntity.ok(bolaoSalvo);
    }

    @PostMapping("/entrar")
    @Transactional
    public ResponseEntity<?> entrarNoBolao(@RequestBody EntrarBolaoDTO dados) {
        var user = getUsuarioLogado();
        if (user == null) return ResponseEntity.status(401).build();

        Bolao bolao = bolaoRepository.findByCodigoConvite(dados.codigoConvite());
        if (bolao == null) return ResponseEntity.status(404).body("Bolão não encontrado ou código inválido");

        boolean jaParticipa = bolaoParticipanteRepository.existsByUserIdAndBolaoId(user.getId(), bolao.getId());
        if (!jaParticipa) {
            BolaoParticipante participante = new BolaoParticipante();
            participante.setUser(user);
            participante.setBolao(bolao);
            participante.setPontosTotal(0L);
            bolaoParticipanteRepository.save(participante);
        }
        return ResponseEntity.ok(bolao);
    }



    @GetMapping("/meus")
    public ResponseEntity<List<BolaoResponseDTO>> listarMeusBoloes() {
        var user = getUsuarioLogado();
        if (user == null) return ResponseEntity.status(401).build();

        List<BolaoResponseDTO> boloes = bolaoService.listarBoloesDoUsuario(user.getId())
                .stream().map(BolaoResponseDTO::from).toList();
        return ResponseEntity.ok(boloes);
    }

    @GetMapping("/publicos")
    public ResponseEntity<List<BolaoResponseDTO>> listarBoloesPublicos(
            @RequestParam(required = false) List<String> ligas) {
        var user = getUsuarioLogado();
        if (user == null) return ResponseEntity.status(401).build();

        List<BolaoResponseDTO> publicos = bolaoService.listarBoloesPublicos(ligas, user.getId())
                .stream().map(BolaoResponseDTO::from).toList();
        return ResponseEntity.ok(publicos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BolaoResponseDTO> buscarPorId(@PathVariable UUID id) {
        return bolaoService.buscarPorId(id)
                .map(BolaoResponseDTO::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private User getUsuarioLogado() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            return null;
        }
        return (User) auth.getPrincipal();
    }

    public record EntrarBolaoDTO(String codigoConvite) {}
}