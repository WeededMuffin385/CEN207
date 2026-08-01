# CEN207
Torrens University subject repository. Ecommerce system

# Prerequisites:
- [RustRover: Rust IDE by JetBrains](https://www.jetbrains.com/rust)
- Rust compiler
- Docker
- Node.js
- [pg-schema-diff](https://github.com/stripe/pg-schema-diff)
- Bash-compatible shell environment:
  - Arch Linux
  - WSL on Windows
- [Google Cloud Console](https://console.cloud.google.com)

# Setup
### 1. Create a new web client using Google Cloud Console Oauth 2.0 Clients panel and paste the document into the ./assets/google
1. Download the web client secret JSON document
2. Create a ./assets/google directory, if it does not exist
3. Move the document into the ./assets/google directoryW

```bash
(
  mkdir -p ./assets/google
  mkdir -p ./assets/database
)
```

### 2. Copy .env.template into .env for local development
```bash
(
  cp .env.template .env
)
```

### 3. Run the following script and select "yes" to apply SQL scheme for the database 

```bash
(
  docker compose up -d postgres
  until docker compose exec -T postgres pg_isready -U admin; do sleep 1; done
  
  bash ./scripts/database/plan.sh
  bash ./scripts/database/apply_hazardous.sh
)
```

### 4. Generate random product data for the database
```bash
(
  docker compose up -d postgres
  until docker compose exec -T postgres pg_isready -U admin; do sleep 1; done

  bash ./scripts/database/generate_test_data/products.sh
)
```

### 5. Install frontend dependencies

```bash
(
  cd frontend
  npm install
)
```

### 6. Build and run backend

```bash
(
  bash ./scripts/run_backend.sh
)
```
P.S.
Compilation and running of the backend is done via the same script that: 
1. compiles backend using Rust compiler, 
2. places binaries inside a docker image, 
3. runs the whole docker container, that consists of postgres database and the backend.

# Run
### 1. Run the backend
```bash
(
  bash ./scripts/run_backend.sh
)
```


### 2. Run the frontend
```bash
(
  cd frontend
  npm run dev &
  frontend_pid=$!
  
  until curl --fail --silent "http://localhost:5173/" >/dev/null; 
  do
    sleep 1
  done
  
  xdg-open "http://localhost:5173/"
  wait "$frontend_pid"
)
```

# Environment variables
- DEPLOYMENT_PROFILE=local
  - aws
  - local
  - local_aws
- RUST_LOG=trace
  - trace
  - debug
  - info

# Expected ports:
- 8080: backend
- 5173: frontend
- 5432: postgres
