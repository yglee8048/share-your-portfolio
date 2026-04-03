package com.yg.share_your_portfolio.api_server.application.service.meta

import com.yg.share_your_portfolio.api_server.application.port.`in`.meta.MetaUseCase
import com.yg.share_your_portfolio.api_server.domain.data.AssetHolders
import com.yg.share_your_portfolio.api_server.domain.portfolio.Asset
import com.yg.share_your_portfolio.api_server.domain.vo.AccountType
import com.yg.share_your_portfolio.api_server.domain.vo.AssetType
import com.yg.share_your_portfolio.api_server.domain.vo.Institution
import org.springframework.stereotype.Service

@Service
internal class MetaService : MetaUseCase {

    override fun getInstitutions(): List<Institution> = Institution.entries

    override fun getAccountTypes(): List<AccountType> = AccountType.entries

    override fun getAssetTypes(): List<AssetType> = AssetType.entries

    override fun searchAssets(query: String): List<Asset> = AssetHolders.assets
        .filter { it.name.contains(query, ignoreCase = true) }
        .take(10)
}
