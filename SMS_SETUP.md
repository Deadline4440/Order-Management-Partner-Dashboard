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
const smsSent = await sendOtpSMS(+91 9721085784, otp);
```

### In Register Route:
```typescript
import { sendOtpSMS } from "@/lib/send-sms";

// When registering
const smsSent = await sendOtpSMS(+91 9721085784, otp);
```

## Phone Number Format
Include country code:
- India: `+91 9721085784`
- US: `+11234567890`
- UK: `+441234567890`

## Development Mode
In development, OTP is logged to console (not actually sent):
```
📱 [SMS] OTP for +91 9721085784: 123456
```

## Production Mode
Set `NODE_ENV=production` to actually send SMS.

## Cost
- Outgoing SMS: ~$0.0075 per message in India
- Free trial credit: $20 (enough for ~2,666 messages)

## Quick local enable & test (OTP verification)

1. Copy `.env.example` to `.env.local` and fill your credentials. Example values:

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+919000000000
TWILIO_FORCE=false
NODE_ENV=development
```

2. If your `TWILIO_ACCOUNT_SID` was pasted with extra quotes or looks different (for example copied from some UIs), the app trims whitespace and quotes automatically. If it still doesn't start with `AC` but you want to force initialization for local testing, set:

```
TWILIO_FORCE=true
```

Warning: `TWILIO_FORCE=true` bypasses the simple SID check and should be used only for local testing with trusted credentials.

Note about development OTP behavior:

- By default the app will generate an OTP and log it to the server console in development. To display the OTP in the API response set `SHOW_DEV_OTP=true` and to show it in the client UI set `NEXT_PUBLIC_SHOW_DEV_OTP=true`.
- There is a separate quick-dev shortcut that *skips* OTP and auto-creates a verified user when `DEV_SKIP_OTP=true`. This is disabled by default. If you want to see OTPs in the terminal, ensure `DEV_SKIP_OTP` is not set to `true`.

3. Restart the dev server after changing `.env.local`:

```bash
npm run dev
```

4. Trigger an OTP send (example via app flow):
- Use the registration or login flow in the app UI which calls `POST /api/auth/register` or the OTP endpoint.
- In development, OTPs are logged to the server console when `NODE_ENV=development`.

5. To verify the end-to-end behavior in production-like mode (actually send SMS):
- Set `NODE_ENV=production` and ensure `TWILIO_ACCOUNT_SID` starts with `AC` and `TWILIO_AUTH_TOKEN` and `TWILIO_PHONE_NUMBER` are correct.
- Remove `TWILIO_FORCE` or set it to `false`.

6. Troubleshooting:
- If you see `TWILIO_ACCOUNT_SID looks invalid` in logs, confirm there are no surrounding quotes in `.env.local` and that the SID begins with `AC`.
- Check logs for `📱 [SMS] OTP` in development to get the OTP without sending SMS.

If you want, I can run a quick local test flow or add a small `curl` example to POST to the register endpoint.
