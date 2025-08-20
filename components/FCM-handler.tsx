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
        // ✅ Cek apakah browser support Service Worker dan Push API
        if (!("serviceWorker" in navigator)) {
          console.warn("Browser tidak mendukung Service Worker");
          toast({
            title: "Browser tidak mendukung Service Worker",
            variant: "destructive",
          });
          return;
        }

        if (!("PushManager" in window)) {
          console.warn("Browser tidak mendukung Push API");
          toast({
            title: "Browser tidak mendukung Push API",
            variant: "destructive",
          });
          return;
        }

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
        await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        const registration = await navigator.serviceWorker.ready;

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

        console.log("Detected Device: ", result);

        const browserName = result.browser.name || "Unknown";
        const deviceType = result.device.type || "desktop";
        const deviceMerk =
          result.device.vendor ||
          (deviceType === "desktop" ? "PC/Laptop" : "Unknown");

        // Kirim token ke backend
        await axios.post("/api/v1/fcm", {
          fcmToken: tokens,
          browserName,
          deviceType,
          deviceMerk,
        });

        // 🔥 Tangkap notifikasi saat tab aktif (foreground)
        onMessage(messaging, (payload) => {
          console.log("📩 Pesan foreground diterima: ", payload);

          const notificationTitle =
            payload.notification?.title || "Notifikasi Baru";
          const notificationOptions = {
            body: payload.notification?.body || "Anda punya pesan baru",
            icon: payload.notification?.icon || "/notification192.png",
            badge: "/notification48.png",
            data: { url: payload.data?.url || "/" },
          };

          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(
              notificationTitle,
              notificationOptions
            );
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
