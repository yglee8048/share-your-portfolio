package com.yg.share_your_portfolio.api_server.domain.id

import com.yg.share_your_portfolio.api_server.domain.vo.Institution

data class AccountId(
    val institution: Institution,
    val accountNumber: String,
)
