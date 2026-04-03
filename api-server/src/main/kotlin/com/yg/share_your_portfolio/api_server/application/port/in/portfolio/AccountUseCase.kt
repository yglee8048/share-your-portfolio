package com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.portfolio.Account
import com.yg.share_your_portfolio.api_server.domain.vo.AccountType
import com.yg.share_your_portfolio.api_server.domain.vo.Institution
import java.math.BigDecimal

interface AccountUseCase {
    fun getAccounts(): List<AccountSummary>

    fun getAccount(id: AccountId): AccountSummary

    fun createAccount(command: ModifyAccountCommand): AccountSummary

    fun updateAccount(
        id: AccountId,
        command: ModifyAccountCommand,
    ): AccountSummary

    fun deleteAccount(id: AccountId)
}

data class AccountSummary(
    val account: Account,
    val holdingsCount: Int,
    val currentValueKrw: BigDecimal,
    val principalKrw: BigDecimal,
    val profitRate: BigDecimal,
)

data class ModifyAccountCommand(
    val institution: Institution,
    val accountNumber: String,
    val accountType: AccountType,
    val accountName: String,
)
