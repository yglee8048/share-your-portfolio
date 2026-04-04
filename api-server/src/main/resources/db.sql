CREATE TABLE accounts
(
    id               BIGSERIAL PRIMARY KEY,
    institution_code VARCHAR(50)  NOT NULL,
    account_number   VARCHAR(100) NOT NULL,
    type             VARCHAR(50)  NOT NULL,
    name             VARCHAR(100) NOT NULL,

    CONSTRAINT uk_account_unique
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

    CONSTRAINT uk_holding_unique
        UNIQUE (account_id, asset_ticker)
);

CREATE INDEX idx_holdings_account_id ON holdings (account_id);
