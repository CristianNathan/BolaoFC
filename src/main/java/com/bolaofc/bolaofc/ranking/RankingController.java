package com.bolaofc.bolaofc.ranking;

import com.bolaofc.bolaofc.bolao.BolaoParticipante;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/bolaos")
@CrossOrigin("*")
public class RankingController {
    private final RankingService rankingService;
    public RankingController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    @GetMapping("/{bolaoId}/ranking")
    public ResponseEntity<List<RankingResponseDTO>> getRanking(@PathVariable UUID bolaoId) {
        List<BolaoParticipante> ranking = rankingService.obterRankingDoBolao(bolaoId);

        List<RankingResponseDTO> response = ranking.stream()
                .map(p -> new RankingResponseDTO(
                        p.getUser().getId(),
                        p.getUser().getNickname(),
                        p.getPontosTotal()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }


}
