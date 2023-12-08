#builder stage

FROM node:18-alpine as builder

WORKDIR /app

COPY ["package.json","package-lock.json","./"]

RUN npm install

COPY ["src","./src"]

COPY ["tsconfig.json", "./"]

RUN npm run build

# final

FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV production

ENV PORT 5000

EXPOSE 5000

COPY --from=builder /app/package.json ./

COPY --from=builder /app/package-lock.json ./

RUN npm install --production

COPY --from=builder /app/dist ./dist

CMD [ "node", "dist/main.js"]