FROM node
WORKDIR /

# Install the dependencies for building
COPY package*.json /
COPY backend/package*.json /backend/
COPY frontend/package*.json /frontend/
COPY backend/prisma/schema.prisma /backend/prisma/schema.prisma

RUN npm install --include=dev

WORKDIR /backend
RUN npm install --include=dev
RUN npm install -g typescript
RUN npx prisma generate

WORKDIR /frontend
RUN npm install --include=dev

# Create the dist folder and install the packages/build prisma client
COPY backend/package*.json /dist/backend/
WORKDIR /dist/backend
RUN npm install
COPY backend/prisma/schema.prisma /dist/backend/prisma/schema.prisma
RUN npx prisma generate
RUN npx prisma migrate deploy

# Copy the source code and build the application
COPY . /
WORKDIR /backend
RUN tsc
WORKDIR /frontend
RUN npx ng build --configuration=production

# Start the server and expose the ports
WORKDIR /
EXPOSE 80 443
CMD node dist/backend/index