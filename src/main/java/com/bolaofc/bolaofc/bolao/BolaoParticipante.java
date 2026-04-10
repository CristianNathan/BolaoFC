package com.bolaofc.bolaofc.bolao;

import com.bolaofc.bolaofc.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table (name= "bolao_participante")
public class BolaoParticipante {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private Long pontosTotal;
    private LocalDateTime entrouEm;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "bolao_id")
    private Bolao bolao;

    public BolaoParticipante(){

    }

    public BolaoParticipante(UUID id, Long pontosTotal, LocalDateTime entrouEm, User user, Bolao bolao) {
        this.id = id;
        this.pontosTotal = pontosTotal;
        this.entrouEm = entrouEm;
        this.user = user;
        this.bolao = bolao;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Long getPontosTotal() {
        return pontosTotal;
    }

    public void setPontosTotal(Long pontosTotal) {
        this.pontosTotal = pontosTotal;
    }

    public LocalDateTime getEntrouEm() {
        return entrouEm;
    }

    public void setEntrouEm(LocalDateTime entrouEm) {
        this.entrouEm = entrouEm;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Bolao getBolao() {
        return bolao;
    }

    public void setBolao(Bolao bolao) {
        this.bolao = bolao;
    }
}
