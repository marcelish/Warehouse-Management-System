import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const clients = [
  { id: 0, name: "All Clients", lastReceipt: null, allReceipts: [] },
  { id: 1, name: "Acme Corp", lastReceipt: "WR-003", allReceipts: ["WR-001", "WR-002", "WR-003"], purchaseOrders: ["PO-001", "PO-002", "PO-003"] },
  { id: 2, name: "GlobalTech", lastReceipt: "WR-005", allReceipts: ["WR-004", "WR-005"], purchaseOrders: ["PO-004", "PO-005"] },
  { id: 3, name: "MegaStore", lastReceipt: "WR-008", allReceipts: ["WR-006", "WR-007", "WR-008"], purchaseOrders: ["PO-006", "PO-007", "PO-008"] },
  { id: 4, name: "TechInnovate", lastReceipt: "WR-010", allReceipts: ["WR-009", "WR-010"], purchaseOrders: ["PO-009", "PO-010"] },
  { id: 5, name: "EcoSolutions", lastReceipt: "WR-012", allReceipts: ["WR-011", "WR-012"], purchaseOrders: ["PO-011", "PO-012"] },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      dropdownRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownPosition({
          top: py + height,
          left: px,
          width: width,
        });
      });
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setIsDropdownOpen(false);
  };

  const handleSearch = () => {
    const query = searchQuery.trim().toUpperCase();
    if (query.startsWith('WR-') || query.startsWith('PO-')) {
      navigation.navigate('Previous_Warehouse_Receipt', { searchQuery: query });
    } else {
      console.log('Invalid search query. Please enter a valid Warehouse Receipt (WR-) or Purchase Order (PO-) number.');
    }
  };

  const handleReceiptPress = (receipt) => {
    navigation.navigate('Previous_Warehouse_Receipt', { searchQuery: receipt });
  };

  const handleScan = () => {
    navigation.navigate('Scan_Barcode');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.title}>WMS Express</Text>
        <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
          <Icon name="settings" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.main}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            ref={dropdownRef}
            style={styles.dropdownButton}
            onPress={toggleDropdown}
          >
            <Text style={styles.dropdownButtonText}>
              {selectedClient.name}
            </Text>
            <Icon name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {selectedClient.id === 0 ? "Latest Warehouse Receipts" : `${selectedClient.name}'s Warehouse Receipts`}
          </Text>
          <ScrollView style={styles.receiptList}>
            {selectedClient.id === 0 ? (
              clients.slice(1).map((client) => (
                <View key={client.id} style={styles.clientItem}>
                  <Text style={styles.clientName}>{client.name}</Text>
                  <View style={styles.receiptInfo}>
                    <TouchableOpacity onPress={() => handleReceiptPress(client.lastReceipt)}>
                      <Text style={styles.latestReceiptText}>Latest Receipt: {client.lastReceipt}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleClientSelect(client)} style={styles.viewAllButton}>
                      <Text style={styles.viewAllButtonText}>View All</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              selectedClient.allReceipts.map((receipt, index) => (
                <TouchableOpacity key={index} style={styles.receiptItem} onPress={() => handleReceiptPress(receipt)}>
                  <Text style={styles.receiptText}>{receipt}</Text>
                  {receipt === selectedClient.lastReceipt && (
                    <View style={styles.latestBadge}>
                      <Text style={styles.latestLabel}>Latest</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Previous_Warehouse_Receipt')} style={styles.button}>
            <Icon name="file-text" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Previous Receipts</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Move_Stock')} style={styles.button}>
            <Icon name="move" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Move Stock</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search WR- or PO-"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={handleSearch} style={styles.iconButton}>
              <Icon name="search" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleScan} style={styles.iconButton}>
              <Icon name="maximize" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="none"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View style={[styles.dropdownListContainer, {
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
          }]}>
            <FlatList
              data={clients}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleClientSelect(item)}
                >
                  <Text style={styles.dropdownItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  settingsButton: {
    padding: 8,
  },
  main: {
    flex: 1,
    padding: 16,
  },
  dropdownContainer: {
    marginBottom: 16,
    zIndex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  dropdownListContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxHeight: 200,
  },
  dropdownList: {
    flexGrow: 0,
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  receiptList: {
    maxHeight: 575,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0F0F0',
    marginBottom: 8,
    borderRadius: 8,
  },
  receiptText: {
    color: '#000000',
    fontSize: 16,
  },
  latestBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  latestLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  clientItem: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  clientName: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
    fontSize: 18,
  },
  receiptInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  latestReceiptText: {
    color: '#666666',
  },
  viewAllButton: {
    backgroundColor: 'transparent',
  },
  viewAllButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: '#000000',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});