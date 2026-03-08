import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bluetooth, BluetoothSearching, Check, Loader2, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MockDevice {
  id: string;
  name: string;
  rssi: number;
  type: "ring" | "watch" | "unknown";
}

const MOCK_DEVICES: MockDevice[] = [
  { id: "vita-ring-001", name: "VitaRing Pro", rssi: -42, type: "ring" },
  { id: "vita-ring-002", name: "VitaRing Lite", rssi: -58, type: "ring" },
  { id: "watch-003", name: "Unknown Wearable", rssi: -71, type: "watch" },
  { id: "dev-004", name: "BLE Sensor", rssi: -83, type: "unknown" },
];

export default function Pairing() {
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<MockDevice[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<string | null>(null);

  const startScan = () => {
    setScanning(true);
    setDevices([]);
    setConnected(null);
    // Simulate devices appearing one by one
    MOCK_DEVICES.forEach((device, i) => {
      setTimeout(() => {
        setDevices(prev => [...prev, device]);
        if (i === MOCK_DEVICES.length - 1) setScanning(false);
      }, 800 * (i + 1));
    });
  };

  const connectDevice = (id: string) => {
    setConnecting(id);
    setTimeout(() => {
      setConnecting(null);
      setConnected(id);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header illustration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-8 flex flex-col items-center text-center"
      >
        <div className="relative mb-6">
          <div className={`w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center ${scanning ? "animate-pulse-ring" : ""}`}>
            <Bluetooth className="w-10 h-10 text-primary" />
          </div>
          {scanning && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/30"
                animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/20"
                animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">
          {connected ? "Ring Connected" : "Pair Your Ring"}
        </h1>
        <p className="text-sm text-muted-foreground mb-4 max-w-xs">
          {connected
            ? "Your VitaRing is connected and streaming health data."
            : "Scan for nearby Bluetooth devices to pair your health ring."}
        </p>
        {!connected && (
          <Button onClick={startScan} disabled={scanning} className="gradient-primary text-primary-foreground border-0">
            {scanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <BluetoothSearching className="w-4 h-4" />
                Scan for Devices
              </>
            )}
          </Button>
        )}
      </motion.div>

      {/* Device list */}
      <div className="space-y-3">
        <AnimatePresence>
          {devices.map((device, i) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  device.type === "ring" ? "bg-primary/10" : "bg-muted"
                }`}>
                  {device.type === "ring" ? (
                    <Radio className="w-5 h-5 text-primary" />
                  ) : (
                    <Bluetooth className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{device.name}</p>
                  <p className="text-xs text-muted-foreground">Signal: {device.rssi} dBm</p>
                </div>
              </div>
              {connected === device.id ? (
                <div className="flex items-center gap-1 text-primary text-sm font-medium">
                  <Check className="w-4 h-4" />
                  Connected
                </div>
              ) : connecting === device.id ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => connectDevice(device.id)}
                  disabled={!!connected}
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  Connect
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
