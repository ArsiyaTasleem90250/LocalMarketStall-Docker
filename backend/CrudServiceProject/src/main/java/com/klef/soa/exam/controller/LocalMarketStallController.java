package com.klef.soa.exam.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.klef.soa.exam.entity.LocalMarketStallEntity;
import com.klef.soa.exam.service.LocalMarketStallService;

@RestController
public class LocalMarketStallController {

    private final LocalMarketStallService service;

    public LocalMarketStallController(
            LocalMarketStallService service) {
        this.service = service;
    }

    @GetMapping("/")
    public String home() {
        return "CRUD Service is running";
    }

    @PostMapping("/Add")
    public LocalMarketStallEntity addStall(@RequestBody LocalMarketStallEntity stall) {
        return service.addStall(stall);
    }

    @GetMapping("/DisplayAll")
    public List<LocalMarketStallEntity> displayAll() {
        return service.displayAll();
    }

    @DeleteMapping("/Delete/{id}")
    public String deleteStall(@PathVariable Long id) {
        return service.deleteStall(id);
    }
}