// Quick script to apply the last 3 image fixes via Supabase REST API
const SUPABASE_URL = 'https://eqpojzrsyojembcttuzd.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcG9qenJzeW9qZW1iY3R0dXpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE2OTI5NywiZXhwIjoyMDg3NzQ1Mjk3fQ.icPTKJj90tdGSFdDqZPq36gSm1N6lGAEl1NlxIvDz8E';

const updates = [
  { name: 'Bacon & Cheese Loaded Fries', image_url: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400' },
  { name: 'Mexican Burger', image_url: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?w=400' },
  { name: 'Chicken Wings (6pc)', image_url: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400' },
];

async function run() {
  for (const { name, image_url } of updates) {
    const url = `${SUPABASE_URL}/rest/v1/menu_items?name=eq.${encodeURIComponent(name)}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({ image_url }),
    });
    const data = await res.json();
    console.log(`${name}: ${res.status} — updated ${data.length} row(s)`);
  }

  // Verify no more duplicates
  const checkUrl = `${SUPABASE_URL}/rest/v1/menu_items?select=name,image_url&order=name`;
  const res = await fetch(checkUrl, {
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });
  const items = await res.json();
  const urlCount = {};
  items.forEach(i => { urlCount[i.image_url] = (urlCount[i.image_url] || 0) + 1; });
  const dupes = Object.entries(urlCount).filter(([_, c]) => c > 1);
  console.log(`\nTotal items: ${items.length}, Unique URLs: ${Object.keys(urlCount).length}, Duplicates: ${dupes.length}`);
  dupes.forEach(([url, count]) => {
    const names = items.filter(i => i.image_url === url).map(i => i.name);
    console.log(`  ${count}x: ${names.join(', ')}`);
  });
}

run().catch(console.error);
