import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const clients = [
  { id: 1, name: "Acme Corp", purchaseOrders: ["PO-001", "PO-002", "PO-003"] },
  { id: 2, name: "GlobalTech", purchaseOrders: ["PO-004", "PO-005"] },
  { id: 3, name: "MegaStore", purchaseOrders: ["PO-006", "PO-007", "PO-008"] },
  { id: 4, name: "TechInnovate", purchaseOrders: ["PO-009", "PO-010"] },
  { id: 5, name: "EcoSolutions", purchaseOrders: ["PO-011", "PO-012"] },
];

const warehouseReceipts = [
  { id: "WR-001", clientId: 1, purchaseOrder: "PO-001" },
  { id: "WR-002", clientId: 1, purchaseOrder: "PO-002" },
  { id: "WR-003", clientId: 2, purchaseOrder: "PO-004" },
  { id: "WR-004", clientId: 3, purchaseOrder: "PO-006" },
  { id: "WR-005", clientId: 4, purchaseOrder: "PO-009" },
];

export default function MoveStock() {
  const navigation = useNavigation();
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);
  const [location, setLocation] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isPODropdownOpen, setIsPODropdownOpen] = useState(false);

  const clientDropdownHeight = useRef(new Animated.Value(0)).current;
  const poDropdownHeight = useRef(new Animated.Value(0)).current;

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setSelectedPO(null);
    toggleDropdown('client');
  };

  const handlePOSelect = (po) => {
    setSelectedPO(po);
    toggleDropdown('po');
  };

  const handleScan = () => {
    console.log('Scan button pressed');
  };

  const handleSearch = () => {
    const query = searchQuery.toUpperCase();
    if (query.startsWith('WR-')) {
      const receipt = warehouseReceipts.find(wr => wr.id === query);
      if (receipt) {
        const client = clients.find(c => c.id === receipt.clientId);
        setSelectedClient(client);
        setSelectedPO(receipt.purchaseOrder);
        console.log('Found Warehouse Receipt:', receipt);
      } else {
        console.log('Warehouse Receipt not found');
      }
    } else if (query.startsWith('PO-')) {
      const client = clients.find(c => c.purchaseOrders.includes(query));
      if (client) {
        setSelectedClient(client);
        setSelectedPO(query);
        console.log('Found Purchase Order:', query);
      } else {
        console.log('Purchase Order not found');
      }
    } else {
      console.log('Invalid search query. Please enter a valid Warehouse Receipt (WR-) or Purchase Order (PO-) number.');
    }
  };

  const toggleDropdown = (type) => {
    const animation = type === 'client' ? clientDropdownHeight : poDropdownHeight;
    const isOpen = type === 'client' ? isClientDropdownOpen : isPODropdownOpen;
    const setIsOpen = type === 'client' ? setIsClientDropdownOpen : setIsPODropdownOpen;

    Animated.timing(animation, {
      toValue: isOpen ? 0 : 200,
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start();

    setIsOpen(!isOpen);
  };

  const handleSaveChanges = () => {
    if (!selectedClient || !selectedPO || !location || !employeeId) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    // Here you would typically save the changes to your backend or state management system
    console.log('Saving changes:', {
      client: selectedClient.name,
      purchaseOrder: selectedPO,
      location,
      employeeId,
    });

    Alert.alert('Success', 'Changes saved successfully!');
  };

  const renderItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Client</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => toggleDropdown('client')}
            >
              <Text style={styles.dropdownText}>
                {selectedClient ? selectedClient.name : 'Select Client'}
              </Text>
              <Icon name={isClientDropdownOpen ? "chevron-up" : "chevron-down"} size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Purchase Order</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => toggleDropdown('po')}
              disabled={!selectedClient}
            >
              <Text style={styles.dropdownText}>
                {selectedPO ? selectedPO : 'Select Purchase Order'}
              </Text>
              <Icon name={isPODropdownOpen ? "chevron-up" : "chevron-down"} size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter Location"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Employee ID *</Text>
            <TextInput
              style={styles.input}
              value={employeeId}
              onChangeText={setEmployeeId}
              placeholder="Enter Employee ID"
              required
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (index === 1 && isClientDropdownOpen) {
      return (
        <Animated.View style={[styles.dropdownList, { maxHeight: clientDropdownHeight }]}>
          {clients.map((client) => (
            <TouchableOpacity
              key={client.id}
              style={styles.dropdownItem}
              onPress={() => handleClientSelect(client)}
            >
              <Text style={styles.dropdownItemText}>{client.name}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      );
    } else if (index === 2 && isPODropdownOpen && selectedClient) {
      return (
        <Animated.View style={[styles.dropdownList, { maxHeight: poDropdownHeight }]}>
          {selectedClient.purchaseOrders.map((po) => (
            <TouchableOpacity
              key={po}
              style={styles.dropdownItem}
              onPress={() => handlePOSelect(po)}
            >
              <Text style={styles.dropdownItemText}>{po}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>Move Stock</Text>
      </View>

      <FlatList
        data={[{}, {}, {}]} // Dummy data for form and dropdowns
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.content}
      />

      <View style={styles.footer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search WR- or PO-"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.iconButton}>
            <Icon name="search" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleScan} style={styles.scanButton}>
          <Icon name="maximize" size={20} color="#FFFFFF" />
          <Text style={styles.scanButtonText}>Scan</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
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
    color: '#000000',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000000',
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000000',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  iconButton: {
    backgroundColor: '#000000',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#000000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});