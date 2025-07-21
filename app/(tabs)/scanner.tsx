import { OnSuccessfulScanProps, QRCodeScanner } from '@masumdev/rn-qrcode-scanner';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useScanHistory } from '../../contexts/ScanHistoryContext';

export default function ScannerScreen() {
  const { addScan } = useScanHistory();
  const [scanned, setScanned] = useState(false);
  const [scannerKey, setScannerKey] = useState(0);

  const handleScan = (data: OnSuccessfulScanProps) => {
    if (scanned) return;

    setScanned(true);
    const scanText =
      (data as any)?.rawData || (data as any)?.data || JSON.stringify(data);

    const scanData = {
      data: scanText,
      timestamp: new Date().toISOString(),
    };

    addScan(scanData);
    Alert.alert('Scanned!', scanText);

    setTimeout(() => setScanned(false), 3000);
  };

  // 🔁 Reset scanner when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setScannerKey(prev => prev + 1);
    }, [])
  );

  return (
    <View style={styles.container}>
      <QRCodeScanner
        key={scannerKey}
        core={{ onSuccessfulScan: handleScan }}
        permissionScreen={{}}
      />
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Point your camera at a QR Code</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 10,
  },
});