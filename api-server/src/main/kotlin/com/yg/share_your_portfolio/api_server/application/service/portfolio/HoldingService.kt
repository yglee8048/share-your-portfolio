package com.yg.share_your_portfolio.api_server.application.service.portfolio

import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.CreateHoldingCommand
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.HoldingUseCase
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.UpdateHoldingCommand
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.AccountPort
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.HoldingPort
import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.HoldingId
import com.yg.share_your_portfolio.api_server.domain.portfolio.Asset
import com.yg.share_your_portfolio.api_server.domain.portfolio.Holding
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
internal class HoldingService(
    private val accountPort: AccountPort,
    private val holdingPort: HoldingPort,
) : HoldingUseCase {

    @Transactional(readOnly = true)
    override fun getHoldings(accountId: AccountId): List<Holding> {
        accountPort.findById(accountId) ?: throw NoSuchElementException()

        return holdingPort.findByAccountId(accountId)
    }

    @Transactional
    override fun createHolding(
        accountId: AccountId,
        command: CreateHoldingCommand,
    ): Holding {
        accountPort.findById(accountId) ?: throw NoSuchElementException()

        val holding = Holding(
            holdingId = HoldingId(0L),
            accountId = accountId,
            asset = Asset(
                name = command.name,
                type = command.assetType,
                currencyExposure = command.currencyExposure,
            ),
            principalValue = command.principalValue,
            currentValue = command.currentValue,
        )
        return holdingPort.save(holding)
    }

    @Transactional
    override fun updateHolding(
        accountId: AccountId,
        holdingId: HoldingId,
        command: UpdateHoldingCommand,
    ): Holding {
        val existing = holdingPort.findById(holdingId) ?: throw NoSuchElementException()
        if (existing.accountId != accountId) {
            throw NoSuchElementException()
        }

        val holding = Holding(
            holdingId = holdingId,
            accountId = accountId,
            asset = Asset(
                name = command.name,
                type = command.assetType,
                currencyExposure = command.currencyExposure,
            ),
            principalValue = command.principalValue,
            currentValue = command.currentValue,
        )
        return holdingPort.save(holding)
    }

    @Transactional
    override fun deleteHolding(
        accountId: AccountId,
        holdingId: HoldingId,
    ) {
        val existing = holdingPort.findById(holdingId) ?: throw NoSuchElementException("종목을 찾을 수 없습니다.")
        if (existing.accountId != accountId) {
            throw NoSuchElementException()
        }

        holdingPort.delete(holdingId)
    }
}
