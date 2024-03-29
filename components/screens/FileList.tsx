import * as React from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Text,
    SafeAreaView,
    TextInput,
    Modal,

} from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import { SearchBar, Overlay } from "react-native-elements";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';





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

const FileList = ({ UpdateUserState }) => {
    const isFocused = useIsFocused();

    const defaultSelectItem = { name: "", type: "", updated_at: "", oldName: "" };

    const [locationStack, setLocationStack] = React.useState(["root"]);

    const [SearchKeyword, setSearchKeyword] = React.useState("");
    const [SearchResult, setSearchResult] = React.useState(undefined);
    const [currentLocation, setCurrentLocation] = React.useState(locationStack[locationStack.length - 1]);
    const [Items, setItems] = React.useState([]);
    const [SelectedItem, setSelectedItem] = React.useState(defaultSelectItem);
    const [detailClone, setDetailClone] = React.useState("");
    const [targetLocation, setTargetLocation] = React.useState(0);
    const [isSearchLoading, setIsSearchLoading] = React.useState(false);

    const [isToolsOverlayShow, setIsToolsOverlayShow] = React.useState(false);
    const [isAddOverlayShow, setIsAddOverlayShow] = React.useState(false);
    const [isDetailOverlayShow, setIsDetailOverlayShow] = React.useState(false);
    const [isMoveOverlayShow, setIsMoveOverlayShow] = React.useState(false);
    const [isCreateFolderOverlayShow, setIsCreateFolderOverlayShow] = React.useState(false);


    const [message, setMessage] = React.useState("");
    const [isMessageModalVisible, setIsMessageModalVisible] = React.useState(false);

    const navigation = useNavigation();

    const pushStack = (id) => {
        const newLocationStack = [...locationStack, id]
        setLocationStack(newLocationStack)
        setCurrentLocation(newLocationStack[newLocationStack.length - 1]);
        fetchFileAndDirectory(id);
    }

    const popStack = () => {
        const newLocationStack = locationStack.slice(0, -1);
        setLocationStack(newLocationStack)
        setCurrentLocation(newLocationStack[newLocationStack.length - 1]);
        fetchFileAndDirectory(newLocationStack[newLocationStack.length - 1]);
    }

    const goToPdfViewer = (fileDetail: any) => {
        console.log(fileDetail)
        navigation.navigate('PdfViewer', { fileDetail });
    };

    const fetchFileAndDirectory = async (location: string) => {
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            const response = await fetch(`http://3.26.57.153:8000/file/getFilesAndFolders?parent_id=${location}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });
            // Handle response
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                for (var file of data.files) {
                    if (file.type == "file") {
                        file.oldName = file.name
                        file.name = file.name.split('_')[1]
                    }
                }
                setItems(data.files)
            } else {
                // Error occurred while uploading file
                setMessage("Error fetchFileAndDirectory:" + response.status);
            }
        } catch (error) {
            setMessage("Error fetchFileAndDirectory:" + error);
        }
    }

    const createFolder = async () => {
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            const response = await fetch("http://3.26.57.153:8000/file/createFolder", {
                method: "POST",
                body: JSON.stringify({
                    name: detailClone,
                    parent_id: currentLocation,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });

            // Handle response
            if (response.ok) {
                // File uploaded successfully
                setMessage("Folder Created Successfully");
                await fetchFileAndDirectory(currentLocation);
            } else {
                // Error occurred while uploading file
                setMessage("Error folder creation:" + response.status);
            }
        } catch (error) {
            setMessage("Error folder creation:" + error);
        } finally {
            setDetailClone("");
            setIsAddOverlayShow(false);
            setIsCreateFolderOverlayShow(false)
            setIsMessageModalVisible(true)
        }
    }

    const deleteFile = async () => {
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            const response = await fetch(`http://3.26.57.153:8000/file/delete?file_name=${SelectedItem.oldName}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });
            // Handle response
            if (response.ok) {
                setMessage("File Deleted Successfully");
                await fetchFileAndDirectory(currentLocation);
            } else {
                // Error occurred while uploading file
                setMessage("Error file delete:" + response.status);
            }
        } catch (error) {
            setMessage("Error file delete:" + error);
        }
    }

    React.useEffect(() => {
        if (isFocused) {
            console.log("Do fetch here")
            fetchFileAndDirectory(currentLocation);
        }
    }, [isFocused]);

    React.useEffect(() => {
        setDetailClone(SelectedItem.name);
    }, [SelectedItem]);

    React.useEffect(() => {
        const filteredData = Items.filter((item) =>
            item.name.toLowerCase().includes(SearchKeyword.toLowerCase())
        );
        setSearchResult(filteredData);
    }, [SearchKeyword]);


    return (
        <View>
            <View style={styles.topbar}>
                <IoniconsIcon onPress={() => popStack()} name="arrow-back" style={currentLocation != "root" ? styles.backButton : { display: 'none' }} />
                <SearchBar
                    containerStyle={currentLocation != "root" ? styles.searchBar : { ...styles.searchBar, width: width * 0.87 }}
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
                        if (file.parent_id == currentLocation) {
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
                        if (file.parent_id == currentLocation) {
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
                    onBackdropPress={() => { setIsToolsOverlayShow(false); setSelectedItem(defaultSelectItem); }}
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
                    </View>
                    <TouchableOpacity style={styles.ToolsOverlayItems} onPress={() => { setIsDetailOverlayShow(true); }}>
                        <Text>Edit Name</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ToolsOverlayItems} onPress={() => { setIsMoveOverlayShow(true); }}>
                        <Text>Move</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ToolsOverlayItems} onPress={() => { deleteFile() }}>
                        <Text style={styles.warning}>Remove</Text>
                    </TouchableOpacity>
                </Overlay >


                <Overlay
                    isVisible={isAddOverlayShow}
                    onBackdropPress={() => { setIsAddOverlayShow(false); }}
                >
                    <Text style={styles.ItemName}>Add Item</Text>
                    <TouchableOpacity style={styles.ToolsOverlayItems} onPress={() => { setIsCreateFolderOverlayShow(true) }}>
                        <EntypoIcon name="folder" style={styles.ItemIcon} />
                        <Text>folder</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ToolsOverlayItems} onPress={() => {
                        setIsAddOverlayShow(false);
                        navigation.navigate("Upload")
                    }}>
                        <AntDesignIcon name="pdffile1" style={styles.ItemIcon} />
                        <Text>file</Text>
                    </TouchableOpacity>
                </Overlay>


                <Overlay
                    isVisible={isDetailOverlayShow}
                    onBackdropPress={() => { setIsDetailOverlayShow(false) }}
                >
                    <Text style={styles.ItemName}>Item Information</Text>
                    <SafeAreaView style={styles.ToolsOverlayItems}>
                        <Text style={{ margin: 10 }}>Item Name</Text>
                        <TextInput
                            onChangeText={setDetailClone}
                            value={detailClone}
                            placeholder="Item Name"
                            style={{ padding: 10, borderWidth: 1, borderRadius: 5, width: "100%" }}
                        />
                    </SafeAreaView>
                    <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center", }}>
                        <TouchableOpacity style={{ margin: 2, padding: 10, borderWidth: 1, borderRadius: 5 }} onPress={() => { setIsDetailOverlayShow(false) }}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ margin: 2, padding: 10, borderWidth: 1, borderRadius: 5 }} onPress={() => { }}>
                            <Text>Add</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </Overlay>

                <Overlay
                    isVisible={isCreateFolderOverlayShow}
                    onBackdropPress={() => { setIsCreateFolderOverlayShow(false) }}
                >
                    <Text style={styles.ItemName}>Item Information</Text>
                    <SafeAreaView style={styles.ToolsOverlayItems}>
                        <Text style={{ margin: 10 }}>Item Name</Text>
                        <TextInput
                            onChangeText={setDetailClone}
                            value={detailClone}
                            placeholder="Item Name"
                            style={{ padding: 10, borderWidth: 1, borderRadius: 5, width: "100%" }}
                        />
                    </SafeAreaView>
                    <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center", }}>
                        <TouchableOpacity style={{ margin: 2, padding: 10, borderWidth: 1, borderRadius: 5 }} onPress={() => { setIsCreateFolderOverlayShow(false) }}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ margin: 2, padding: 10, borderWidth: 1, borderRadius: 5 }} onPress={() => { createFolder() }}>
                            <Text>Add</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </Overlay>


                <Overlay
                    isVisible={isMoveOverlayShow}
                    onBackdropPress={() => { setIsMoveOverlayShow(false) }}
                >
                    <Text style={styles.ItemName}>Item Move</Text>
                    <SafeAreaView style={styles.ToolsOverlayItems}>
                        <Text style={{ margin: 10 }}>Choose Your location</Text>
                        <Picker
                            style={{ width: "100%" }}
                            selectedValue={targetLocation}
                            onValueChange={(itemValue, itemIndex) =>
                                setTargetLocation(itemValue)
                            }>
                            {
                                Items.map((item, index) => {
                                    if (item.type === "folder") {
                                        return (
                                            <Picker.Item label={item.name} value={item.id} key={index} />
                                        )
                                    }
                                    return null;
                                })
                            }
                        </Picker>
                    </SafeAreaView>
                    <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center", }}>
                        <TouchableOpacity style={{ margin: 2, padding: 10, borderWidth: 1, borderRadius: 5 }} onPress={() => { setIsMoveOverlayShow(false) }}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ margin: 2, padding: 10, borderWidth: 1, borderRadius: 5 }} onPress={() => {
                            setTargetLocation(0)
                        }}>
                            <Text>Add</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </Overlay>


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
            </View >
        </View >
    );
};

export default FileList;
