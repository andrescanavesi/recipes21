# Recipes Node

[![Build Status](https://travis-ci.com/andrescanavesi/recetas-node-back.svg?branch=master)](https://travis-ci.com/andrescanavesi/recetas-node-back)

# Environment configs

```bash
export R21_CACHE_DEBUG=false
export R21_CACHE_ENABLED=false
export R21_CACHE_DURATION="1 minute"
export DATABASE_URL=**********************
export R21_BASE_URL="http://localhost:3000/"
export R21_META_CACHE=1
export R21_IS_PRODUCTION=false
export R21_GOOGLE_CLIENT_ID=**********************
export R21_GOOGLE_CLIENT_SECRET=**********************
export R21_GOOGLE_CALLBACK_URL=http://localhost:3000/sso/google/callback
export PGSSLMODE=require
export R21_SESSION_SECRET=*****************
export R21_ADMIN_SECRET=***************** ## to excute some admin tasks
export R21_LOG_LEVEL="info"
```

# Packages

-   mocha
-   chai
-   chai-hhtp
-   nyc
-   mochawesome
-   npm-check
-   apicache
-   prettier
-   flexsearch

# Run tests

`npm tests`

# Cache

https://www.npmjs.com/package/apicache

http://localhost:3000/cache

http://localhost:3000/cache/clear

# CI
