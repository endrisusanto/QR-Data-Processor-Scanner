# Stage 1: Build the application (Compile TypeScript)
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Stage 2: Production runtime environment
FROM node:20-alpine as production
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist
ENV PORT 3000
EXPOSE 3000
CMD ["npm", "start"]