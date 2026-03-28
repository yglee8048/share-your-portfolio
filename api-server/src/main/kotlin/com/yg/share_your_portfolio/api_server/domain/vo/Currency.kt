package com.yg.share_your_portfolio.api_server.domain.vo

enum class Currency(
    val label: String,
) {
    KRW("원화"),
    USD("달러"),
    JPY("엔화"),
    EUR("유로"),
    CNY("위안화"),
    INR("루피"),
    ;
}
