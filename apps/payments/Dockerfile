FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm i -g pnpm

COPY apps/payments apps/payments
COPY libs libs

RUN pnpm i
RUN cd apps/payments && pnpm i

RUN pnpm run build payments

FROM node:alpine AS production

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm

RUN pnpm i --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/payments/main"]