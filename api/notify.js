export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { name, email, message } = await req.json()

  const token = process.env.DISCORD_BOT_TOKEN
  const userId = process.env.DISCORD_OWNER_ID

  // Step 1: Open DM channel with you
  const dmRes = await fetch('https://discord.com/api/v10/users/@me/channels', {
    method: 'POST',
    headers: {
      'Authorization': `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ recipient_id: userId })
  })

  const dmData = await dmRes.json()
  const channelId = dmData.id

  // Step 2: Send DM
  await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: `📬 **New Message on XANIN XZ!**\n👤 **Name:** ${name}\n📧 **Email:** ${email}\n💬 **Message:** ${message}`
    })
  })

  return new Response('OK', { status: 200 })
}