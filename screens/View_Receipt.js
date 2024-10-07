import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

// Mock function to fetch receipt data
const fetchReceiptData = (receiptId) => {
  // In a real app, this would be an API call
  return {
    purchaseOrder: 'PO-12345',
    carrier: 'Ground',
    trackingNumber: 'TRK123456789',
    quantity: 5,
    type: 'Box',
    length: 10,
    width: 8,
    height: 6,
    weight: 15,
    location: 'A1-B2-C3',
    isHazmat: true,
    hazmatNumber: 'HZ-789',
    additionalInfo: 'Handle with care',
    employeeId: 'EMP001',
  };
};

export default function View_Receipt() {
  const navigation = useNavigation();
  const route = useRoute();
  const { receiptId } = route.params;

  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    const data = fetchReceiptData(receiptId);
    setReceiptData(data);
  }, [receiptId]);

  if (!receiptData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>View Receipt {receiptId}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <InfoItem label="Purchase Order" value={receiptData.purchaseOrder} />
          <InfoItem label="Carrier" value={receiptData.carrier} />
          <InfoItem label="Tracking Number" value={receiptData.trackingNumber} />
          <InfoItem label="Quantity" value={receiptData.quantity.toString()} />
          <InfoItem label="Type" value={receiptData.type} />
          
          <View style={styles.dimensionsContainer}>
            <InfoItem label="Length" value={`${receiptData.length} cm`} />
            <InfoItem label="Width" value={`${receiptData.width} cm`} />
            <InfoItem label="Height" value={`${receiptData.height} cm`} />
          </View>
          
          <InfoItem label="Weight" value={`${receiptData.weight} kg`} />
          <InfoItem label="Location" value={receiptData.location} />
          
          <InfoItem label="Hazmat" value={receiptData.isHazmat ? 'Yes' : 'No'} />
          {receiptData.isHazmat && (
            <InfoItem label="Hazmat Number" value={receiptData.hazmatNumber} />
          )}
          
          <InfoItem label="Additional Information" value={receiptData.additionalInfo} multiline />
          <InfoItem label="Employee ID" value={receiptData.employeeId} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoItem = ({ label, value, multiline = false }) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, multiline && styles.multilineValue]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  infoItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333333',
  },
  multilineValue: {
    minHeight: 60,
  },
  dimensionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});