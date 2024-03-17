import * as React from 'react';
import IMAGES from '../images';
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const UploadFile = (props, { setUserData }) => {
  const [result, setResult] = React.useState<
    Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null
  >();
  const [message, setMessage] = React.useState("");
  const [isMessageModalVisible, setIsMessageModalVisible] = React.useState(false);

  React.useEffect(() => {
    console.log(JSON.stringify(result, null, 2));
    if (result) {
      RNFS.readFile(result[0].fileCopyUri, 'base64')
    }
  }, [result]);

  const handleError = (err: unknown) => {
    setIsMessageModalVisible(true);
    if (isCancel(err)) {
      setMessage('User cancelled the picker');
      console.warn('User cancelled the picker');
    } else if (isInProgress(err)) {
      setMessage('Picker is still in progress');
      console.warn('Picker is still in progress');
    } else {
      setMessage(String(err));
      throw err;
    }
  };

  const handleCross = () => {
    setResult(undefined);
  };

  const handleTick = async () => {
    const formData = new FormData();
    if (result) {
      formData.append("pdf", {
        uri: result[0].uri,
        type: "application/pdf",
        name: result[0].name,
      });
      try {
        const response = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // Handle response
        if (response.ok) {
          // File uploaded successfully
          setMessage("File uploaded successfully");
        } else {
          // Error occurred while uploading file
          setMessage("Error uploading PDF file:"+ response.status);
        }
      } catch (error) {
        setMessage("Error uploading PDF file:" + error);
      } finally {
        setIsMessageModalVisible(true);
        setResult(undefined);
      }
    }
  };

  return (
    <View>
      <View style={styles.topbar}>
        {/* <IoniconsIcon name="arrow-back" style={styles.backButton} />
        <Text style={styles.topBarText}>File Upload</Text> */}
        {result ? (
          <View style={styles.decision}>
            <TouchableOpacity
              onPress={() => handleTick()}>
              <Text style={styles.tick}>✓</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCross()}>
              <Text style={styles.cross}>✖</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View></View>
        )}
      </View>
      <View style={styles.container}>
        {result ? (
          <Pdf
            enablePaging={true}
            trustAllCerts={false}
            source={{
              uri: result[0].fileCopyUri,
              cache: true,
            }}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={error => {
              console.log(error);
            }}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={styles.card}
          />
        ) : (
          <View style={styles.card}>
            <IoniconsIcon name="cloud-upload" style={styles.uploadIcon} />
            <Text style={styles.title}>DRAG FILES HERE</Text>
            <Text style={styles.subtitle}>
              Drag and drop files here {'\n'} or browse your phone
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                DocumentPicker.pick({
                  allowMultiSelection: true,
                  type: [DocumentPicker.types.pdf],
                  copyTo: 'cachesDirectory',
                })
                  .then(setResult)
                  .catch(handleError);
              }}>
              <Text style={styles.buttonText}>BROWSE FILES</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isMessageModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setIsMessageModalVisible(false)}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
};

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffedd5',
    width: width,
    height: height*0.95,
  },
  backButton: {
    marginLeft: 10,
    fontSize: 30,
    color: "black",
  },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    width: width,
    backgroundColor: "#ffedd5",
  },
  topBarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "black",
    marginLeft: 15,
  },
  decision: {
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'flex-end',
    flex: 1,
  }, tick: {
    margin: 10,
    fontSize: 30,
    color: "green",
  },
  cross: {
    margin: 10,
    fontSize: 30,
    color: "red",
  },
  card: {
    margin: 30,
    marginTop: 20,
    backgroundColor: 'rgba(170, 183, 191, 0.4)',
    borderWidth: 3,
    borderColor: 'gray',
    borderRadius: 10,
    borderStyle: 'dotted',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.9,
    flex: 1,
  },
  button: {
    margin: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#21201d',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  uploadIcon: {
    marginBottom: 30,
    fontSize: 120,
    color: '#0290bf',
  },
  title: {
    margin: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    margin: 10,
    fontSize: 20,
  },
  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#21201d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UploadFile;
