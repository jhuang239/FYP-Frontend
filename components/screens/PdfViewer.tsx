import * as React from 'react';
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import Pdf from 'react-native-pdf';
import { useNavigation } from '@react-navigation/native';


import {
    View,
    StyleSheet,
    Dimensions,
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

    const [result, setResult] = React.useState<
        Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null
    >();


    React.useEffect(() => {
        console.log(fileDetail);
        // Do fetch here
        try {

        } catch (error) {

        } finally {

        }
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
            </View>
            <View style={styles.container}>
                <Pdf
                    enablePaging={true}
                    trustAllCerts={false}
                    source={{
                        uri: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
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
