import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Dimensions, Image } from "react-native";
import React from "react";
import IMAGES from "../images";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { Overlay } from "react-native-elements";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';




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

    const goToBack = () => {
        navigation.goBack();
    };
    const onChangeText = (text) => {
        setUserInput(text)
    }

    const goToPdfViewer = (fileDetail: any) => {
        console.log(fileDetail)
        fileDetail = { ...fileDetail, oldName: fileDetail.file_name }

        navigation.navigate('PdfViewer', { fileDetail });
    };

    const sendComment = async () => {
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            const response = await axios.post(`http://3.26.57.153:8000/comments/add_comment`,
                {
                    discussion_id: details.id,
                    detail: userInput
                },
                {
                    headers: {
                        Authorization: `Bearer ${userinfo.token}`,
                    },
                });
            // Handle response
            scrollViewRef.current.scrollToEnd({ animated: true });
            setUserInput("")
            await fetchDiscussion();

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

    React.useEffect(() => {
        fetchDiscussion();

        const interval = setInterval(() => {
            fetchDiscussion();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

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
                    style={{ marginBottom: 100, height: height * 0.3 }}>
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
                            data.comments > 0 ? (
                                data.comments.map((comment, index) => {
                                    return (
                                        <View key={index} style={{
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start',
                                            alignItems: "center",
                                            margin: 10,
                                            marginTop: 0,
                                            borderBottomColor: 'gray',
                                            borderBottomWidth: (index == data.comments.length - 1 ? 0 : 0.5)
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
                                                    <Text style={{ fontSize: 15, color: "black" }}>{comment.detail}</Text>
                                                </View>
                                                <Text style={{ fontSize: 13 }}>{new Date(comment.created_at).toLocaleString()}</Text>
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
                <View style={styles.replyContainer}>
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
                                justifyContent: 'space-between',
                                alignItems: "center",
                            }}>
                                <TextInput
                                    placeholder="Give a reply"
                                    multiline
                                    numberOfLines={3}
                                    style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 20, paddingHorizontal: 7, flex: 1, margin: 10 }}
                                    onChangeText={onChangeText}
                                    value={userInput}
                                />
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
        </View>
    )
}