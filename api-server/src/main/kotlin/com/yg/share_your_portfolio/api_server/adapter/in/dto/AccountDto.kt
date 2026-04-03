package com.yg.share_your_portfolio.api_server.adapter.`in`.dto

import java.math.BigDecimal

data class CreateAccountRequest(
    val institutionCode: String,
    val accountNumber: String,
    val accountTypeCode: String,
    val accountName: String,
)

data class AccountResponse(
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
