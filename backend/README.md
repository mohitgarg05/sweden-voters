# Sweden Voters Backend API

Backend API for the Sweden Voters donation bars application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sweden-voters
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

3. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication (Public)

- `POST /api/auth/login` - Admin login (requires username and password)
- `GET /api/auth/verify` - Verify authentication token

### Bars

- `GET /api/bars` - Get all active bars (Public)
- `GET /api/bars/:id` - Get a specific bar (Public)
- `GET /api/bars/admin` - Get all bars including inactive (Protected - Admin only)
- `POST /api/bars` - Create a new bar (Protected - Admin only)
- `PUT /api/bars/:id` - Update a bar (Protected - Admin only)
- `DELETE /api/bars/:id` - Delete a bar (Protected - Admin only)

### Donations

- `POST /api/donations` - Create a new donation (Public)
- `GET /api/donations` - Get all donations (Protected - Admin only)
- `GET /api/donations/stats` - Get donation statistics (Protected - Admin only)
- `GET /api/donations/:id` - Get a specific donation (Protected - Admin only)

**Note:** Protected endpoints require Bearer token in Authorization header: `Authorization: Bearer <token>`

## Models

### Bar
- label (String, required)
- currentValue (Number, default: 0)
- swishNumber (String, required)
- paypalUser (String, required)
- isActive (Boolean, default: true)
- order (Number, default: 0)

### Donation
- barId (ObjectId, required, ref: Bar)
- amount (Number, required)
- paymentMethod (String, enum: ['swish', 'paypal', 'manual'])
- donorInfo (Object with name, email, message)

