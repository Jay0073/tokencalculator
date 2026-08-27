@echo off
setlocal

set "N8N_COMMUNITY_PACKAGES_MANAGED_BY_ENV="
set "N8N_COMMUNITY_PACKAGES="
set "N8N_UNVERIFIED_PACKAGES_ENABLED=true"
set "N8N_COMMUNITY_PACKAGES_ENABLED=true"
set "N8N_DISABLE_UI=false"
set "N8N_PORT=5678"
set "N8N_HOST=127.0.0.1"
set "N8N_SECURE_COOKIE=false"
set "N8N_USER_FOLDER=C:\Users\jay"

call "C:\Users\jay\Documents\projects\n8n-test\node_modules\.bin\n8n.cmd" start
