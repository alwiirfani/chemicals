"use client";
import { useEffect } from "react";
import { getFirebaseMessaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { UAParser } from "ua-parser-js";

export default function FCMHandler() {
  const { toast } = useToast();

  useEffect(() => {
    const registerFCM = async () => {
      try {
        // Cek apakah browser mendukung notifikasi
        if (!("Notification" in window)) {
          console.warn("Browser tidak mendukung notifikasi");
          toast({
            title: "Browser tidak mendukung notifikasi",
            variant: "destructive",
          });
          return;
        }

        // Cek apakah messaging tersedia
        const messaging = await getFirebaseMessaging();
        if (!messaging) {
          console.warn("Firebase Messaging tidak tersedia");

          return;
        }

        // Minta izin notifikasi
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("Izin notifikasi ditolak");

          return;
        }

        // Register service worker
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          { scope: "/firebase-cloud-messaging-push-scope/" }
        );

        // Dapatkan FCM Token
        const tokens = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        console.log("FCM Token: ", tokens);

        if (!tokens) {
          console.warn("Tidak dapat mendapatkan FCM Token");
        }

        // Gunakan UAParser untuk deteksi device
        const parser = new UAParser();
        const result = parser.getResult();

        const deviceType = result.device.type || "desktop";
        const deviceMerk =
          result.device.vendor ||
          (deviceType === "desktop" ? "PC/Laptop" : "Unknown");

        // Kirim token ke backend
        await axios.post("/api/v1/fcm", {
          fcmToken: tokens,
          deviceType,
          deviceMerk,
        });

        // 🔥 Tangkap notifikasi saat tab aktif (foreground)
        onMessage(messaging, (payload) => {
          console.log("📩 Pesan foreground diterima: ", payload);

          const notificationTitle =
            payload.notification?.title || "Notifikasi Baru";
          const notificationBody =
            payload.notification?.body || "Anda punya pesan baru";

          // Native browser notification
          new Notification(notificationTitle, {
            body: notificationBody,
            icon: payload.notification?.icon || "/notification.png", // URL gambar ikon
          });
        });
      } catch (error) {
        console.error("Error registering FCM:", error);
        toast({
          title: "Gagal mengaktifkan notifikasi",
          variant: "destructive",
        });
      }
    };

    // Jalankan hanya di client side
    if (typeof window !== "undefined") {
      registerFCM();
    }
  }, [toast]);

  return null;
}
