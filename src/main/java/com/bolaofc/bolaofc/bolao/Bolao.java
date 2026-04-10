package com.bolaofc.bolaofc.bolao;

import com.bolaofc.bolaofc.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;
@Entity
@Table(name = "bolaos")
public class Bolao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String nome;
    private String codigoConvite;
    @Enumerated(EnumType.STRING)
    private Status status;
    private LocalDateTime criadoEm;
    @ManyToOne
    @JoinColumn(name = "dono_id")
    private User dono;



    public Bolao(){

    }

    public Bolao(UUID id, String nome, String codigoConvite, Status status, LocalDateTime criadoEm, User dono) {
        this.id = id;
        this.nome = nome;
        this.codigoConvite = codigoConvite;
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
