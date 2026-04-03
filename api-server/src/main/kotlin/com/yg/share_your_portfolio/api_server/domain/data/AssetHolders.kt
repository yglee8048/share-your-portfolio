package com.yg.share_your_portfolio.api_server.domain.data

import com.yg.share_your_portfolio.api_server.domain.portfolio.Asset
import com.yg.share_your_portfolio.api_server.domain.vo.AssetType

class AssetHolders {
    companion object {
        val assets = listOf(
            Asset("379810", "KODEX 미국나스닥100", AssetType.FOREIGN_STOCK, true),
            Asset("379800", "KODEX 미국S&P500", AssetType.FOREIGN_STOCK, true),
            Asset("458730", "TIGER 미국배당 다우존스", AssetType.FOREIGN_STOCK, true),
            Asset("251350", "KODEX MSCI선진국", AssetType.FOREIGN_STOCK, true),
            Asset("195980", "PLUS 신흥국MSCI(합성 H)", AssetType.FOREIGN_STOCK, false),
            Asset("371160", "TIGER 차이나항셍테크", AssetType.FOREIGN_STOCK, true),
            Asset("428510", "KODEX 차이나AI테크액티브", AssetType.FOREIGN_STOCK, true),
            Asset("453870", "TIGER 인도니프티50", AssetType.FOREIGN_STOCK, true),
            Asset("411060", "ACE KRX금현물", AssetType.GOLD, true),
            Asset("276000", "TIGER 글로벌자원생산기업(합성H)", AssetType.COMMODITY, false),
            Asset("273130", "KODEX 종합채권(AA-이상)액티브", AssetType.DOMESTIC_BOND, false),
            Asset("459580", "KODEX CD금리액티브(합성)", AssetType.RP, false),
            Asset("357870", "TIGER CD금리투자KIS(합성)", AssetType.RP, false),
            Asset("477080", "RISE CD금리액티브(합성)", AssetType.RP, false),
            Asset("999999", "현금", AssetType.CASH, false),
        )

        fun findByTicker(ticker: String): Asset? = assets.find { it.ticker == ticker }
    }
}
