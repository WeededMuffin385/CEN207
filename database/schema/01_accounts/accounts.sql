CREATE TABLE accounts
(
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL
);

CREATE TABLE account_sessions
(
    token      BYTEA PRIMARY KEY,
    account_id UUID        NOT NULL REFERENCES accounts (id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '12 hours'
);

CREATE TYPE account_identity_provider AS ENUM (
    'google',
    'guest'
);

CREATE TABLE account_identities
(
    account_id          UUID                      NOT NULL REFERENCES accounts (id),
    provider            account_identity_provider NOT NULL,
    provider_account_id TEXT                      NOT NULL,

    created_at          TIMESTAMPTZ               NOT NULL DEFAULT now(),

    PRIMARY KEY (account_id, provider),
    UNIQUE (provider, provider_account_id)
);

