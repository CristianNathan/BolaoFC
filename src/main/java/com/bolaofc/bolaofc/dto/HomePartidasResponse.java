package com.bolaofc.bolaofc.dto;

import com.bolaofc.bolaofc.partida.Partida;

import java.util.List;

public class HomePartidasResponse {
    private List<Partida> aoVivo;
    private List<Partida> proximas;
    private List<Partida> finalizadas;

    public HomePartidasResponse(List<Partida> aoVivo, List<Partida> proximas, List<Partida> finalizadas) {
        this.aoVivo = aoVivo;
        this.proximas = proximas;
        this.finalizadas = finalizadas;
    }

    public List<Partida> getAoVivo() {
        return aoVivo;
    }

    public List<Partida> getProximas() {
        return proximas;
    }

    public List<Partida> getFinalizadas() {
        return finalizadas;
    }
}
