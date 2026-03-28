package com.yg.share_your_portfolio.api_server.domain.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.HoldingId
import com.yg.share_your_portfolio.api_server.domain.vo.Money
import java.math.BigDecimal

class Holding(
    val holdingId: HoldingId,
    val accountId: AccountId,
    val asset: Asset,
    quantity: BigDecimal,
    averageBuyPrice: Money,
    currentPrice: Money,
) {
    var quantity: BigDecimal = quantity
        private set
    var averageBuyPrice: Money = averageBuyPrice
        private set
    var currentPrice: Money = currentPrice
        private set

    fun getRateOfReturn(): BigDecimal {
        return (currentPrice.amount - averageBuyPrice.amount) / averageBuyPrice.amount
    }
}
