import * as React from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Text,
} from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import { SearchBar, Overlay } from "react-native-elements";
import { useNavigation } from '@react-navigation/native';


const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
    topbar: {
        flexDirection: "row",
        alignItems: "center",
        width: width,
        backgroundColor: "#ffedd5",
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffedd5",
        height: height * 0.85,
        // flex: 1,
    },
    searchBar: {
        padding: 20,
        paddingRight: 10,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: width * 0.8,
        backgroundColor: "#ffedd5",
    },
    backButton: {
        marginLeft: 10,
        fontSize: 24,
        color: "black",
    },
    listItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        width: width,
    },
    listItem: {
        flexDirection: "row",

    },
    ItemName: {
        fontSize: 16,
        margin: 5,
    },
    ItemInfo: {
        fontSize: 12,
        color: "#888",
        margin: 5,
    },
    ItemIcon: {
        fontSize: 30,
        color: "black",
        margin: 10,
    },
    MoreIcon: {
        fontSize: 30,
        color: "black",
        margin: 10,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        // flex: 1,
    },
    Itemdetails: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: width * 0.7,
    },
    addIcon: {
        color: "#0290bf",
        fontSize: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    ToolsOverlayItems: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        margin: 20,
        width: width * 0.5,
    },
    warning: {
        color: "red",
    },
});

const FileList = ({ setUserData }) => {
    const datas = [
        { id: 1, name: "SemA", type: "folder", updated_at: "10/03/2024", parent: null },
        { id: 2, name: "SemB", type: "folder", updated_at: "05/03/2024", parent: null },
        { id: 3, name: "SemC", type: "folder", updated_at: "01/01/2024", parent: null },
        { id: 4, name: "file1", type: "file", updated_at: "01/03/2024", parent: null },
        { id: 5, name: "file2", type: "file", updated_at: "01/02/2024", parent: null },
        { id: 6, name: "file3", type: "file", updated_at: "01/04/2024", parent: null },
        { id: 7, name: "file4", type: "file", updated_at: "01/04/2024", parent: null },
        { id: 8, name: "file5", type: "file", updated_at: "01/04/2024", parent: null },
        { id: 9, name: "file6", type: "file", updated_at: "01/04/2024", parent: 1 },
        { id: 10, name: "file7", type: "file", updated_at: "01/04/2024", parent: 1 },
        { id: 11, name: "file8", type: "file", updated_at: "01/04/2024", parent: 2 },
    ];
    var locationStack = [null];
    const [SearchKeyword, setSearchKeyword] = React.useState("");
    const [SearchResult, setSearchResult] = React.useState(undefined);
    const [currentLocation, setCurrentLocation] = React.useState(locationStack[locationStack.length - 1]);
    const [Items, setItems] = React.useState(datas);
    const [SelectedItem, setSelectedItem] = React.useState({ name: "", type: "", updated_at: "" });
    const [isSearchLoading, setIsSearchLoading] = React.useState(false);
    const [isToolsOverlayShow, setIsToolsOverlayShow] = React.useState(false);
    const [isAddOverlayShow, setIsAddOverlayShow] = React.useState(false);
    const navigation = useNavigation();


    const pushStack = (id) => {
        locationStack = [...locationStack, id]
        setCurrentLocation(locationStack[locationStack.length - 1]);
    }

    const popStack = () => {
        locationStack.slice(0, -1);
        setCurrentLocation(locationStack[locationStack.length - 1]);
    }

    const goToPdfViewer = (fileDetail: any) => {
        console.log(fileDetail)
        navigation.navigate('PdfViewer', { fileDetail });
    };

    React.useEffect(() => {
        const filteredData = Items.filter((item) =>
            item.name.toLowerCase().includes(SearchKeyword.toLowerCase())
        );
        setSearchResult(filteredData);
    }, [SearchKeyword]);


    return (
        <View>
            <View style={styles.topbar}>
                <IoniconsIcon onPress={() => popStack()} name="arrow-back" style={currentLocation != null ? styles.backButton : { display: 'none' }} />
                <SearchBar
                    containerStyle={currentLocation != null ? styles.searchBar : { ...styles.searchBar, width: width * 0.87 }}
                    placeholder="Type Here..."
                    onChangeText={setSearchKeyword}
                    value={SearchKeyword}
                    lightTheme={true}
                    round={true}
                    showLoading={isSearchLoading}
                />
                <TouchableOpacity
                    onPress={() => setIsAddOverlayShow(true)}
                >
                    <EntypoIcon name="squared-plus" style={styles.addIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <ScrollView>
                    {SearchKeyword == "" ? Items.map((file, index) => {
                        if (file.parent == currentLocation) {
                            return (< View key={index} style={styles.listItemContainer} >
                                <TouchableOpacity onPress={() => { file.type === "file" ? goToPdfViewer(file) : pushStack(file.id) }} style={styles.listItem} >
                                    {file.type === "file" ? (
                                        <AntDesignIcon name="pdffile1" style={styles.ItemIcon} />
                                    ) : (
                                        <EntypoIcon name="folder" style={styles.ItemIcon} />
                                    )}
                                    <View style={styles.Itemdetails}>
                                        <Text style={styles.ItemName}>{file.name}</Text>
                                        <Text style={styles.ItemInfo}>
                                            Last Update: {file.updated_at}
                                        </Text>
                                    </View>
                                    <FeatherIcon
                                        name="more-horizontal"
                                        style={styles.MoreIcon}
                                        onPress={() => {
                                            setIsToolsOverlayShow(true);
                                            setSelectedItem(file);
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>)
                        }
                    }) : SearchResult.map((file, index) => {
                        if (file.parent == currentLocation) {
                            return (< View key={index} style={styles.listItemContainer} >
                                <TouchableOpacity onPress={() => pushStack(file.id)} style={styles.listItem} >
                                    {file.type === "file" ? (
                                        <AntDesignIcon name="pdffile1" onPress={() => goToPdfViewer(file)} style={styles.ItemIcon} />
                                    ) : (
                                        <EntypoIcon name="folder" style={styles.ItemIcon} />
                                    )}
                                    <View style={styles.Itemdetails}>
                                        <Text style={styles.ItemName}>{file.name}</Text>
                                        <Text style={styles.ItemInfo}>
                                            Last Update: {file.updated_at}
                                        </Text>
                                    </View>
                                    <FeatherIcon
                                        name="more-horizontal"
                                        style={styles.MoreIcon}
                                        onPress={() => {
                                            setIsToolsOverlayShow(true);
                                            setSelectedItem(file);
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>)
                        }
                    })}
                </ScrollView >

                {/* Here is the Overlay group */}
                < Overlay
                    isVisible={isToolsOverlayShow}
                    onBackdropPress={() => setIsToolsOverlayShow(false)}
                >
                    {
                        SelectedItem.type === "file" ? (
                            <AntDesignIcon name="pdffile1" style={styles.ItemIcon} />
                        ) : (
                            <EntypoIcon name="folder" style={styles.ItemIcon} />
                        )
                    }
                    < View >
                        <Text style={styles.ItemName}>{SelectedItem.name}</Text>
                        <Text style={styles.ItemInfo}>
                            Last Update: {SelectedItem.updated_at}
                        </Text>
                    </View >
                    <TouchableOpacity style={styles.ToolsOverlayItems}>
                        <Text>Edit Name</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ToolsOverlayItems}>
                        <Text style={styles.warning}>Remove</Text>
                    </TouchableOpacity>
                </Overlay >
                <Overlay
                    isVisible={isAddOverlayShow}
                    onBackdropPress={() => setIsAddOverlayShow(false)}
                >
                    <Text style={styles.ItemName}>Add Item</Text>
                    <TouchableOpacity style={styles.ToolsOverlayItems}>
                        <EntypoIcon name="folder" style={styles.ItemIcon} />

                        <Text>folder</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ToolsOverlayItems}>
                        <AntDesignIcon name="pdffile1" style={styles.ItemIcon} />
                        <Text>file</Text>
                    </TouchableOpacity>
                </Overlay>
            </View >
        </View >
    );
};

export default FileList;
