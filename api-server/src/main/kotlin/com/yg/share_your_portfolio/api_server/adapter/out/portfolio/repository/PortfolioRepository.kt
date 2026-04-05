package com.yg.share_your_portfolio.api_server.adapter.out.portfolio.repository

import com.yg.share_your_portfolio.api_server.adapter.out.portfolio.entity.PortfolioEntity
import org.springframework.data.repository.CrudRepository

internal interface PortfolioRepository : CrudRepository<PortfolioEntity, Long> {
}
