package com.yg.share_your_portfolio.api_server.adapter.out.portfolio.repository

import com.yg.share_your_portfolio.api_server.adapter.out.portfolio.entity.HoldingEntity
import org.springframework.data.repository.CrudRepository

interface HoldingJdbcRepository : CrudRepository<HoldingEntity, Long> {
    fun findByAccountId(accountId: Long): List<HoldingEntity>
    fun deleteByAccountId(accountId: Long)
}
