import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';

// Mock function to fetch receipt data
const fetchReceiptData = (receiptId) => {
  // In a real app, this would be an API call
  return {
    purchaseOrder: 'PO-12345',
    carrier: 'ground',
    trackingNumber: 'TRK123456789',
    quantity: 5,
    type: 'Box',
    length: 10,
    width: 8,
    height: 6,
    weight: 15,
    location: 'A1-B2-C3',
    isHazmat: false,
    hazmatNumber: '',
    additionalInfo: 'Handle with care',
    employeeId: 'EMP001',
  };
};

export default function Edit() {
  const navigation = useNavigation();
  const route = useRoute();
  const { receiptId } = route.params;

  const [receiptData, setReceiptData] = useState({
    purchaseOrder: '',
    carrier: 'ground',
    trackingNumber: '',
    quantity: 0,
    type: '',
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    location: '',
    isHazmat: false,
    hazmatNumber: '',
    additionalInfo: '',
    employeeId: '',
  });

  useEffect(() => {
    const data = fetchReceiptData(receiptId);
    setReceiptData(data);
  }, [receiptId]);

  const handleSave = () => {
    if (!receiptData.employeeId.trim()) {
      Alert.alert('Error', 'Employee ID is required');
      return;
    }
    // In a real app, this would be an API call to save the data
    console.log('Saving receipt data:', receiptData);
    navigation.goBack();
  };

  const handleHazmatToggle = (value) => {
    setReceiptData(prev => ({
      ...prev,
      isHazmat: value,
      hazmatNumber: value ? prev.hazmatNumber : '',
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Receipt {receiptId}</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Purchase Order</Text>
            <TextInput
              style={styles.input}
              value={receiptData.purchaseOrder}
              onChangeText={(text) => setReceiptData(prev => ({ ...prev, purchaseOrder: text }))}
              placeholder="Enter Purchase Order"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Carrier</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={receiptData.carrier}
                onValueChange={(itemValue) => setReceiptData(prev => ({ ...prev, carrier: itemValue }))}
                style={styles.picker}
              >
                <Picker.Item label="Air" value="air" />
                <Picker.Item label="Ground" value="ground" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tracking Number</Text>
            <TextInput
              style={styles.input}
              value={receiptData.trackingNumber}
              onChangeText={(text) => setReceiptData(prev => ({ ...prev, trackingNumber: text }))}
              placeholder="Enter Tracking Number"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={receiptData.quantity.toString()}
              onChangeText={(text) => setReceiptData(prev => ({ ...prev, quantity: parseInt(text) || 0 }))}
              keyboardType="numeric"
              placeholder="Enter Quantity"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type</Text>
            <TextInput
              style={styles.input}
              value={receiptData.type}
              onChangeText={(text) => setReceiptData(prev => ({ ...prev, type: text }))}
              placeholder="Enter Type"
            />
          </View>

          <View style={styles.dimensionsContainer}>
            <View style={styles.dimensionInput}>
              <Text style={styles.label}>Length</Text>
              <TextInput
                style={styles.input}
                value={receiptData.length.toString()}
                onChangeText={(text) => setReceiptData(prev => ({ ...prev, length: parseFloat(text) || 0 }))}
                keyboardType="numeric"
                placeholder="Length"
              />
            </View>
            <View style={styles.dimensionInput}>
              <Text style={styles.label}>Width</Text>
              <TextInput
                style={styles.input}
                value={receiptData.width.toString()}
                onChangeText={(text) => setReceiptData(prev => ({ ...prev, width: parseFloat(text) || 0 }))}
                keyboardType="numeric"
                placeholder="Width"
              />
            </View>
            <View style={styles.dimensionInput}>
              <Text style={styles.label}>Height</Text>
              <TextInput
                style={styles.input}
                value={receiptData.height.toString()}
                onChangeText={(text) => setReceiptData(prev => ({ ...prev, height: parseFloat(text) || 0 }))}
                keyboardType="numeric"
                placeholder="Height"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight</Text>
            <TextInput
              style={styles.input}
              value={receiptData.weight.toString()}
              onChangeText={(text) => setReceiptData(prev => ({ ...prev, weight: parseFloat(text) || 0 }))}
              keyboardType="numeric"
              placeholder="Enter Weight"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={receiptData.location}
              onChangeText={(text) => setReceiptData(prev => ({ ...prev, location: text }))}
              placeholder="Enter Location"
            />
          </View>

          <View style={styles.hazmatContainer}>
            <Text style={styles.label}>Hazmat</Text>
            <Switch
              value={receiptData.isHazmat}
              onValueChange={handleHazmatToggle}
            />
          </View>

          {receiptData.isHazmat && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hazmat Number</Text>
              <TextInput
                style={styles.input}
                value={receiptData.hazmatNumber}
                onChangeText={(text) => setReceiptData(prev => ({ ...prev, hazmatNumber: text }))}
                placeholder="Enter Hazmat Number"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Additional Information</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={receiptData.additionalInfo}
              onChangeText={(text) => setReceiptData(prev => ({ ...prev, additionalInfo: text }))}
              placeholder="Enter Additional Information"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Employee ID *</Text>
            <TextInput
              style={styles.input}
              value={receiptData.employeeId}
              onChangeText={(text) => setReceiptData(prev => ({ ...prev, employeeId: text }))}
              placeholder="Enter Employee ID"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  saveButton: {
    backgroundColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  dimensionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dimensionInput: {
    flex: 1,
    marginRight: 8,
  },
  hazmatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});