# BUILD STAGE
FROM node:20.16-bookworm-slim AS build

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn global add @nestjs/cli@$(node -p "require('./package.json').devDependencies['@nestjs/cli']")

RUN yarn install --prod --frozen-lockfile

COPY . .

RUN yarn run build

# RUN STAGE (Distroless Image)
FROM gcr.io/distroless/nodejs20-debian11:nonroot AS production

WORKDIR /home/nonroot/application
# Copy files from build stage as nonroot (user/group)
COPY --from=build --chown=nonroot:nonroot /app/package.json ./package.json
COPY --from=build --chown=nonroot:nonroot /app/.env.example ./.env.example
COPY --from=build --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=build --chown=nonroot:nonroot /app/dist ./dist

EXPOSE 3000

USER nonroot
CMD [ "dist/main.js" ]
