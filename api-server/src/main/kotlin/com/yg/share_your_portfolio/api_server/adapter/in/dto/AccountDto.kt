package com.yg.share_your_portfolio.api_server.adapter.`in`.dto

import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.AccountSummary
import java.math.BigDecimal

internal data class AccountResponse(
    val id: Long,
    val institution: CodeLabelResponse,
    val accountNumber: String,
    val accountType: CodeLabelResponse,
    val accountName: String,
    val holdingsCount: Int,
    val currentValueKrw: BigDecimal,
    val principalKrw: BigDecimal,
    val profitRate: BigDecimal,
)

internal fun AccountSummary.toResponse() = AccountResponse(
    id = account.id.value,
    institution = CodeLabelResponse(account.institution.name, account.institution.label),
    accountNumber = maskAccountNumber(account.accountNumber),
    accountType = CodeLabelResponse(account.type.name, account.type.label),
    accountName = account.name,
    holdingsCount = holdingsCount,
    currentValueKrw = currentValueKrw,
    principalKrw = principalKrw,
    profitRate = profitRate,
)

internal fun maskAccountNumber(accountNumber: String): String {
    val last4 = accountNumber.takeLast(4)
    return "****-****-$last4"
}

