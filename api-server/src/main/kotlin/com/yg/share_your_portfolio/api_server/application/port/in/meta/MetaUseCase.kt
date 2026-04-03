package com.yg.share_your_portfolio.api_server.application.port.`in`.meta

import com.yg.share_your_portfolio.api_server.domain.portfolio.Asset
import com.yg.share_your_portfolio.api_server.domain.vo.AccountType
import com.yg.share_your_portfolio.api_server.domain.vo.AssetType
import com.yg.share_your_portfolio.api_server.domain.vo.Institution

interface MetaUseCase {
    fun getInstitutions(): List<Institution>

    fun getAccountTypes(): List<AccountType>

    fun getAssetTypes(): List<AssetType>
    
    fun searchAssets(query: String): List<Asset>
}
