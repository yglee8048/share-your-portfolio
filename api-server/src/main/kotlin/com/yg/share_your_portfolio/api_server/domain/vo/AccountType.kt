package com.yg.share_your_portfolio.api_server.domain.vo

enum class AccountType(
    val label: String,
) {
    DEMAND_DEPOSIT("입출금"),
    SUBSCRIPTION_ACCOUNT("청약통장"),
    CMA("CMA"),
    ISA("ISA"),
    IRP("IRP"),
    PENSION_FUND("연금저축펀드"),
    VARIABLE_ANNUITY("변액연금보험"),
    DC("DC"),
    DB("DB"),
    ;
}
