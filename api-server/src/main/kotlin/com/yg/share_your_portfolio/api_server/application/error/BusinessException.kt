package com.yg.share_your_portfolio.api_server.application.error

class BusinessException(val errorCode: ErrorCode) : RuntimeException(errorCode.message)
