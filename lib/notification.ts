import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Kirim notifikasi ke beberapa user sekaligus
export async function sendNotification(
  userIds: string[],
  title: string,
  body: string,
  url: string = "/"
) {
  if (!userIds || userIds.length === 0) return;

  try {
    await axios.post(`${BASE_URL}/api/v1/notification`, {
      userIds,
      title,
      body,
      url,
    });
  } catch (error) {
    console.error("Gagal mengirim notifikasi:", error);
  }
}
