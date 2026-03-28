package com.yg.share_your_portfolio.api_server.domain.market

import com.yg.share_your_portfolio.api_server.domain.vo.Currency
import java.math.BigDecimal
import java.time.LocalDateTime

class ExchangeRate(
    val currency: Currency,
    rateToKrw: BigDecimal,
    updatedAt: LocalDateTime,
) {
    var rateToKrw: BigDecimal = rateToKrw
        private set
    var updatedAt: LocalDateTime = updatedAt
        private set

    fun update(rateToKrw: BigDecimal) {
        require(rateToKrw != BigDecimal.ZERO) { "환율은 0 일 수 없습니다." }
        this.rateToKrw = rateToKrw
        this.updatedAt = LocalDateTime.now()
    }
}
