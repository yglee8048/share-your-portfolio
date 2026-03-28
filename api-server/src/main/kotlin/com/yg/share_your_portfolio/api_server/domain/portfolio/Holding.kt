package com.yg.share_your_portfolio.api_server.domain.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.HoldingId
import com.yg.share_your_portfolio.api_server.domain.vo.Asset
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

    fun buy(quantity: BigDecimal, price: Money) {
        val before = this.averageBuyPrice.amount * this.quantity
        val buy = price.amount * quantity
        val after = (before + buy) / (this.quantity + quantity)
        this.averageBuyPrice = this.averageBuyPrice.copy(amount = after)
        this.quantity += quantity
    }

    fun sell(quantity: BigDecimal) {
        require(this.quantity >= quantity) { "보유한 것보다 더 많이 팔 수 없습니다." }
        this.quantity -= quantity
    }

    fun getRateOfReturn(): BigDecimal {
        return (currentPrice.amount - averageBuyPrice.amount) / averageBuyPrice.amount
    }
}
