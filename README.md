# Mini API Rate Limiter

## Algorithm

This uses a **Sliding Window Counter** algorithm with Redis Sorted Sets:
1. **Data Structure**: Uses Redis Sorted Sets (ZSET) where:
   - **Key**: Client IP address
   - **Score**: Timestamp of the request
   - **Member**: Timestamp as string (distinct)

2. **Window Management**:
   - **Window Size**: Configurable time window 
   - **Max Requests**: Maximum allowed requests within the window

3. **Request Processing Flow**:
   ```
   For each incoming request:
   1. Extract client IP address & Get current timestamp
   3. Remove expired entries (older than window size)
   4. Count remaining entries in the window
   5. Check if count exceeds maximum allowed requests
   6. If limit exceeded → Return 429 (Too Many Requests)
   7. If within limit → Add current request timestamp and proceed
   8. Set expiration for the key to auto-cleanup
   ```

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: Redis (Upstash)
- **Security**: Helmet.js, CORS
- **Containerization**: Docker & Docker Compose

## Setup

### Environment Variables
```env
# Server Configuration
PORT=8000

# Redis Configuration (Upstash)
UPSTASH_REDIS_REST_URL=upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=upstash_redis_token

# Rate Limiting Configuration
WINDOW_SIZE=60000
MAX_REQUESTS=100
```


### Using Docker Compose 

1. **Clone the repository**:
   ```bash
   git clone https://github.com/LakshaySharma10/Rate-limiter
   cd RateLimiter
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

4. **Run in detached mode**:
   ```bash
   docker-compose up -d --build
   ```

### Using Docker Commands

1. **Build the Docker image**:
   ```bash
   docker build -t rate-limiter .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
   --name rate-limiter \
   -p 8000:8000 \
   --env-file .env \
   lakshay7004/ratelimiter:latest
   ```
## 📡 API Endpoints

### GET /
- **Description**: Test endpoint to verify rate limiting
- **Rate Limit**: Applied based on configuration
- **Response**: `"API request successful."`

### Rate Limit Response
When rate limit is exceeded:
```json
{
  "error": "Too many requests."
}
```
