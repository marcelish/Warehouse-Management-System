// styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  square: {
    backgroundColor: 'white',
    position: 'absolute',
    borderTopRightRadius: 150,
    width: 500,
    height: 600,
    top: 400,
  },
  headerText: {
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subHeaderText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    color: '#333',
    width: '80%',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#000',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    width: '80%',
    alignSelf: 'center',
    borderColor: '#000',
    borderWidth: .10,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 2.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',  // Change text color to white
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 5,
    },
  },
  forgotPassword: {
    textAlign: 'center',
    color: '#666',
    marginTop: 50,
  },
  Circle: {
    backgroundColor: '#e6f0dc',
    position: 'absolute',
    borderRadius: 350,
    width: 450,
    height: 300,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    top: 650,
  },
  searchbox: {
    position: 'absolute',
    top: 800,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchinput: {
    backgroundColor: '#fff',
    width: '80%',
    height: 50,
    borderRadius: 25,
    paddingLeft: 20,
    fontSize: 18,
    color: '#000',
  },
  scanwrapper: {
    backgroundColor: '#fff',
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: '#000',
    borderWidth: .17,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  scantext: {
    fontSize: 25,
    color: '#000',
  },
  buttonbox: {
    top: 575,
  },
  topPart: {
    padding: 20,
    backgroundColor: '#f8f8f8', // Just an example
  },
  dropdownContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  dropdownButton: {
    borderWidth: 0.75,
    borderColor: '#d3d3d3',
    backgroundColor: 'white',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: '37%',
    top: 100,
    borderRadius: 5,
  },
  dropdownIcon: {
    position: 'absolute',
    right: 10,
    height: 10,
    width: 20,
  },
});

export default styles;
