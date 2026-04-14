package com.bolaofc.bolaofc.controller;

import com.bolaofc.bolaofc.bolao.Bolao;
import com.bolaofc.bolaofc.bolao.BolaoRequestDTO;
import com.bolaofc.bolaofc.bolao.BolaoService;
import com.bolaofc.bolaofc.user.User;
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

    public BolaoController(BolaoService bolaoService) {
        this.bolaoService = bolaoService;
    }

    @PostMapping("/criar")
    public ResponseEntity<Bolao> criarBolao(@RequestBody BolaoRequestDTO dados){
        var user = getUsuarioLogado();
        if (user == null) return ResponseEntity.status(401).build();

        var bolaoSalvo = bolaoService.criarBolao(dados, user);
        return ResponseEntity.ok(bolaoSalvo);
    }

    @PostMapping("/entrar")
    public ResponseEntity entrarNoBolao(@RequestBody EntrarBolaoDTO dados){
        var bolaoEncontrado = bolaoService.entrarNoBolao(dados.codigoConvite());
        if (bolaoEncontrado == null) {
            return ResponseEntity.status(404).body("Bolão não encontrado ou código inválido");
        }
        return ResponseEntity.ok(bolaoEncontrado);
    }

    @GetMapping("/meus")
    public ResponseEntity<List<Bolao>> listarMeusBoloes() {
        var user = getUsuarioLogado();
        if (user == null) return ResponseEntity.status(401).build();

        List<Bolao> boloes = bolaoService.listarBoloesDoUsuario(user.getId());
        return ResponseEntity.ok(boloes);
    }

    @GetMapping("/publicos")
    public ResponseEntity<List<Bolao>> listarBoloesPublicos() {
        List<Bolao> publicos = bolaoService.listarBoloesPublicos();
        return ResponseEntity.ok(publicos);
    }

    // MÉTODO QUE ESTAVA FALTANDO E DANDO ERRO 404
    @GetMapping("/{id}")
    public ResponseEntity<Bolao> buscarPorId(@PathVariable UUID id) {
        Optional<Bolao> bolaoOptional = bolaoService.buscarPorId(id);

        if (bolaoOptional.isPresent()) {
            return ResponseEntity.ok(bolaoOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
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