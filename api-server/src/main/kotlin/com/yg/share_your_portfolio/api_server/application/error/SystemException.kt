package com.yg.share_your_portfolio.api_server.application.error

class SystemException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
