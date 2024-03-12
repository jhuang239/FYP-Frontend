import * as React from "react";
import IMAGES from "../images";
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker'
// import { Ionicons } from "react-native-vector-icons";
import Pdf from "react-native-pdf";

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Modal,
} from "react-native";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffedd5",
        // flex: 1,
    },
    card: {
        margin: 50,
        backgroundColor: "rgba(170, 183, 191, 0.4)",
        borderWidth: 7,
        borderColor: "gray",
        borderRadius: 10,
        borderStyle: "dotted",
        justifyContent: "center",
        alignItems: "center",
        width: width * 0.9,
        // flex: 1,
    },
    button: {
        margin: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: "#21201d",
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 12,
        textAlign: "center",
    },
    uploadIcon: {
        marginBottom: 30,
        fontSize: 120,
        color: "#0290bf",
    },
    title: {
        margin: 10,
        fontSize: 30,
        fontWeight: "bold",
    },
    subtitle: {
        margin: 10,
        fontSize: 20,
    },
    modalContainer: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
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
        textAlign: "center",
    },
    modalButton: {
        backgroundColor: "#21201d",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    modalButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

const UploadFile = (props, { setUserData }) => {
    const [uploadedPDF, setUploadedPDF] = React.useState<DocumentPickerResponse[]>([]);
    const [error, setError] = React.useState(null);
    const [isErrorModalVisible, setIsErrorModalVisible] = React.useState(false);

    const UploadPDF = React.useCallback(async () => {
        try {
            const document = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
                presentationStyle: 'fullScreen',
            });
            console.log(document)

            setUploadedPDF(document);
        } catch (error) {
            console.log(error)
        }
        // const formData = new FormData();
        // formData.append("pdf", {
        //   uri: document.uri,
        //   type: "application/pdf",
        //   name: document.name,
        // });

        // try {
        //   const response = await fetch("http://localhost:8000/upload", {
        //     method: "POST",
        //     body: formData,
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   });

        //   // Handle response
        //   if (response.ok) {
        //     // File uploaded successfully
        //     console.log("PDF file uploaded successfully");
        //   } else {
        //     // Error occurred while uploading file
        //     console.log("Error uploading PDF file:", response.status);
        //   }
        // } catch (error) {
        //   console.log("Error uploading PDF file:", error);
        // }
    }, []);

    return (
        <View>
            <View style={styles.container}>
                {uploadedPDF.length > 0 ? (
                    <View>
                        <Pdf
                            ref="react-native-pdf"
                            enablePaging={true}
                            source={uploadedPDF[0]}
                            onLoadComplete={() => { }}
                        />
                    </View>
                ) : (
                    <View style={styles.card}>
                        {/* <Ionicons name="cloud-upload" style={styles.uploadIcon} /> */}
                        <Text style={styles.title}>DRAG FILES HERE</Text>
                        <Text style={styles.subtitle}>
                            Drag and drop files here {"\n"} or browse your phone
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={UploadPDF}>
                            <Text style={styles.buttonText}>BROWSE FILES</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isErrorModalVisible}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => setIsErrorModalVisible(false)}
                    >
                        <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

export default UploadFile;
