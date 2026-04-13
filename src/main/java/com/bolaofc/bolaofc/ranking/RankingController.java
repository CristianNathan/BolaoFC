package com.bolaofc.bolaofc.ranking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/bolaos")
@CrossOrigin("*")
public class RankingController {

    @Autowired
    private RankingService rankingService;

    @GetMapping("/{id}/ranking")
    public List<Ranking> getRanking(@PathVariable UUID id) {
        return rankingService.obterRankingDoBolao(id);
    }
}
