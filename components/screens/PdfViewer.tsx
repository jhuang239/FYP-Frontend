import * as React from 'react';
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import Pdf from 'react-native-pdf';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import {
    View,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native';
import {
    DirectoryPickerResponse,
    DocumentPickerResponse,

} from 'react-native-document-picker';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const PdfViewer = ({ route }) => {
    const { fileDetail } = route.params;
    const navigation = useNavigation();

    const [fileUrl, setFileUrl] = React.useState("");

    const fetchFile = async () => {
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            const response = await fetch(`http://3.26.57.153:8000/file/getPath?file_name=${fileDetail.oldName}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });
            // Handle response
            if (response.ok) {
                const result = await response.json();
                setFileUrl(result.download_url)
            } else {
                // Error occurred while uploading file
                console.log("Error fetch File:" + response.status);
            }
        } catch (error) {
            console.log("Error fetch File:" + error);
        }
    }

    React.useEffect(() => {
        fetchFile();
    }, []);


    const goToBack = () => {
        navigation.goBack();
    };


    return (
        <View>
            <View style={styles.topbar}>
                <IoniconsIcon
                    name="arrow-back"
                    style={styles.backButton}
                    onPress={() => goToBack()}
                />
                <View style={{ width: width * 0.8, justifyContent: 'flex-start', alignItems: 'flex-start', marginHorizontal: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>{(fileDetail.oldName).substring((fileDetail.oldName).indexOf("_") + 1)}</Text>
                </View>
            </View>
            <View style={styles.container}>
                <Pdf
                    enablePaging={true}
                    trustAllCerts={false}
                    source={{
                        uri: fileUrl,
                        cache: false,
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
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    pdf: {
        flex: 1,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffedd5',
        width: width,
        height: height * 0.95,
    },
    topbar: {
        flexDirection: "row",
        alignItems: "center",
        width: width,
        backgroundColor: "#ffedd5",
        justifyContent: "space-between",
    },
    backButton: {
        margin: 10,
        fontSize: 40,
        color: "black",
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        flex: 1,
    },
});

export default PdfViewer;
