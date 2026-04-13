package com.bolaofc.bolaofc.ranking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RankingService {
    @Autowired
    private RankingRepository rankingRepository;

    public List<Ranking> obterRankingDoBolao(UUID bolaoId) {
        return rankingRepository.findByBolaoIdOrderByPontos(bolaoId);
    }
}
