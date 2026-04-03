package com.yg.share_your_portfolio.api_server.adapter.out.portfolio.adapter

import com.yg.share_your_portfolio.api_server.adapter.out.portfolio.entity.HoldingEntity
import com.yg.share_your_portfolio.api_server.adapter.out.portfolio.repository.HoldingRepository
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.HoldingPort
import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.HoldingId
import com.yg.share_your_portfolio.api_server.domain.portfolio.Asset
import com.yg.share_your_portfolio.api_server.domain.portfolio.Holding
import com.yg.share_your_portfolio.api_server.domain.vo.AssetType
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
    asset = Asset(
        name = assetName,
        type = AssetType.valueOf(assetType),
        currencyExposure = currencyExposure,
    ),
    principalValue = principalValue,
    currentValue = currentValue,
)

private fun Holding.toEntity() = HoldingEntity(
    id = holdingId.value.takeIf { it != 0L },
    accountId = accountId.value,
    assetName = asset.name,
    assetType = asset.type.name,
    currencyExposure = asset.currencyExposure,
    principalValue = principalValue,
    currentValue = currentValue,
)
