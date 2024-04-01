import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Dimensions, Image } from "react-native";
import React from "react";
import IMAGES from "../images";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { Overlay } from "react-native-elements";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DocumentPicker, {
    DirectoryPickerResponse,
    DocumentPickerResponse,
    isCancel,
    isInProgress,
    types,
} from 'react-native-document-picker';




const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffedd5',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
    },
    backButton: {
        margin: 5,
        fontSize: 40,
        color: "black",
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: 'black',
    },
    discussionConatiner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        paddingHorizontal: 20,
        padding: 5,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        backgroundColor: '#ffedd5'
    },
    createDiscussionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 45,
        padding: 2,
        paddingHorizontal: 5,
        backgroundColor: 'white'
    },
    submitIcon: {
        fontSize: 30,
        color: "black",
    },
    commentsContainer: {

    },
    replyContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    sendButton: {
        margin: 5,
        fontSize: 20,
        color: "black",
    },
    ItemName: {
        fontSize: 16,
        margin: 5,
    },
    bookmarkIcon: {
        fontSize: 30,
        color: "black",
        margin: 10,
    },
    reportIcon: {
        fontSize: 30,
        color: "red",
        margin: 10,
    },
    ToolsOverlayItems: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        margin: 20,
        width: width * 0.5,
    },
})



export default function CreateDiscussion() {

    const defaultUpdateFile = {
        name: "Add Document",
        type: "add",
        size: 0
    }

    const [isOverlayShow, setIsOverlayShow] = React.useState(false);

    const [files, setFiles] = React.useState<any[]>([defaultUpdateFile]);
    const [banner, setBanner] = React.useState<any>(null);


    const [expandPart1, setExpandPart1] = React.useState(false);
    const [expandPart2, setExpandPart2] = React.useState(false);
    const [expandPart3, setExpandPart3] = React.useState(false);
    const [expandPart4, setExpandPart4] = React.useState(false);

    const navigation = useNavigation();


    const goToBack = () => {
        navigation.goBack();
    };


    const sendDiscussion = async () => {
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            const formdata = new FormData();
            formdata.append("data", JSON.stringify({
                topic: "Fuck You 123", category: "EE4070", description: "No comments!"
            }))
            formdata.append("banner_img", banner, banner.name)
            for (var i = 0; i < files.length - 1; i++) {
                formdata.append("files", files[i], files[i].name)
            }

            const response = await fetch(`http://3.26.57.153:8000/discussion/add_discussion`,
                {
                    method: "POST",
                    body: formdata,
                    headers: {
                        Authorization: `Bearer ${userinfo.token}`,
                    },
                });
            // Handle response
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            }
        } catch (error) {
            console.log("Error sendComment:" + error);
        }
    }

    const handleError = (message: any) => {
        console.log(`Error: ${message}`)
    }

    const handleUploadFile = (fileInfos: any[]) => {
        const newFiles = [...files];
        fileInfos.map((fileInfo) => {
            fileInfo.size = (fileInfo.size / 8 / 1024).toFixed(2)
            newFiles.unshift(fileInfo)
        })
        setFiles(newFiles);
    }

    const handleUploadImage = (ImageInfos: any[]) => {
        setBanner(ImageInfos[0]);
    }


    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <IoniconsIcon
                    name="arrow-back"
                    style={styles.backButton}
                    onPress={() => goToBack()}
                />
                <TouchableOpacity
                    style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderColor: "gray", borderWidth: 1, borderRadius: 15, padding: 10, paddingHorizontal: 15, backgroundColor: "white" }}
                    onPress={() => {
                        sendDiscussion();
                    }}>
                    <Text style={{ fontWeight: "bold", fontSize: 20, color: "black", marginRight: 5 }}>Send</Text>
                    <IoniconsIcon
                        name="send"
                        style={styles.submitIcon}
                    />
                </TouchableOpacity>
            </View>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    style={{}}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <View style={{ width: width * 0.9, margin: 10, padding: 20, borderColor: "gray", borderWidth: 1, borderRadius: 15, backgroundColor: "lightgray" }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 }}>
                                <Text style={{ fontWeight: "bold", fontSize: 20, color: "black" }}>Category</Text>
                                {expandPart1 ?
                                    <EntypoIcon name="minus" style={{ fontWeight: "bold", fontSize: 20, color: "black" }} onPress={() => {
                                        setExpandPart1(false);
                                    }} />
                                    :
                                    <EntypoIcon name="plus" style={{ fontWeight: "bold", fontSize: 20, color: "black" }} onPress={() => {
                                        setExpandPart1(true);
                                    }} />
                                }
                            </View>
                        </View>
                        <View style={{ width: width * 0.9, margin: 10, padding: 20, borderColor: "gray", borderWidth: 1, borderRadius: 15, backgroundColor: "lightgray" }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 }}>
                                <Text style={{ fontWeight: "bold", fontSize: 20, color: "black" }}>Content</Text>
                                {expandPart2 ?
                                    <EntypoIcon name="minus" style={{ fontWeight: "bold", fontSize: 20, color: "black" }} onPress={() => {
                                        setExpandPart2(false);
                                    }} />
                                    :
                                    <EntypoIcon name="plus" style={{ fontWeight: "bold", fontSize: 20, color: "black" }} onPress={() => {
                                        setExpandPart2(true);
                                    }} />
                                }
                            </View>
                        </View>
                        <View style={{ width: width * 0.9, margin: 10, padding: 20, borderColor: "gray", borderWidth: 1, borderRadius: 15, backgroundColor: "lightgray" }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 }}>
                                <Text style={{ fontWeight: "bold", fontSize: 20, color: "black" }}>Banner</Text>
                                {expandPart3 ? (
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        {banner != null ? (
                                            <EntypoIcon name="trash" style={{ fontSize: 15, color: "black", marginRight: 10 }} onPress={() => {
                                                setBanner(null)
                                            }} />
                                        ) : (<></>)}
                                        <EntypoIcon name="minus" style={{ fontWeight: "bold", fontSize: 20, color: "black" }} onPress={() => {
                                            setExpandPart3(false);
                                        }} />
                                    </View>
                                )
                                    :
                                    <EntypoIcon name="plus" style={{ fontWeight: "bold", fontSize: 20, color: "black" }} onPress={() => {
                                        setExpandPart3(true);
                                    }} />
                                }
                            </View>
                            {expandPart3 ?
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10, padding: 10 }}>
                                    <View>
                                        {banner != null ? (
                                            <View>
                                                <Image source={banner} style={{ width: width * 0.65, height: width * 0.65, borderRadius: 15 }} />
                                            </View>
                                        ) : (
                                            <TouchableOpacity
                                                style={{ justifyContent: "center", alignItems: "center", width: width * 0.65, margin: 10, padding: 10, borderColor: "gray", borderWidth: 1, borderRadius: 15, backgroundColor: "gray" }}
                                                onPress={() => {
                                                    DocumentPicker.pick({
                                                        allowMultiSelection: false,
                                                        type: [DocumentPicker.types.images],
                                                        copyTo: 'cachesDirectory',
                                                    })
                                                        .then(handleUploadImage)
                                                        .catch(handleError);
                                                }}
                                            >
                                                <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>Add Image</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View> : <></>
                            }
                        </View>
                        <View style={{ width: width * 0.9, margin: 10, padding: 20, borderColor: "gray", borderWidth: 1, borderRadius: 15, backgroundColor: "lightgray" }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 }}>
                                <Text style={{ fontWeight: "bold", fontSize: 20, color: "black" }}>File</Text>
                                {expandPart4 ?
                                    <EntypoIcon name="minus" style={{ fontWeight: "bold", fontSize: 20, color: "black" }} onPress={() => {
                                        setExpandPart4(false);
                                    }} />
                                    :
                                    <EntypoIcon name="plus" style={{ fontWeight: "bold", fontSize: 20, color: "black" }} onPress={() => {
                                        setExpandPart4(true);
                                    }} />
                                }
                            </View>
                            {expandPart4 ?
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 10, padding: 10 }}>
                                    <View>
                                        {files.map((file) => {
                                            if (file.type != "add") {
                                                return (
                                                    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", width: width * 0.65, margin: 10, padding: 10, borderColor: "gray", borderWidth: 1, borderRadius: 15, backgroundColor: "lightgray" }}>
                                                        <View style={{ flexDirection: 'row', width: width * 0.6, justifyContent: 'flex-end', alignItems: 'center' }}>
                                                            <EntypoIcon name="trash" style={{ fontSize: 15, color: "black" }} onPress={() => {
                                                                setFiles([...files.filter((f) => { return f.name != file.name })])
                                                            }} />
                                                        </View>
                                                        <IoniconsIcon
                                                            name="document"
                                                            style={{ fontWeight: "bold", fontSize: 30, color: "black" }}
                                                        />
                                                        <Text style={{ fontWeight: "bold", fontSize: 20, color: "black" }}>{file.name}</Text>
                                                        <Text style={{ fontWeight: "bold", fontSize: 15, color: "black" }}>{file.size}MB</Text>
                                                    </TouchableOpacity>
                                                )
                                            } else {
                                                return (
                                                    <TouchableOpacity
                                                        style={{ justifyContent: "center", alignItems: "center", width: width * 0.65, margin: 10, padding: 10, borderColor: "gray", borderWidth: 1, borderRadius: 15, backgroundColor: "gray" }}
                                                        onPress={() => {
                                                            DocumentPicker.pick({
                                                                allowMultiSelection: true,
                                                                type: [DocumentPicker.types.pdf],
                                                                copyTo: 'cachesDirectory',
                                                            })
                                                                .then(handleUploadFile)
                                                                .catch(handleError);
                                                        }}
                                                    >
                                                        <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>{file.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            }
                                        })}
                                    </View>
                                </View> : <></>
                            }
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>

            < Overlay
                isVisible={isOverlayShow}
                onBackdropPress={() => {
                    setIsOverlayShow(false)
                }}
            >
                <Text style={styles.ItemName}>Action</Text>
                <TouchableOpacity style={styles.ToolsOverlayItems}>
                    <EntypoIcon name="flag" style={styles.reportIcon} />
                    <Text style={{ color: "red" }}>Report</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ToolsOverlayItems}>
                    <FontAwesomeIcon name="bookmark" style={styles.bookmarkIcon} />
                    <Text style={{ color: "black" }}>Bookmark</Text>
                </TouchableOpacity>
            </Overlay >
        </View>
    )
}