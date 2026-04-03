package com.yg.share_your_portfolio.api_server.domain.data

import com.yg.share_your_portfolio.api_server.domain.portfolio.Asset
import com.yg.share_your_portfolio.api_server.domain.vo.AssetType

class AssetHolders {
    companion object {
        val assets = listOf(
            Asset("KODEX 미국나스닥100", AssetType.FOREIGN_STOCK, true),
            Asset("KODEX 미국S&P500", AssetType.FOREIGN_STOCK, true),
            Asset("TIGER 미국배당 다우존스", AssetType.FOREIGN_STOCK, true),
            Asset("KODEX MSCI선진국", AssetType.FOREIGN_STOCK, true),
            Asset("PLUS 신흥국MSCI(합성)", AssetType.FOREIGN_STOCK, true),
            Asset("TIGER 차이나항셍테크", AssetType.FOREIGN_STOCK, true),
            Asset("KODEX 차이나AI테크액티브", AssetType.FOREIGN_STOCK, true),
            Asset("TIGER 인도니프티50", AssetType.FOREIGN_STOCK, true),
            Asset("KODEX KRX금현물", AssetType.GOLD, true),
            Asset("KODEX 글로벌자원생산기업(합성H)", AssetType.COMMODITY, false),
            Asset("KODEX 종합채권(AA-이상)", AssetType.DOMESTIC_BOND, false),
            Asset("KODEX CD금리액티브", AssetType.RP, false),
            Asset("TIGER CD금리투자KIS", AssetType.RP, false),
            Asset("RISE CD금리액티브", AssetType.RP, false),
            Asset("현금", AssetType.CASH, false),
        )
    }
}
