package com.klef.soa.exam.service;

import java.util.List;
import com.klef.soa.exam.entity.LocalMarketStallEntity;

public interface LocalMarketStallService {

    LocalMarketStallEntity addStall(LocalMarketStallEntity stall);

    List<LocalMarketStallEntity> displayAll();

    String deleteStall(Long id);
}