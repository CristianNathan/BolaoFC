package com.bolaofc.bolaofc.ranking;

import java.util.UUID;

public class RankingResponseDTO {
    private UUID id;
    private String nickname;
    private Long pontosTotal;

    public RankingResponseDTO(UUID id, String nickname, Long pontosTotal) {
        this.id = id;
        this.nickname = nickname;
        this.pontosTotal = pontosTotal;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public Long getPontosTotal() {
        return pontosTotal;
    }

    public void setPontosTotal(Long pontosTotal) {
        this.pontosTotal = pontosTotal;
    }
}
