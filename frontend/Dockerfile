# Stage 1: Build the React application
FROM node:20-alpine as build
WORKDIR /app

# Copy lock file and package.json to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build 

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy the built application from the previous stage to Nginx's web root
COPY --from=build /app/dist /usr/share/nginx/html

# Remove default nginx config and copy the custom configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Nginx default)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]