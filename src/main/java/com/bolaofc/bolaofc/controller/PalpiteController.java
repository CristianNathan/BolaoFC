package com.bolaofc.bolaofc.controller;

import com.bolaofc.bolaofc.palpite.Palpite;
import com.bolaofc.bolaofc.palpite.PalpiteService;
import com.bolaofc.bolaofc.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class PalpiteController {
    private final PalpiteService palpiteService;

    public PalpiteController(PalpiteService palpiteService) {
        this.palpiteService = palpiteService;
    }
    @PostMapping("/palpites")
    public ResponseEntity palpites(@RequestBody Palpite palpite){
        var usuarios = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Palpite novoPalpite = palpiteService.fazerPalpite(palpite,usuarios);
        return ResponseEntity.ok(novoPalpite);
    }
}