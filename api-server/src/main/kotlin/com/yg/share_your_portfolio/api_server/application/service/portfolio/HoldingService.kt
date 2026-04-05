package com.yg.share_your_portfolio.api_server.application.service.portfolio

import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.HoldingUseCase
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.ModifyHoldingCommand
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.AccountPort
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.HoldingPort
import com.yg.share_your_portfolio.api_server.domain.data.AssetHolders
import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.HoldingId
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
        accountPort.findById(accountId) ?: throw NoSuchElementException("존재하지 않는 계좌: $accountId")

        return holdingPort.findByAccountId(accountId)
    }

    @Transactional
    override fun createHolding(
        accountId: AccountId,
        command: ModifyHoldingCommand,
    ): Holding {
        accountPort.findById(accountId) ?: throw NoSuchElementException("존재하지 않는 계좌: $accountId")

        val asset = AssetHolders.findByTicker(command.assetTicker)

        val holding = Holding(
            holdingId = HoldingId(0L),
            accountId = accountId,
            asset = asset,
            principalValue = command.principalValue,
            currentValue = command.currentValue,
        )
        return holdingPort.save(holding)
    }

    @Transactional
    override fun updateHolding(
        accountId: AccountId,
        holdingId: HoldingId,
        command: ModifyHoldingCommand,
    ): Holding {
        val existing = holdingPort.findById(holdingId) ?: throw NoSuchElementException("존재하지 않는 종목: $holdingId")
        if (existing.accountId != accountId) {
            throw NoSuchElementException("요청된 계좌와 해당 종목의 계좌가 일치하지 않음: ${existing.accountId} != $accountId")
        }

        val asset = AssetHolders.findByTicker(command.assetTicker)

        val holding = Holding(
            holdingId = holdingId,
            accountId = accountId,
            asset = asset,
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
        val existing = holdingPort.findById(holdingId) ?: throw NoSuchElementException("존재하지 않는 종목: $holdingId")
        if (existing.accountId != accountId) {
            throw NoSuchElementException("요청된 계좌와 해당 종목의 계좌가 일치하지 않음: ${existing.accountId} != $accountId")
        }

        holdingPort.delete(holdingId)
    }
}
