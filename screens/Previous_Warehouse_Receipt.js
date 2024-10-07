import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Switch,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const clients = [
  { id: 0, name: "All Clients", receipts: [] },
  { id: 1, name: "Acme Corp", receipts: ["WR-001", "WR-002", "WR-003"] },
  { id: 2, name: "GlobalTech", receipts: ["WR-004", "WR-005"] },
  { id: 3, name: "MegaStore", receipts: ["WR-006", "WR-007", "WR-008"] },
  { id: 4, name: "TechInnovate", receipts: ["WR-009", "WR-010"] },
  { id: 5, name: "EcoSolutions", receipts: ["WR-011", "WR-012"] },
];

export default function Previous_Warehouse_Receipt() {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [searchQuery, setSearchQuery] = useState(route.params?.searchQuery || "");
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchedItem, setSearchedItem] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (route.params?.searchQuery) {
      handleSearch(route.params.searchQuery);
    }
  }, [route.params?.searchQuery]);

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

  const handleSearch = (query = searchQuery) => {
    const trimmedQuery = query.trim().toUpperCase();
    if (trimmedQuery) {
      for (let client of clients) {
        const foundReceipt = client.receipts.find(receipt => 
          receipt === trimmedQuery || 
          receipt === trimmedQuery.replace('PO-', 'WR-')
        );
        if (foundReceipt) {
          setSelectedClient(client);
          setSearchedItem(foundReceipt);
          return;
        }
      }
    }
    setSearchedItem(null);
  };

  const handleItemPress = (item) => {
    if (isEditMode) {
      navigation.navigate('Edit', { itemId: item });
    } else {
      navigation.navigate('View_Receipt', { itemId: item });
    }
  };

  useEffect(() => {
    if (searchQuery === '') {
      setSearchedItem(null);
    }
  }, [searchQuery]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.item,
        searchedItem === item && styles.highlightedItem
      ]}
      onPress={() => handleItemPress(item)}
    >
      <Text style={[
        styles.itemText,
        searchedItem === item && styles.highlightedItemText
      ]}>{item}</Text>
      {isEditMode && (
        <Icon name="edit" size={20} color={searchedItem === item ? "#FFFFFF" : "#000000"} />
      )}
    </TouchableOpacity>
  );

  const getFilteredReceipts = () => {
    if (selectedClient.id === 0) {
      return clients.slice(1).flatMap(client => client.receipts);
    }
    return selectedClient.receipts;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>Previous Receipts</Text>
      </View>

      <View style={styles.controlsContainer}>
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
        <View style={styles.editSwitchContainer}>
          <Text style={styles.editSwitchLabel}>Edit Mode</Text>
          <Switch
            value={isEditMode}
            onValueChange={setIsEditMode}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEditMode ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {selectedClient.id === 0 ? "All Warehouse Receipts" : `${selectedClient.name}'s Receipts`}
          </Text>
          <FlatList
            data={getFilteredReceipts()}
            keyExtractor={(item, index) => item + index}
            renderItem={renderItem}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search WR- or PO-"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch()}
          />
          <TouchableOpacity onPress={() => handleSearch()} style={styles.iconButton}>
            <Icon name="search" size={20} color="#FFFFFF" />
          </TouchableOpacity>
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownContainer: {
    flex: 1,
    marginRight: 16,
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
  editSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editSwitchLabel: {
    marginRight: 8,
    fontSize: 16,
    color: '#000000',
  },
  main: {
    flex: 1,
    padding: 16,
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
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0F0F0',
    marginBottom: 8,
    borderRadius: 8,
  },
  itemText: {
    color: '#000000',
    fontSize: 16,
  },
  highlightedItem: {
    backgroundColor: '#000000',
  },
  highlightedItemText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 16,
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
  iconButton: {
    backgroundColor: '#000000',
    padding: 12,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownListContainer: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
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
});