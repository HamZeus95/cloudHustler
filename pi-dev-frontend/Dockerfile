# Stage 1: Build Angular app
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build your Angular project. Adjust the project name if needed
RUN npm run build --prod

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config (you’ll create it next)
COPY nginx.conf /etc/nginx/conf.d

# Copy built Angular app from Stage 1
COPY --from=builder /app/dist/pi-dev-frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
