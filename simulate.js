const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function simulate() {
  const tx = await prisma.transaction.findFirst({
    where: { status: 'PENDING', gateway: 'duitku' },
    orderBy: { createdAt: 'desc' }
  });
  
  if (!tx) {
    console.log('No pending transaction found.');
    return;
  }
  
  console.log('Found transaction:', tx.id, 'Amount:', tx.amount);
  
  const merchantCode = 'DS32440';
  const apiKey = '3758cebbba382de2e158ef7433ab577a';
  const amount = String(Math.floor(tx.amount));
  
  const signatureStr = merchantCode + amount + tx.id + apiKey;
  const signature = crypto.createHash('md5').update(signatureStr).digest('hex');
  
  const payload = new URLSearchParams();
  payload.append('merchantCode', merchantCode);
  payload.append('amount', amount);
  payload.append('merchantOrderId', tx.id);
  payload.append('signature', signature);
  payload.append('reference', 'DUMMYREF12345');
  payload.append('resultCode', '00');
  
  const res = await fetch('https://portfo.be/api/callbacks/duitku', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload.toString()
  });
  
  const text = await res.text();
  console.log('Webhook Response:', res.status, text);
}

simulate().catch(console.error).finally(() => prisma.$disconnect());
