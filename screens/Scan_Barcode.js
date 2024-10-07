import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, Dimensions } from 'react-native';
import { Camera, useCameraDevices, useCodeScanner } from 'react-native-vision-camera';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCAN_AREA_SIZE = SCREEN_WIDTH * 0.7; // 70% of screen width
const SCAN_AREA_BORDER_WIDTH = 2;

export default function Component() {
  const devices = useCameraDevices();
  const [device, setDevice] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);
  const [scannedCodes, setScannedCodes] = useState([]);

  const requestPermissions = useCallback(async () => {
    if (Platform.OS === 'android') {
      const cameraStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      const audioStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);

      setHasPermission(
        cameraStatus === PermissionsAndroid.RESULTS.GRANTED &&
        audioStatus === PermissionsAndroid.RESULTS.GRANTED
      );

      console.log('Camera permission:', cameraStatus);
      console.log('Audio permission:', audioStatus);
    }
  }, []);

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  useEffect(() => {
    if (devices && Object.keys(devices).length > 0) {
      const backCameras = Object.values(devices).filter(d => d.position === 'back');
      if (backCameras.length > 0) {
        setDevice(backCameras[0]);
      } else {
        setError('No back camera found');
      }
    }
  }, [devices]);

  const handleCameraReady = useCallback(() => {
    console.log('Camera is ready');
    setIsCameraReady(true);
  }, []);

  const isCodeInScanArea = useCallback((code) => {
    if (!code.bounds || !code.bounds.origin || !code.bounds.size) {
      // If bounds information is not available, we can't determine if it's in the scan area
      // So we'll assume it is to avoid missing potential valid codes
      return true;
    }

    const { origin, size } = code.bounds;
    return (
      origin.x >= (SCREEN_WIDTH - SCAN_AREA_SIZE) / 2 &&
      origin.x + size.width <= (SCREEN_WIDTH + SCAN_AREA_SIZE) / 2 &&
      origin.y >= (SCREEN_HEIGHT - SCAN_AREA_SIZE) / 2 &&
      origin.y + size.height <= (SCREEN_HEIGHT + SCAN_AREA_SIZE) / 2
    );
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      const filteredCodes = codes.filter(isCodeInScanArea);
      
      if (filteredCodes.length > 0) {
        console.log(`Scanned ${filteredCodes.length} codes within the scan area!`);
        setScannedCodes(filteredCodes);
      }
    }
  });

  const renderScannedCodes = useCallback(() => {
    return scannedCodes.map((code, index) => (
      <Text key={index} style={styles.codeText}>
        {code.type}: {code.value}
      </Text>
    ));
  }, [scannedCodes]);

  const handleCameraError = useCallback((err) => {
    console.error('Camera error:', err);
    setError(err.message || 'An error occurred with the camera');
    setIsCameraReady(false);
  }, []);

  return (
    <View style={styles.container}>
      {device && hasPermission ? (
        <>
          <Camera
            style={styles.camera}
            device={device}
            isActive={true}
            onInitialized={handleCameraReady}
            onError={handleCameraError}
            codeScanner={codeScanner}
          />
          <View style={styles.overlay}>
            <View style={styles.scanArea} />
          </View>
          <View style={styles.scanAreaBorder} />
          <Text style={styles.instructionText}>
            Position the barcode within the square
          </Text>
        </>
      ) : (
        <Text style={styles.loadingText}>
          {!hasPermission ? 'Camera permission not granted' : 'Loading...'}
        </Text>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.scannedCodesContainer}>
        {renderScannedCodes()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    backgroundColor: 'transparent',
  },
  scanAreaBorder: {
    position: 'absolute',
    top: (SCREEN_HEIGHT - SCAN_AREA_SIZE) / 2 - SCAN_AREA_BORDER_WIDTH,
    left: (SCREEN_WIDTH - SCAN_AREA_SIZE) / 2 - SCAN_AREA_BORDER_WIDTH,
    width: SCAN_AREA_SIZE + SCAN_AREA_BORDER_WIDTH * 2,
    height: SCAN_AREA_SIZE + SCAN_AREA_BORDER_WIDTH * 2,
    borderWidth: SCAN_AREA_BORDER_WIDTH,
    borderColor: 'white',
  },
  instructionText: {
    position: 'absolute',
    top: (SCREEN_HEIGHT + SCAN_AREA_SIZE) / 2 + 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
  },
  loadingText: {
    color: 'black',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  scannedCodesContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  codeText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
});