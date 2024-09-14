# Stage 1: Build the React application
FROM node:16-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./
# If you are using yarn, you can copy the yarn.lock file as well
# COPY package.json yarn.lock ./

# Install dependencies
RUN npm install
# If you are using yarn, use the following command instead
# RUN yarn install

# Copy the rest of the application's code
COPY . .

# Build the application
RUN npm run build
# If you are using yarn, use the following command instead
# RUN yarn build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy the build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx configuration file (if you have one)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx when the container has provisioned
CMD ["nginx", "-g", "daemon off;"]