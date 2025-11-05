# ---------- 建構階段 ----------
    FROM node:22-alpine AS builder

    WORKDIR /home/node
    COPY . .
    WORKDIR /home/node/server
    RUN npm install
    RUN npm run builda
    
    # ---------- 執行階段 ----------
    FROM node:22-alpine
    
    WORKDIR /app
    
    # 複製 server 的 package.json 並安裝（只裝 prod 相依）
    COPY server/package*.json ./server/
    RUN cd server && npm install --omit=dev
    
    # 複製編譯後產物與環境設定
    COPY --from=builder /home/node/server/dist ./server/dist
    COPY --from=builder /home/node/server/.env* ./server/
    
    # 設定執行環境
    ENV APP_ENV=prod
    EXPOSE 3000
    
    # 啟動 NestJS
    WORKDIR /app/server
    CMD ["node", "dist/main"]
    