import * as React from 'react';
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import Pdf from 'react-native-pdf';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    Platform
} from 'react-native';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const PdfPreViewer = ({ route }) => {
    const { fileDetail } = route.params;
    const navigation = useNavigation();

    const [file, setFile] = React.useState({ fileCopyUri: "", name: "", size: "", type: "", uri: "" });

    const goToBack = () => {
        navigation.goBack();
    };

    React.useEffect(() => {
        console.log(fileDetail)
        setFile(fileDetail)
    }, [])

    return (
        <View>
            <View style={styles.topbar}>
                <IoniconsIcon
                    name="arrow-back"
                    style={styles.backButton}
                    onPress={() => goToBack()}
                />
                <View style={{ width: width * 0.8, justifyContent: 'flex-start', alignItems: 'flex-start', marginHorizontal: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>{file.name}</Text>
                </View>
            </View>
            <View style={styles.container}>
                <Pdf
                    enablePaging={true}
                    trustAllCerts={false}
                    source={{
                        uri: file.fileCopyUri,
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
        paddingTop: Platform.OS == "ios" ? 20 : 0,
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

export default PdfPreViewer;
