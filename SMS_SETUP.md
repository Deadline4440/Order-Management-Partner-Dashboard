# SMS Setup Guide

## Step 1: Get Twilio Credentials
1. Go to https://www.twilio.com/console
2. Sign up for a free account (get $20 credit)
3. Copy your:
   - **Account SID**
   - **Auth Token**
   - **Phone Number** (e.g., +1234567890)

## Step 2: Update .env.local
Add your Twilio credentials:
```
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## Step 3: Use in API Routes

### In Login Route:
```typescript
import { sendOtpSMS } from "@/lib/send-sms";

// When sending OTP
const smsSent = await sendOtpSMS(phoneNumber, otp);
```

### In Register Route:
```typescript
import { sendOtpSMS } from "@/lib/send-sms";

// When registering
const smsSent = await sendOtpSMS(phoneNumber, otp);
```

## Phone Number Format
Include country code:
- India: `+919876543210`
- US: `+11234567890`
- UK: `+441234567890`

## Development Mode
In development, OTP is logged to console (not actually sent):
```
📱 [SMS] OTP for +919721085784: 123456
```

## Production Mode
Set `NODE_ENV=production` to actually send SMS.

## Cost
- Outgoing SMS: ~$0.0075 per message in India
- Free trial credit: $20 (enough for ~2,666 messages)
