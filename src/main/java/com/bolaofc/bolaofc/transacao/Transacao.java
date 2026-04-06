package com.bolaofc.bolaofc.transacao;

import com.bolaofc.bolaofc.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;
@Entity
@Table(name ="transacoes")
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Enumerated(EnumType.STRING)
    private Tipo tipo;
    private double valor;
    private String descricao;
    private LocalDateTime criadoem;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Transacao(){

    }

    public Transacao(UUID id, Tipo tipo, double valor, String descricao, LocalDateTime criadoem, User user) {
        this.id = id;
        this.tipo = tipo;
        this.valor = valor;
        this.descricao = descricao;
        this.criadoem = criadoem;
        this.user = user;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Tipo getTipo() {
        return tipo;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getCriadoem() {
        return criadoem;
    }

    public void setCriadoem(LocalDateTime criadoem) {
        this.criadoem = criadoem;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
