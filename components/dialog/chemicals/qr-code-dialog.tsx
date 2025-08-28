"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import Image from "next/image";
import axios from "axios";

interface Chemical {
  id: string;
  name: string;
  formula: string;
}

interface QRCodeDialogProps {
  chemical: Chemical;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRCodeDialog({
  chemical,
  open,
  onOpenChange,
}: QRCodeDialogProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const generateQRCode = useCallback(async () => {
    try {
      const { data } = await axios.post(
        "/api/v1/chemicals/qr-code",
        { chemicalId: chemical.id },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setQrCodeUrl(data.qrCode);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    }
  }, [chemical.id]);

  useEffect(() => {
    if (open && chemical) {
      generateQRCode();
    }
  }, [open, chemical, generateQRCode]);

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = `qr-${chemical.name.replace(/\s+/g, "-")}.png`;
      link.click();
    }
  };

  const handlePrint = () => {
    if (qrCodeUrl) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>QR Code - ${chemical.name}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 20px; 
                }
                .qr-container {
                  border: 2px solid #000;
                  padding: 20px;
                  display: inline-block;
                  margin: 20px;
                }
                .chemical-info {
                  margin-top: 10px;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div class="qr-container">
                <img src="${qrCodeUrl}" alt="QR-Code" />
                <div class="chemical-info">
                  <strong>${chemical.name}</strong><br/>
                  ${chemical.formula}<br/>
                  ${chemical.id}
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code - {chemical.name}</DialogTitle>
          <DialogDescription>
            Scan QR code untuk akses cepat informasi bahan kimia
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          {qrCodeUrl && (
            <div className="border-2 border-gray-200 p-4 rounded-lg">
              <Image
                src={qrCodeUrl || "/placeholder.svg"}
                alt="QR-Code"
                className="w-48 h-48"
                width={192} // 48 * 4
                height={192}
              />
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
            <div className="font-medium">{chemical.name}</div>
            <div>{chemical.formula}</div>
            <div>{chemical.id}</div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
