package com.yg.share_your_portfolio.api_server.application.service.portfolio

import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.ModifyPortfolioCommand
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.PortfolioUseCase
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.AccountPort
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.HoldingPort
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.PortfolioPort
import com.yg.share_your_portfolio.api_server.domain.data.AssetHolders
import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.portfolio.Portfolio
import com.yg.share_your_portfolio.api_server.domain.portfolio.PortfolioGap
import com.yg.share_your_portfolio.api_server.domain.portfolio.PortfolioGapItem
import com.yg.share_your_portfolio.api_server.domain.portfolio.PortfolioItem
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.math.RoundingMode

@Service
internal class PortfolioService(
    private val accountPort: AccountPort,
    private val holdingPort: HoldingPort,
    private val portfolioPort: PortfolioPort,
) : PortfolioUseCase {

    @Transactional(readOnly = true)
    override fun getPortfolio(accountId: AccountId): Portfolio {
        return portfolioPort.findByAccountId(accountId)
            ?: throw NoSuchElementException("존재하지 않는 포트폴리오: $accountId")
    }

    @Transactional
    override fun modifyPortfolio(
        accountId: AccountId,
        command: ModifyPortfolioCommand,
    ): Portfolio {
        accountPort.findById(accountId) ?: throw NoSuchElementException("존재하지 않는 계좌: $accountId")

        val portfolio = Portfolio(
            accountId = accountId,
            name = command.name,
            description = command.description,
            items = command.items.map {
                PortfolioItem(
                    asset = AssetHolders.findByTicker(it.assetTicker),
                    targetRatio = it.targetRatio,
                )
            },
        )

        return portfolioPort.save(portfolio)
    }

    @Transactional
    override fun deletePortfolio(accountId: AccountId) {
        accountPort.findById(accountId) ?: throw NoSuchElementException("존재하지 않는 계좌: $accountId")

        portfolioPort.deleteByAccountId(accountId)
    }

    @Transactional(readOnly = true)
    override fun getPortfolioGap(accountId: AccountId): PortfolioGap {
        val portfolio = portfolioPort.findByAccountId(accountId)
            ?: throw NoSuchElementException("존재하지 않는 포트폴리오: $accountId")

        val holdings = holdingPort.findByAccountId(accountId)
        val totalCurrentValue = holdings.sumOf { it.currentValue ?: BigDecimal.ZERO }
        val holdingsByTicker = holdings.groupBy { it.asset.ticker }

        val items = portfolio.items.map { item ->
            val currentAmount = holdingsByTicker[item.asset.ticker]
                ?.sumOf { it.currentValue ?: BigDecimal.ZERO }
                ?: BigDecimal.ZERO

            val currentRatio = if (totalCurrentValue > BigDecimal.ZERO) {
                currentAmount.divide(totalCurrentValue, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal(100))
                    .setScale(2, RoundingMode.HALF_UP)
            } else {
                BigDecimal.ZERO
            }

            val targetAmount = if (totalCurrentValue > BigDecimal.ZERO) {
                totalCurrentValue.multiply(item.targetRatio)
                    .divide(BigDecimal(100), 2, RoundingMode.HALF_UP)
            } else {
                BigDecimal.ZERO
            }

            PortfolioGapItem(
                asset = item.asset,
                targetRatio = item.targetRatio,
                currentRatio = currentRatio,
                gap = (item.targetRatio - currentRatio).abs(),
                targetAmount = targetAmount,
                currentAmount = currentAmount,
            )
        }

        return PortfolioGap(items = items)
    }
}
