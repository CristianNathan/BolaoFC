package com.bolaofc.bolaofc.ranking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface RankingRepository extends JpaRepository<Ranking, UUID> {
    @Query("SELECT r FROM Ranking r WHERE r.bolao.id = :bolaoId ORDER BY r.pontos DESC, r.cheios DESC")
    List<Ranking> findByBolaoIdOrderByPontos(UUID bolaoId);
}
