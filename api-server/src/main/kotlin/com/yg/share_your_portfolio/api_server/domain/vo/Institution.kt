package com.yg.share_your_portfolio.api_server.domain.vo

enum class Institution(
    val label: String,
) {
    NH_INVESTMENT_SECURITIES("NH나무증권"),
    MIRAE_ASSET_SECURITIES("미래에셋증권"),
    KOREA_INVESTMENT_SECURITIES("한국투자증권"),
    MIRAE_ASSET_INSURANCE("미래에셋보험"),
    KAKAO_BANK("카카오뱅크"),
    NH_BANK("농협은행"),
    SHINHAN_BANK("신한은행"),
    NAVER_PAY("네이버페이"),
    KAKAO_PAY("카카오페이"),
    ;
}
