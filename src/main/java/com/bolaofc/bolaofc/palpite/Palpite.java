package com.bolaofc.bolaofc.palpite;

import com.bolaofc.bolaofc.bolao.Bolao;
import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.user.User;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "palpites")
public class Palpite {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Integer palpiteCasa;
    private Integer palpiteFora;
    private Integer pontosGanhos;

    @Enumerated(EnumType.STRING)
    private PalpitesStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "partida_id")
    private Partida partida;

    @ManyToOne
    @JoinColumn(name = "bolao_id")
    private Bolao bolao;

    public Palpite() {
    }

    public Palpite(UUID id, Integer palpiteCasa, Integer palpiteFora, Integer pontosGanhos,
                   PalpitesStatus status, User user, Partida partida, Bolao bolao) {
        this.id = id;
        this.palpiteCasa = palpiteCasa;
        this.palpiteFora = palpiteFora;
        this.pontosGanhos = pontosGanhos;
        this.status = status;
        this.user = user;
        this.partida = partida;
        this.bolao = bolao;
    }

    // GETTERS E SETTERS
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Integer getPalpiteCasa() {
        return palpiteCasa;
    }

    public void setPalpiteCasa(Integer palpiteCasa) {
        this.palpiteCasa = palpiteCasa;
    }

    public Integer getPalpiteFora() {
        return palpiteFora;
    }

    public void setPalpiteFora(Integer palpiteFora) {
        this.palpiteFora = palpiteFora;
    }

    public Integer getPontosGanhos() {
        return pontosGanhos;
    }

    public void setPontosGanhos(Integer pontosGanhos) {
        this.pontosGanhos = pontosGanhos;
    }

    public PalpitesStatus getStatus() {
        return status;
    }

    public void setStatus(PalpitesStatus status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Partida getPartida() {
        return partida;
    }

    public void setPartida(Partida partida) {
        this.partida = partida;
    }

    public Bolao getBolao() {
        return bolao;
    }

    public void setBolao(Bolao bolao) {
        this.bolao = bolao;
    }
}