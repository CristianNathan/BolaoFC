package com.bolaofc.bolaofc.partida;

import com.bolaofc.bolaofc.bolao.Bolao;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name ="partidas")
public class Partida {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String timeCasa;
    private String timeFora;
    private Integer golsCasa;
    private Integer golsFora;
    @Enumerated(EnumType.STRING)
    private StatusPartida status;
    private LocalDateTime dataPartida;
    @ManyToOne
    @JoinColumn(name = "bolao_id")
    private Bolao bolao;

    public Partida(){

    }

    public Partida(UUID id, String timeCasa, String timeFora, Integer golsCasa, Integer golsFora, StatusPartida status, LocalDateTime dataPartida, Bolao bolao) {
        this.id = id;
        this.timeCasa = timeCasa;
        this.timeFora = timeFora;
        this.golsCasa = golsCasa;
        this.golsFora = golsFora;
        this.status = status;
        this.dataPartida = dataPartida;
        this.bolao = bolao;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTimeCasa() {
        return timeCasa;
    }

    public void setTimeCasa(String timeCasa) {
        this.timeCasa = timeCasa;
    }

    public String getTimeFora() {
        return timeFora;
    }

    public void setTimeFora(String timeFora) {
        this.timeFora = timeFora;
    }

    public Integer getGolsCasa() {
        return golsCasa;
    }

    public void setGolsCasa(Integer golsCasa) {
        this.golsCasa = golsCasa;
    }

    public Integer getGolsFora() {
        return golsFora;
    }

    public void setGolsFora(Integer golsFora) {
        this.golsFora = golsFora;
    }

    public StatusPartida getStatus() {
        return status;
    }

    public void setStatus(StatusPartida status) {
        this.status = status;
    }

    public LocalDateTime getDataPartida() {
        return dataPartida;
    }

    public void setDataPartida(LocalDateTime dataPartida) {
        this.dataPartida = dataPartida;
    }

    public Bolao getBolao() {
        return bolao;
    }

    public void setBolao(Bolao bolao) {
        this.bolao = bolao;
    }
}
