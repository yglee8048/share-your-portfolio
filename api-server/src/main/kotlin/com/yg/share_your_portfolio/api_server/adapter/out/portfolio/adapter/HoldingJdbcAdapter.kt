package com.yg.share_your_portfolio.api_server.adapter.out.portfolio.adapter

import com.yg.share_your_portfolio.api_server.adapter.out.portfolio.entity.HoldingEntity
import com.yg.share_your_portfolio.api_server.adapter.out.portfolio.repository.HoldingRepository
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.HoldingPort
import com.yg.share_your_portfolio.api_server.domain.data.AssetHolders
import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.HoldingId
import com.yg.share_your_portfolio.api_server.domain.portfolio.Holding
import org.springframework.stereotype.Component

@Component
internal class HoldingJdbcAdapter(private val holdingRepository: HoldingRepository) : HoldingPort {

    override fun findByAccountId(accountId: AccountId): List<Holding> {
        return holdingRepository.findByAccountId(accountId.value).map { it.toDomain() }
    }

    override fun findById(id: HoldingId): Holding? {
        return holdingRepository.findById(id.value).map { it.toDomain() }.orElse(null)
    }

    override fun save(holding: Holding): Holding {
        val saved = holdingRepository.save(holding.toEntity())
        return saved.toDomain()
    }

    override fun delete(id: HoldingId) {
        holdingRepository.deleteById(id.value)
    }

    override fun deleteByAccountId(accountId: AccountId) {
        holdingRepository.deleteByAccountId(accountId.value)
    }
}

private fun HoldingEntity.toDomain() = Holding(
    holdingId = HoldingId(id!!),
    accountId = AccountId(accountId),
    asset = AssetHolders.findByTicker(assetTicker) ?: throw NoSuchElementException("존재하지 않는 종목: $assetTicker"),
    principalValue = principalValue,
    currentValue = currentValue,
)

private fun Holding.toEntity() = HoldingEntity(
    id = holdingId.value.takeIf { it != 0L },
    accountId = accountId.value,
    assetTicker = asset.name,
    principalValue = principalValue,
    currentValue = currentValue,
)
