import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useScanHistory } from '../../contexts/ScanHistoryContext';

export default function HistoryScreen() {
  const { scans } = useScanHistory();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan History</Text>
      {scans.length === 0 ? (
        <Text style={styles.noHistory}>No scans yet.</Text>
      ) : (
        <FlatList
          data={scans}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.data}>{item.data}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noHistory: {
    fontSize: 16,
    color: 'gray',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  data: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
});