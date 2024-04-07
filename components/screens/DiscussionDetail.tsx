import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Dimensions, Image, Platform, Modal } from "react-native";
import React from "react";
import IMAGES from "../images";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { Overlay } from "react-native-elements";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DocumentPicker, {
    DirectoryPickerResponse,
    DocumentPickerResponse,
    isCancel,
    isInProgress,
    types,
} from 'react-native-document-picker';
import RNFS from 'react-native-fs';


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
    moreIcon: {
        margin: 5,
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
    paperClipButton: {
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



export default function DiscussionDetail({ route }) {
    const isFocused = useIsFocused();

    const { details } = route.params;

    const defaultData = {
        author: "",
        banner_img: {
            "file_name": "",
            "link": ""
        },
        category: "",
        comments: [],
        created_at: "",
        description: "",
        files: [],
        id: "",
        topic: "",
        updated_at: ""
    }

    const scrollViewRef = React.useRef<any>(null);

    const [data, setData] = React.useState<any>(defaultData);
    const [isOverlayShow, setIsOverlayShow] = React.useState(false);
    const [userInput, setUserInput] = React.useState("");
    const navigation = useNavigation();

    const [results, setResult] = React.useState<
        Array<DocumentPickerResponse>
    >([]);

    const [message, setMessage] = React.useState("");
    const [isMessageModalVisible, setIsMessageModalVisible] = React.useState(false);

    const goToBack = () => {
        navigation.goBack();
    };
    const onChangeText = (text) => {
        setUserInput(text)
    }

    const goToPdfViewer = (fileDetail: any) => {
        fileDetail = { ...fileDetail, oldName: fileDetail.file_name }

        navigation.navigate('PdfViewer', { fileDetail });
    };

    const goToPdfPreViewer = (file: any) => {
        console.log(file)
        navigation.navigate('PdfPreViewer', { fileDetail: file });
    }

    const sendComment = async () => {
        try {
            if (userInput == "") return
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            const formData = new FormData();
            formData.append('data', JSON.stringify({ discussion_id: details.id, detail: userInput }))
            if (results.length > 0) {
                await sendCommentFile()
                return;
            }

            const response = await fetch(`http://3.26.57.153:8000/comments/add_comment_xfile`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });
            // Handle response
            scrollViewRef.current.scrollToEnd({ animated: true });
            setUserInput("")
            setResult([])
            setMessage("Comment Sent")
            await fetchDiscussion();
            setIsMessageModalVisible(true)
        } catch (error) {
            console.log("Error sendComment:" + error);
        }
    }

    const sendCommentFile = async () => {
        try {
            if (userInput == "") return
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            const formData = new FormData();
            formData.append('data', JSON.stringify({ discussion_id: details.id, detail: userInput }))
            for (const file of results) {
                formData.append('files', file, file.name);
            }

            const response = await fetch(`http://3.26.57.153:8000/comments/add_comment`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });
            // Handle response
            scrollViewRef.current.scrollToEnd({ animated: true });
            setUserInput("")
            setResult([])
            setMessage("Comment Sent")
            await fetchDiscussion();
            setIsMessageModalVisible(true)
        } catch (error) {
            console.log("Error sendComment:" + error);
        }
    }

    const fetchDiscussion = async () => {
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            const response = await fetch(`http://3.26.57.153:8000/discussion/get_discussion?id=${details.id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });
            // Handle response
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setData(data)
            }
        } catch (error) {
            console.log("Error fetchAllDiscussions:" + error);
        }
    }

    const getComment = async () => {
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            const response = await fetch(`http://3.26.57.153:8000/comments/get_comments?discussion_id=${details.id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });
            // Handle response
            if (response.ok) {
                const result = await response.json();
                console.log("temp")
                console.log(data)
                //console.log({ ...data, comments: result })
                //setData({ ...data, comments: result })
            }
        } catch (error) {
            console.log("Error sendComment:" + error);
        }
    }

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

    const handleCross = (file: any) => {
        const newFiles = results.filter(item => item.fileCopyUri !== file.fileCopyUri)
        setResult(newFiles)
    }

    React.useEffect(() => {
        fetchDiscussion();

        const interval = setInterval(() => {
            fetchDiscussion();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        console.log(JSON.stringify(results));
        if (results.length > 0) {
            for (var result of results) {
                RNFS.readFile(result.fileCopyUri, 'base64')
            }
        }
    }, [results]);

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <IoniconsIcon
                    name="arrow-back"
                    style={styles.backButton}
                    onPress={() => goToBack()}
                />
                <FeatherIcon
                    name="more-vertical"
                    style={styles.moreIcon}
                    onPress={() => {
                        setIsOverlayShow(true);
                    }}
                />
            </View>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={() =>
                        scrollViewRef.current.scrollToEnd({ animated: true })
                    }
                    style={{ marginBottom: results.length > 0 ? 130 : 100, height: height * 0.3 }}>
                    <View style={{ marginHorizontal: 10, marginBottom: 30, paddingBottom: 30, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: "center",
                                padding: 5
                            }}>
                                <Image
                                    source={IMAGES.USER}
                                    style={{
                                        height: 50,
                                        width: 50,
                                        aspectRatio: 1,
                                        borderRadius: 25
                                    }}
                                />
                                <View style={{
                                    flexDirection: 'column',
                                    width: width * 0.83,
                                    padding: 5
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: "center",
                                        padding: 5
                                    }}>
                                        <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>{data.topic}</Text>
                                        <Text style={{ fontSize: 10, borderWidth: 1, borderColor: 'gray', borderRadius: 45, paddingHorizontal: 7 }}>{data.category}</Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        padding: 5
                                    }}>
                                        <Text style={{ fontSize: 13 }}>{`${data.author} ·  ${new Date(data.created_at).toLocaleString()}`}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Image
                            source={{ uri: data.banner_img.link }}
                            style={{
                                width: width * 0.95,
                                aspectRatio: 1,
                                borderRadius: 25,
                                marginBottom: 10
                            }}
                        />
                        <View style={{ paddingHorizontal: 20 }}>
                            <Text style={{ color: "black", fontSize: 18 }}>{data.description}</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginTop: 10, paddingHorizontal: 20 }}>
                            <Text style={{ fontWeight: "bold" }}>Reference Document:</Text>
                            {
                                data.files.length > 0 ?
                                    data.files.map((doc: any) => {
                                        return (
                                            <View>
                                                <TouchableOpacity onPress={() => { goToPdfViewer(doc) }} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                    <AntDesignIcon name="pdffile1" style={{
                                                        fontSize: 10,
                                                        color: "black",
                                                    }} />
                                                    <Text>  {doc.file_name.substring(doc.file_name.indexOf("_") + 1)}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                    : (<></>)
                            }
                        </View>
                    </View>
                    <View style={styles.commentsContainer}>
                        {
                            data.comments.length > 0 ? (
                                data.comments.map((comment, index) => {
                                    return (
                                        <View style={{
                                            borderBottomColor: 'gray',
                                            borderBottomWidth: (index == data.comments.length - 1 ? 0 : 0.5)
                                        }}>
                                            <View key={index} style={{
                                                flexDirection: 'row',
                                                justifyContent: 'flex-start',
                                                alignItems: "center",
                                                margin: 10,
                                                marginTop: 0,
                                                marginBottom: 5
                                            }}>
                                                <Image
                                                    source={IMAGES.USER}
                                                    style={{
                                                        height: 50,
                                                        width: 50,
                                                        aspectRatio: 1,
                                                        borderRadius: 25
                                                    }}
                                                />
                                                <View style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    margin: 10,
                                                }}>
                                                    <View style={{
                                                        justifyContent: 'flex-start',
                                                    }}>
                                                        <Text style={{ fontSize: 13 }}>{comment.author}</Text>
                                                        <Text style={{ marginVertical: 10, fontSize: 15, color: "black" }}>{comment.detail}</Text>
                                                    </View>
                                                    <Text style={{ fontSize: 13 }}>{new Date(comment.created_at).toLocaleString()}</Text>
                                                </View>
                                            </View>
                                            <View style={{
                                                flex: 1,
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                marginLeft: 10,
                                                paddingBottom: 10
                                            }}>
                                                {
                                                    comment.files.length > 0 ? (
                                                        <Text>Refer To:</Text>
                                                    ) : (<></>)
                                                }
                                                {
                                                    comment.files.length > 0 ?
                                                        comment.files.map((doc: any) => {
                                                            return (
                                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                                    <TouchableOpacity onPress={() => { goToPdfViewer(doc) }} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                                        <AntDesignIcon name="pdffile1" style={{
                                                                            fontSize: 10,
                                                                            color: "black",
                                                                        }} />
                                                                        <Text>  {doc.file_name.substring(doc.file_name.indexOf("_") + 1)}</Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            )
                                                        })
                                                        : (<></>)
                                                }
                                            </View>
                                        </View>
                                    )
                                })
                            ) : (
                                <View style={{ justifyContent: "center", alignItems: "center", margin: 30 }}>
                                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>--- Give The First Reply ---</Text>
                                </View>
                            )
                        }
                    </View>
                </ScrollView>
                <View style={{ ...styles.replyContainer, height: results.length > 0 ? 130 : 100 }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: "center",
                        paddingHorizontal: 10,
                        backgroundColor: "white"
                    }}>
                        <Image
                            source={IMAGES.USER}
                            style={{
                                height: 50,
                                width: 50,
                                aspectRatio: 1,
                                borderRadius: 25
                            }}
                        />
                        <View style={{ flex: 1 }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: "center",
                                marginTop: 5,
                                paddingLeft: 10,
                            }}>
                                {results.length > 0 ? (
                                    <View style={{ borderWidth: 1, borderRadius: 25, borderColor: "gray", padding: 7, paddingHorizontal: 10 }}>
                                        {
                                            results.map((item, index) => {
                                                return (
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-evenly',
                                                        alignItems: "center",
                                                    }}>
                                                        <TouchableOpacity key={index} onPress={() => { goToPdfPreViewer(item) }}>
                                                            <Text>{item.name}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => handleCross(item)}>
                                                            <Text style={{}}>   ✖ </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                ) : (<></>)}
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: "center",
                            }}>
                                <TextInput
                                    placeholder="Give a reply"
                                    multiline
                                    numberOfLines={3}
                                    style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 20, paddingRight: 40, paddingHorizontal: 7, flex: 1, margin: 10 }}
                                    onChangeText={onChangeText}
                                    value={userInput}
                                />
                                <View style={{ position: "absolute", right: 45 }}>
                                    <MaterialCommunityIcons
                                        name="paperclip"
                                        style={styles.paperClipButton}
                                        onPress={() => {
                                            DocumentPicker.pick({
                                                allowMultiSelection: false,
                                                type: [DocumentPicker.types.pdf],
                                                copyTo: 'cachesDirectory',
                                            })
                                                .then(setResult)
                                                .catch(handleError);
                                        }}
                                    />
                                </View>
                                <IoniconsIcon
                                    name="send"
                                    style={styles.sendButton}
                                    onPress={async () => { await sendComment() }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
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

            {/* Here is the modal */}
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
}