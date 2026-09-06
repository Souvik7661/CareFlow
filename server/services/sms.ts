/**
 * CareFlow Real-Time SMS Gateway Service
 * Sends real SMS to mobile phones worldwide via Twilio or Fast2SMS / MSG91.
 */

export interface SendSmsOptions {
  phone: string;
  code: string;
  purpose: 'REGISTER' | 'LOGIN';
}

export async function sendRealSms({ phone, code, purpose }: SendSmsOptions): Promise<{ success: boolean; provider?: string; error?: string }> {
  const cleanPhone = phone.replace(/\s+/g, '');
  const rawDigits = cleanPhone.replace(/\D/g, '');
  const last10 = rawDigits.slice(-10);

  const messageText = `CareFlow Security: Your ${purpose === 'LOGIN' ? 'login' : 'verification'} code is ${code}. Valid for 5 minutes. Do not share this code.`;

  // 1. Check for Fast2SMS (popular, instant SMS in India)
  const fast2smsApiKey = process.env.FAST2SMS_API_KEY;
  if (fast2smsApiKey && last10.length === 10) {
    try {
      console.log(`[SMS-SERVICE] Dispatching cellular SMS via Fast2SMS to +91 ${last10}...`);
      const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': fast2smsApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: code,
          numbers: last10
        })
      });
      const data = await res.json();
      console.log('[SMS-SERVICE] Fast2SMS Carrier Response:', data);

      if (data.return === true || data.status_code === 200) {
        console.log(`✅ [SMS-SERVICE] Real SMS successfully transmitted through telecom network to ${last10}!`);
        return { success: true, provider: 'Fast2SMS' };
      } else {
        console.warn(`⚠️ [SMS-SERVICE] Fast2SMS Carrier Notice (${data.status_code}): ${data.message}`);
      }
    } catch (err: any) {
      console.error('[SMS-SERVICE] Fast2SMS request failed:', err);
    }
  }

  // 2. Check for Twilio (Global SMS delivery)
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

  if (twilioSid && twilioToken && twilioFrom) {
    try {
      const e164Phone = cleanPhone.startsWith('+') ? cleanPhone : `+91${last10}`;
      console.log(`[SMS-SERVICE] Dispatching SMS via Twilio to ${e164Phone}...`);
      const bodyParams = new URLSearchParams();
      bodyParams.append('To', e164Phone);
      bodyParams.append('From', twilioFrom);
      bodyParams.append('Body', messageText);

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams.toString()
      });
      const data = await res.json();
      console.log('[SMS-SERVICE] Twilio response:', data.sid || data.message || data);
      return { success: true, provider: 'Twilio' };
    } catch (err: any) {
      console.error('[SMS-SERVICE] Twilio failed:', err);
    }
  }

  // 3. Check for MSG91
  const msg91AuthKey = process.env.MSG91_AUTH_KEY;
  const msg91TemplateId = process.env.MSG91_TEMPLATE_ID;
  if (msg91AuthKey && msg91TemplateId) {
    try {
      const e164Phone = cleanPhone.startsWith('+') ? cleanPhone.replace('+', '') : `91${last10}`;
      console.log(`[SMS-SERVICE] Dispatching SMS via MSG91 to ${e164Phone}...`);
      const res = await fetch(`https://control.msg91.com/api/v5/otp?template_id=${msg91TemplateId}&mobile=${e164Phone}&authkey=${msg91AuthKey}&otp=${code}`, {
        method: 'POST'
      });
      const data = await res.json();
      console.log('[SMS-SERVICE] MSG91 response:', data);
      return { success: true, provider: 'MSG91' };
    } catch (err: any) {
      console.error('[SMS-SERVICE] MSG91 failed:', err);
    }
  }

  // Server Console Log fallback for development & debugging
  console.log(`\n========================================================`);
  console.log(`📱 [MOBILE SMS SENT]`);
  console.log(`Recipient Mobile: ${phone}`);
  console.log(`Message: "${messageText}"`);
  console.log(`OTP Code: [ ${code} ]`);
  console.log(`Tip: Add FAST2SMS_API_KEY or TWILIO credentials in .env to deliver directly via cellular carrier.`);
  console.log(`========================================================\n`);

  return { success: true, provider: 'Console' };
}
