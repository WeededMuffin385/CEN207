CREATE TABLE accounts
(
    id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE account_sessions
(
    token      BYTEA PRIMARY KEY,
    account_id BIGINT      NOT NULL REFERENCES accounts (id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '12 hours'
);

CREATE TYPE account_identity_provider AS ENUM (
    'google',
    'guest'
);

CREATE TABLE account_identities
(
    account_id          BIGINT                    NOT NULL REFERENCES accounts (id),
    provider            account_identity_provider NOT NULL,
    provider_account_id TEXT                      NOT NULL,

    created_at          TIMESTAMPTZ               NOT NULL DEFAULT NOW(),

    PRIMARY KEY (account_id, provider),
    UNIQUE (provider, provider_account_id)
);

