package com.yg.share_your_portfolio.api_server.adapter.out.portfolio.repository

import com.yg.share_your_portfolio.api_server.adapter.out.portfolio.entity.AccountEntity
import org.springframework.data.repository.CrudRepository

interface AccountJdbcRepository : CrudRepository<AccountEntity, Long>
