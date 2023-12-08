FROM node:18-alpine as builder

WORKDIR /app

COPY ["package.json","package-lock.json","./"]

RUN npm install

COPY ["public","./public"]
COPY ["src","./src"]
COPY [".env","./"]
COPY ["index.html","postcss.config.js","tailwind.config.js","tsconfig.json","tsconfig.node.json", "vite.config.ts","./"]

ENV NODE_ENV=production

RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]



