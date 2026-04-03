package com.yg.share_your_portfolio.api_server.domain.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.HoldingId
import java.math.BigDecimal

class Holding(
    val holdingId: HoldingId,
    val accountId: AccountId,
    val asset: Asset,
    principalValue: BigDecimal,
    currentValue: BigDecimal,
) {
    var principalValue: BigDecimal = principalValue
        private set
    var currentValue: BigDecimal = currentValue
        private set

    fun getRateOfReturn(): BigDecimal {
        return (currentValue - principalValue) / principalValue
    }
}
