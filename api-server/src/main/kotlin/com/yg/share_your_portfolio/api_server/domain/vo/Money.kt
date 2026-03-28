package com.yg.share_your_portfolio.api_server.domain.vo

import java.math.BigDecimal
import java.math.RoundingMode

data class Money(
    val amount: BigDecimal,
    val currency: Currency,
) {
    init {
        amount.setScale(2, RoundingMode.HALF_UP)
    }

    private fun checkCurrency(other: Money) {
        require(this.currency == other.currency) {
            "통화가 다릅니다: ${this.currency} vs ${other.currency}"
        }
    }

    operator fun plus(other: Money): Money {
        checkCurrency(other)
        return Money(this.amount + other.amount, currency)
    }

    operator fun minus(other: Money): Money {
        checkCurrency(other)
        return Money(this.amount - other.amount, currency)
    }

    operator fun times(multiplier: BigDecimal): Money {
        return Money(this.amount.multiply(multiplier), currency)
    }

    operator fun div(divisor: BigDecimal): Money {
        return Money(
            this.amount.divide(divisor, 2, RoundingMode.HALF_UP),
            currency,
        )
    }
}
