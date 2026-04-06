package com.bolaofc.bolaofc.transacao;

import com.bolaofc.bolaofc.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, UUID> {
    List<Transacao> findByUserIdOrderByCriadoemDesc(UUID userId);

}
