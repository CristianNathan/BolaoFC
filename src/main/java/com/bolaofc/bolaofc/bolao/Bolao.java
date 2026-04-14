package com.bolaofc.bolaofc.bolao;

import com.bolaofc.bolaofc.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "bolaos")
public class Bolao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String nome;

    @Column(unique = true)
    private String codigoConvite;

    private Integer pontosPlacarExato;
    private Integer pontosVencedor;

    private Integer maxParticipantes;
    private Boolean privado;

    @ElementCollection
    private List<String> ligasPermitidas;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime criadoEm;


    @ManyToOne
    @JoinColumn(name = "dono_id")
    private User dono;


    public Bolao() {
        this.criadoEm = LocalDateTime.now();
    }

    public Bolao(UUID id, String nome, String codigoConvite, Integer pontosPlacarExato, Integer pontosVencedor, Integer maxParticipantes, Boolean privado, List<String> ligasPermitidas, Status status, LocalDateTime criadoEm, User dono) {
        this.id = id;
        this.nome = nome;
        this.codigoConvite = codigoConvite;
        this.pontosPlacarExato = pontosPlacarExato;
        this.pontosVencedor = pontosVencedor;
        this.maxParticipantes = maxParticipantes;
        this.privado = privado;
        this.ligasPermitidas = ligasPermitidas;
        this.status = status;
        this.criadoEm = criadoEm;
        this.dono = dono;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCodigoConvite() {
        return codigoConvite;
    }

    public void setCodigoConvite(String codigoConvite) {
        this.codigoConvite = codigoConvite;
    }

    public Integer getPontosPlacarExato() {
        return pontosPlacarExato;
    }

    public void setPontosPlacarExato(Integer pontosPlacarExato) {
        this.pontosPlacarExato = pontosPlacarExato;
    }

    public Integer getPontosVencedor() {
        return pontosVencedor;
    }

    public void setPontosVencedor(Integer pontosVencedor) {
        this.pontosVencedor = pontosVencedor;
    }

    public Integer getMaxParticipantes() {
        return maxParticipantes;
    }

    public void setMaxParticipantes(Integer maxParticipantes) {
        this.maxParticipantes = maxParticipantes;
    }

    public Boolean getPrivado() {
        return privado;
    }

    public void setPrivado(Boolean privado) {
        this.privado = privado;
    }

    public List<String> getLigasPermitidas() {
        return ligasPermitidas;
    }

    public void setLigasPermitidas(List<String> ligasPermitidas) {
        this.ligasPermitidas = ligasPermitidas;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public User getDono() {
        return dono;
    }

    public void setDono(User dono) {
        this.dono = dono;
    }

}