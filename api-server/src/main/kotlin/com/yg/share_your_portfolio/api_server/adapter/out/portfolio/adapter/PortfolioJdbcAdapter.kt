package com.yg.share_your_portfolio.api_server.adapter.out.portfolio.adapter

import com.yg.share_your_portfolio.api_server.adapter.out.portfolio.entity.PortfolioEntity
import com.yg.share_your_portfolio.api_server.adapter.out.portfolio.entity.PortfolioItemEntity
import com.yg.share_your_portfolio.api_server.adapter.out.portfolio.repository.PortfolioItemRepository
import com.yg.share_your_portfolio.api_server.adapter.out.portfolio.repository.PortfolioRepository
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.PortfolioPort
import com.yg.share_your_portfolio.api_server.domain.data.AssetHolders
import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.AssetTicker
import com.yg.share_your_portfolio.api_server.domain.portfolio.Portfolio
import com.yg.share_your_portfolio.api_server.domain.portfolio.PortfolioItem
import org.springframework.data.jdbc.core.JdbcAggregateTemplate
import org.springframework.stereotype.Component

@Component
internal class PortfolioJdbcAdapter(
    private val portfolioRepository: PortfolioRepository,
    private val portfolioItemRepository: PortfolioItemRepository,
    private val jdbcAggregateTemplate: JdbcAggregateTemplate,
) : PortfolioPort {

    override fun findByAccountId(accountId: AccountId): Portfolio? {
        val items = portfolioItemRepository.findAllByAccountId(accountId.value)
            .map { it.toDomain() }

        return portfolioRepository.findById(accountId.value)
            .map { it.toDomain(items) }
            .orElse(null)
    }

    override fun save(portfolio: Portfolio): Portfolio {
        val accountId = portfolio.accountId.value

        if (portfolioRepository.existsById(accountId)) {
            portfolioRepository.save(portfolio.toEntity())
        } else {
            jdbcAggregateTemplate.insert(portfolio.toEntity())
        }

        portfolioItemRepository.deleteAllByAccountId(accountId)
        portfolio.items.forEach { item ->
            portfolioItemRepository.save(item.toEntity(accountId = portfolio.accountId))
        }

        return portfolio
    }

    override fun deleteByAccountId(accountId: AccountId) {
        portfolioItemRepository.deleteAllByAccountId(accountId.value)
        portfolioRepository.deleteById(accountId.value)
    }
}

private fun Portfolio.toEntity(): PortfolioEntity = PortfolioEntity(
    accountId = accountId.value,
    name = name,
    description = description,
)

private fun PortfolioItem.toEntity(accountId: AccountId, id: Long? = null): PortfolioItemEntity = PortfolioItemEntity(
    id = id,
    accountId = accountId.value,
    assetTicker = asset.ticker.value,
    targetRatio = targetRatio,
)

private fun PortfolioEntity.toDomain(items: List<PortfolioItem>): Portfolio = Portfolio(
    accountId = AccountId(accountId),
    name = name,
    description = description,
    items = items,
)

private fun PortfolioItemEntity.toDomain() = PortfolioItem(
    asset = AssetHolders.findByTicker(AssetTicker(assetTicker)),
    targetRatio = targetRatio,
)
