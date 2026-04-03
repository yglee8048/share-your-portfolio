package com.yg.share_your_portfolio.api_server.adapter.`in`.dto

import com.fasterxml.jackson.annotation.JsonProperty
import java.math.BigDecimal

data class CreateAccountRequest(
    @JsonProperty("institution_code") val institutionCode: String,
    @JsonProperty("account_number") val accountNumber: String,
    @JsonProperty("account_type_code") val accountTypeCode: String,
    @JsonProperty("account_name") val accountName: String,
)

data class AccountResponse(
    val id: Long,
    val institution: CodeLabelResponse,
    @JsonProperty("account_number") val accountNumber: String,
    @JsonProperty("account_type") val accountType: CodeLabelResponse,
    @JsonProperty("account_name") val accountName: String,
    @JsonProperty("holdings_count") val holdingsCount: Int,
    @JsonProperty("current_value_krw") val currentValueKrw: BigDecimal,
    @JsonProperty("principal_krw") val principalKrw: BigDecimal,
    @JsonProperty("profit_rate") val profitRate: BigDecimal,
)
