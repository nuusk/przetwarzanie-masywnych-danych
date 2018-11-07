FROM node

WORKDIR /usr/src/app

# Initialize project, download all packages
COPY package*.json ./
RUN npm install

# Copy the rest of source code (services etc.)
COPY . .

# Map the machine port 5000 to our app's port 5000
EXPOSE 5000

CMD ["npm", "start"]