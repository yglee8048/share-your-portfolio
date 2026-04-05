package com.yg.share_your_portfolio.api_server.application.port.out.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.portfolio.Portfolio

interface PortfolioPort {
    fun findByAccountId(accountId: AccountId): Portfolio?
    fun save(portfolio: Portfolio): Portfolio
    fun deleteByAccountId(accountId: AccountId)
}
