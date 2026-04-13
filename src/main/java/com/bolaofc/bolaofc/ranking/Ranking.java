package com.bolaofc.bolaofc.ranking;

import com.bolaofc.bolaofc.bolao.Bolao;
import com.bolaofc.bolaofc.user.User;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
public class Ranking {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private UUID id;
    @ManyToOne
    private Bolao bolao;
    @ManyToOne
    private User usuario;

    private Integer pontos =0;
    private Integer cheios = 0;

    public Ranking(){

    }

    public Ranking(UUID id, Bolao bolao, User usuario, Integer pontos, Integer cheios) {
        this.id = id;
        this.bolao = bolao;
        this.usuario = usuario;
        this.pontos = pontos;
        this.cheios = cheios;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Bolao getBolao() {
        return bolao;
    }

    public void setBolao(Bolao bolao) {
        this.bolao = bolao;
    }

    public User getUsuario() {
        return usuario;
    }

    public void setUsuario(User usuario) {
        this.usuario = usuario;
    }

    public Integer getPontos() {
        return pontos;
    }

    public void setPontos(Integer pontos) {
        this.pontos = pontos;
    }

    public Integer getCheios() {
        return cheios;
    }

    public void setCheios(Integer cheios) {
        this.cheios = cheios;
    }
}
