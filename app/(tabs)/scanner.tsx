import { OnSuccessfulScanProps, QRCodeScanner } from '@masumdev/rn-qrcode-scanner';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScanHistory } from '../../contexts/ScanHistoryContext';

export default function ScannerScreen() {
  const { addScan } = useScanHistory();
  const [scanned, setScanned] = useState(false);

  const handleScan = (data: OnSuccessfulScanProps) => {
    if (scanned) return;

    setScanned(true);
    console.log('Scan result:', data);

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

  return (
    <SafeAreaView style={styles.container}>
      <QRCodeScanner
        core={{ onSuccessfulScan: handleScan }}
        permissionScreen={{

        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});