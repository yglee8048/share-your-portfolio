package com.yg.share_your_portfolio.api_server.application.port.out.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.HoldingId
import com.yg.share_your_portfolio.api_server.domain.portfolio.Holding

interface HoldingPort {
    fun findByAccountId(accountId: AccountId): List<Holding>
    fun findById(id: HoldingId): Holding?
    fun save(holding: Holding): Holding
    fun delete(id: HoldingId)
    fun deleteByAccountId(accountId: AccountId)
}
