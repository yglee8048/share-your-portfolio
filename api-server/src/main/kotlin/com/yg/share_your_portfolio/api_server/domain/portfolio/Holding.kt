package com.yg.share_your_portfolio.api_server.domain.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.HoldingId
import java.math.BigDecimal
import java.math.RoundingMode

class Holding(
    val holdingId: HoldingId,
    val accountId: AccountId,
    val asset: Asset,
    val principalValue: BigDecimal,
    val currentValue: BigDecimal?,
) {
    val unrealizedGain: BigDecimal? = currentValue?.minus(principalValue)

    fun getProfitRate(): BigDecimal? {
        if (currentValue == null || principalValue == BigDecimal.ZERO) return null
        return (currentValue - principalValue)
            .divide(principalValue, 4, RoundingMode.HALF_UP)
            .multiply(BigDecimal(100))
            .setScale(2, RoundingMode.HALF_UP)
    }
}
