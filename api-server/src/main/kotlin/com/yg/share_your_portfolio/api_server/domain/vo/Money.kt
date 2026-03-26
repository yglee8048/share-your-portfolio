package com.yg.share_your_portfolio.api_server.domain.vo

import java.math.BigDecimal

data class Money(
    val amount: BigDecimal,
    val currency: Currency,
)