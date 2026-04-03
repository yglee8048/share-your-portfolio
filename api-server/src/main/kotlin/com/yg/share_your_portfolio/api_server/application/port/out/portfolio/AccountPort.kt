package com.yg.share_your_portfolio.api_server.application.port.out.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.portfolio.Account

interface AccountPort {
    fun findAll(): List<Account>
    fun findById(id: AccountId): Account?
    fun save(account: Account): Account
    fun delete(id: AccountId)
}
