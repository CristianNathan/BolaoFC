package com.bolaofc.bolaofc.ranking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/bolaos")
@CrossOrigin("*")
public class RankingController {

    @Autowired
    private RankingService rankingService;


}
