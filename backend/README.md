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
```

3. Start the server:
```bash
npm run dev
```

## API Endpoints

### Bars

- `GET /api/bars` - Get all active bars
- `GET /api/bars/admin` - Get all bars (including inactive)
- `GET /api/bars/:id` - Get a specific bar
- `POST /api/bars` - Create a new bar
- `PUT /api/bars/:id` - Update a bar
- `DELETE /api/bars/:id` - Delete a bar

### Donations

- `POST /api/donations` - Create a new donation
- `GET /api/donations` - Get all donations (with optional query params: barId, limit, skip)
- `GET /api/donations/stats` - Get donation statistics
- `GET /api/donations/:id` - Get a specific donation

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

