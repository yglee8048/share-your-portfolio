package com.yg.share_your_portfolio.api_server.adapter.out.portfolio.repository

import com.yg.share_your_portfolio.api_server.adapter.out.portfolio.entity.PortfolioItemEntity
import org.springframework.data.repository.CrudRepository
import java.util.*

internal interface PortfolioItemRepository : CrudRepository<PortfolioItemEntity, Long> {

    fun findAllByAccountId(accountId: Long): List<PortfolioItemEntity>
    fun findByAccountIdAndAssetTicker(
        accountId: Long,
        assetTicker: String,
    ): Optional<PortfolioItemEntity>

    fun deleteAllByAccountId(accountId: Long)
}
