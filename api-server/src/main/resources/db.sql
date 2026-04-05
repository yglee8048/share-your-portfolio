CREATE TABLE accounts
(
    id               BIGSERIAL PRIMARY KEY,
    institution_code VARCHAR(50)  NOT NULL,
    account_number   VARCHAR(100) NOT NULL,
    type             VARCHAR(50)  NOT NULL,
    name             VARCHAR(100) NOT NULL,

    CONSTRAINT uq_accounts_institution_code_account_number
        UNIQUE (institution_code, account_number)
);

CREATE TABLE holdings
(
    id              BIGSERIAL PRIMARY KEY,
    account_id      BIGINT         NOT NULL,
    asset_ticker    VARCHAR(50)    NOT NULL,
    principal_value NUMERIC(19, 4) NOT NULL,
    current_value   NUMERIC(19, 4),

    CONSTRAINT fk_holdings_account
        FOREIGN KEY (account_id)
            REFERENCES accounts (id)
            ON DELETE CASCADE,

    CONSTRAINT uq_holdings_account_id_asset_ticker
        UNIQUE (account_id, asset_ticker)
);

CREATE INDEX idx_holdings_account_id
    ON holdings (account_id);

CREATE TABLE portfolios
(
    account_id  BIGINT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,

    CONSTRAINT fk_portfolios_account
        FOREIGN KEY (account_id)
            REFERENCES accounts (id)
            ON DELETE CASCADE
);

CREATE TABLE portfolio_items
(
    id           BIGSERIAL PRIMARY KEY,
    account_id   BIGINT        NOT NULL,
    asset_ticker VARCHAR(50)   NOT NULL,
    target_ratio NUMERIC(5, 2) NOT NULL,

    CONSTRAINT fk_portfolio_items_portfolio
        FOREIGN KEY (account_id)
            REFERENCES portfolios (account_id)
            ON DELETE CASCADE,

    CONSTRAINT uq_portfolio_items_account_id_asset_ticker
        UNIQUE (account_id, asset_ticker),

    CONSTRAINT ck_portfolio_items_target_ratio
        CHECK (target_ratio > 0 AND target_ratio <= 100)
);

CREATE INDEX idx_portfolio_items_account_id
    ON portfolio_items (account_id);
