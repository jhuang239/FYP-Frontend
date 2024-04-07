import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Dimensions, Image, Modal, Platform } from "react-native";
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
import { Input } from 'react-native-elements';




const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS == "ios" ? 20 : 0,
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
        fontSize: 15,
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
})



export default function CreateDiscussion() {

    const defaultUpdateFile = {
        name: "Add Document",
        type: "add",
        size: 0
    }

    const [modalMessage, setModalMessage] = React.useState("")
    const [isMessageModalVisible, setIsMessageModalVisible] = React.useState(false);
    const [passVaildation, setPassVaildation] = React.useState(false)

    const [title, setTitle] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [content, setContent] = React.useState("");
    const [banner, setBanner] = React.useState<any>(null);
    const [files, setFiles] = React.useState<any[]>([defaultUpdateFile]);


    const [expandPart1, setExpandPart1] = React.useState(false);
    const [expandPart2, setExpandPart2] = React.useState(false);
    const [expandPart3, setExpandPart3] = React.useState(false);
    const [expandPart4, setExpandPart4] = React.useState(false);

    const navigation = useNavigation();


    const goToBack = () => {
        navigation.goBack();
    };

    const goToPdfPreViewer = (file: any) => {
        console.log(file)
        navigation.navigate('PdfPreViewer', { fileDetail: file });
    }


    const sendDiscussion = async () => {
        if (title == "" || category == "" || content == "" || banner == null) {
            setModalMessage("Missing Information")
            setIsMessageModalVisible(true)
            return;
        } else {
            setPassVaildation(true)
        }
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            const formdata = new FormData();
            formdata.append("data", JSON.stringify({
                topic: title,
                category: category,
                description: content
            }))
            if (banner) {
                formdata.append("banner_img", banner, banner.name)
            }
            if (files.length > 0) {
                for (var i = 0; i < files.length - 1; i++) {
                    formdata.append("files", files[i], files[i].name)
                }
            } else {
                formdata.append("files", null)
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
                console.log("pass");
                const data = await response.json();
                console.log(data);
                setModalMessage("Creation Success")
            }
        } catch (error) {
            console.log("Error sendComment:" + error);
            setModalMessage("Creation Failed: " + error)
        } finally {
            setIsMessageModalVisible(true)
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

    React.useEffect(() => {
        if (!isMessageModalVisible && passVaildation) {
            navigation.goBack();
        }
    }, [isMessageModalVisible]);


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
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "black", marginRight: 5 }}>Create Now</Text>
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
                                <Text style={{ fontWeight: "bold", fontSize: 20, color: "black" }}>General Information</Text>
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
                            <View>
                                {expandPart1 ? (
                                    <View>
                                        <View style={{ margin: 15, marginBottom: 0 }}>
                                            <Input
                                                label="Discussion Title"
                                                placeholder="Fill Here"
                                                value={title}
                                                onChangeText={setTitle}
                                            />
                                        </View>
                                        <View style={{ margin: 15, marginBottom: 0 }}>
                                            <Input
                                                label="Discussion Category"
                                                placeholder="Fill Here"
                                                leftIcon={{ type: 'font-awesome', name: 'navicon' }}
                                                value={category}
                                                onChangeText={setCategory}
                                            />
                                        </View>
                                    </View>
                                ) : (<></>)}
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
                            <View>
                                {expandPart2 ? (
                                    <View style={{ marginTop: 15, marginHorizontal: 5, marginBottom: 0 }}>
                                        <Input
                                            inputContainerStyle={{ borderBottomWidth: 0 }}
                                            style={{ padding: 10, borderWidth: 1, borderColor: "gray", borderRadius: 15, textAlignVertical: "top" }}
                                            multiline
                                            numberOfLines={10}
                                            label="Discussion Content"
                                            placeholder="Fill Here"
                                            value={content}
                                            onChangeText={setContent}
                                        />
                                    </View>
                                ) : (<></>)}
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
                                        {files.map((file, index) => {
                                            if (file.type != "add") {
                                                return (
                                                    <TouchableOpacity
                                                        style={{ justifyContent: "center", alignItems: "center", width: width * 0.65, margin: 10, padding: 10, borderColor: "gray", borderWidth: 1, borderRadius: 15, backgroundColor: "lightgray" }}
                                                        onPress={() => {
                                                            goToPdfPreViewer(file)
                                                        }}
                                                        key={index}
                                                    >
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
                                                        key={index}
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

            <Modal
                animationType="fade"
                transparent={true}
                visible={isMessageModalVisible}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>{modalMessage}</Text>
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => setIsMessageModalVisible(false)}>
                        <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}