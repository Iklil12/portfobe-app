/**
 * Utility untuk mengirim sinyal Ping SEO ke protokol IndexNow.
 * Dipanggil secara otomatis ketika portofolio berubah status menjadi isLive: true.
 */
export async function pingIndexNow(urlToPing: string) {
  try {
    const host = "portfo.be";
    const key = "portfobe-index-key";
    const keyLocation = "https://portfo.be/portfobe-index-key.txt";

    const payload = {
      host: host,
      key: key,
      keyLocation: keyLocation,
      urlList: [urlToPing]
    };

    console.log(`[IndexNow] Mengirim ping untuk URL: ${urlToPing}...`);

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log(`[IndexNow] Ping sukses! Status: ${res.status}`);
    } else {
      console.error(`[IndexNow] Gagal melakukan ping. Status: ${res.status} ${res.statusText}`);
    }
  } catch (error) {
    console.error(`[IndexNow] Terjadi error saat memproses ping untuk ${urlToPing}:`, error);
  }
}
