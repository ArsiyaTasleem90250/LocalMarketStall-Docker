package com.klef.soa.exam.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.klef.soa.exam.entity.LocalMarketStallEntity;
import com.klef.soa.exam.repository.LocalMarketStallRepository;

@Service
public class LocalMarketStallServiceImpl
        implements LocalMarketStallService {

    private final LocalMarketStallRepository repository;

    public LocalMarketStallServiceImpl(
            LocalMarketStallRepository repository) {
        this.repository = repository;
    }

    @Override
    public LocalMarketStallEntity addStall(
            LocalMarketStallEntity stall) {
        stall.setId(null);
        return repository.save(stall);
    }

    @Override
    public List<LocalMarketStallEntity> displayAll() {
        return repository.findAll();
    }

    @Override
    public String deleteStall(Long id) {
        if (repository.existsById(id)) 
        {
            repository.deleteById(id);
            return "Stall deleted successfully";
        } 
        else 
        {
            return "Stall not found with ID: " + id;
        }
    }
}