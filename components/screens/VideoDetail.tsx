import * as React from 'react';
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import Pdf from 'react-native-pdf';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import YoutubePlayer from "react-native-youtube-iframe";


import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    Alert,
    Button,
    TouchableOpacity,
    FlatList,
    ImageBackground,
    ActivityIndicator,
    Modal,
    Platform
} from 'react-native';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const VideoDetail = ({ route }) => {
    const { videoDetail, videos } = route.params;

    const navigation = useNavigation();
    const youtubePlayerRef = React.useRef();


    const defaultData = {
        id: "",
        url: "",
        title: "",
        thumbnail: "",
        author: "",
        views: "",
        length: "",
        publish_date: "",
        description: "",
        metadata: ""
    }

    const [video, setVideo] = React.useState(defaultData);
    const [selectedVideoUrl, setSelectedVideoUrl] = React.useState("");
    const [playing, setPlaying] = React.useState(false);
    const [playbackRate, setPlaybackRate] = React.useState(1);
    const [isLoop, setIsLoop] = React.useState(false)
    const [loading, setLoading] = React.useState(true);

    // use for display message with modal
    const [message, setMessage] = React.useState("");
    const [isMessageModalVisible, setIsMessageModalVisible] = React.useState(false);


    const goToBack = () => {
        navigation.goBack();
    };

    const changePlaybackRate = () => {
        const rate = [0.5, 1, 1.5]
        if (playbackRate == 1) {
            setPlaybackRate(1.5);
        } else if (playbackRate == 1.5) {
            setPlaybackRate(0.5);
        } else {
            setPlaybackRate(1);
        }
    };

    const fetchVideoInfo = async (url: string) => {
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            var response = await fetch(`http://3.26.57.153:8000/yt/get_video?url=${url}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });

            // Handle response
            if (response.ok) {
                const datas = await response.json();
                console.log(datas)
                datas.views = (parseInt(datas.views, 10) / 1000).toFixed(1) + "k";
                setVideo(datas)
            }
        } catch (error) {
            console.log("Fetch Video Info:" + error);
        } finally {
            setLoading(false)
            setSelectedVideoUrl("")
            setPlaying(true);
        }
    }

    const generateQuiz = async (url: string) => {
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            var response = await fetch(`http://3.26.57.153:8000/yt/generate_quiz?url=${url}&num_question=6`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });

            // Handle response
            if (response.ok) {
                const datas = await response.json();
                console.log(datas)
                setMessage("Request sent, check after 1 minute");
            }
        } catch (error) {
            console.log("Error in Generate Quiz:" + error);
            setMessage("Request Sent Failed");
        } finally {
            setIsMessageModalVisible(true)
        }
    }

    React.useEffect(() => {
        console.log(videoDetail)
        console.log(videos)
        fetchVideoInfo(videoDetail.url)
    }, [])

    React.useEffect(() => {
        if (selectedVideoUrl != "") {
            setLoading(true)
            fetchVideoInfo(selectedVideoUrl)
        }
    }, [selectedVideoUrl])

    const onStateChange = React.useCallback((state) => {
        console.log(state)
        if (state === "ended") {
            setPlaying(false);
            Alert.alert("video has finished playing!");
        }
    }, []);

    const togglePlaying = React.useCallback(() => {
        setPlaying((prev) => !prev);
    }, []);

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
                {loading ? (
                    <View style={{ height: height * 0.3, width: width, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" />
                    </View>
                ) : (
                    <View>
                        <YoutubePlayer
                            height={height * 0.3}
                            width={width}
                            initialPlayerParams={{ controls: false }}
                            play={playing}
                            videoId={video.id}
                            playbackRate={playbackRate}
                            onChangeState={onStateChange}
                        />
                        <View style={{ padding: 20, marginBottom: 20 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 15, color: "black" }}>{video.title}</Text>
                            <Text>Views: {video.views}</Text>
                        </View>
                    </View>
                )}
                <View style={{ flexDirection: "row", width: width, justifyContent: "space-evenly", marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => { setIsLoop(!isLoop) }} style={{ justifyContent: "center", alignItems: "center", backgroundColor: "white", borderWidth: 1, borderColor: "lightgray", borderRadius: 15, paddingHorizontal: 15, paddingVertical: 5 }} >
                        <Text>
                            {isLoop ? "Loop Enabled" : "Loop Disabled"}
                        </Text>
                    </TouchableOpacity >
                    <TouchableOpacity onPress={() => { generateQuiz(video.url) }} style={{ justifyContent: "center", alignItems: "center", backgroundColor: "white", borderWidth: 1, borderColor: "lightgray", borderRadius: 15, paddingHorizontal: 15, paddingVertical: 5 }} >
                        <Text>
                            Generate Quiz
                        </Text>
                    </TouchableOpacity >
                    <TouchableOpacity onPress={() => { changePlaybackRate() }} style={{ justifyContent: "center", alignItems: "center", backgroundColor: "white", borderWidth: 1, borderColor: "lightgray", borderRadius: 15, paddingHorizontal: 15, paddingVertical: 5 }}>
                        <Text>
                            Play Back Rate
                        </Text>
                    </TouchableOpacity >
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ paddingTop: 0, padding: 10 }}>
                        <Text style={{ fontWeight: "bold", color: "black" }}>Look For More: </Text>
                    </View>
                    <View style={{ height: loading ?  Platform.OS == "ios" ? (height * 0.65) : (height * 0.7) :  Platform.OS == "ios" ? (height * 0.35) : (height * 0.4) }}>
                        <FlatList
                            data={videos}
                            numColumns={1}
                            keyExtractor={(item, index) => index + ""}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    < View key={index} style={styles.listItemContainer} >
                                        <TouchableOpacity onPress={() => { setSelectedVideoUrl(item.url) }} style={styles.listItem} >
                                            <View>
                                                <ImageBackground source={{ uri: item.thumbnail }} style={{ width: width, aspectRatio: 2, resizeMode: 'contain' }}>
                                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                                        <Text style={{
                                                            backgroundColor: "black",
                                                            color: "white",
                                                            padding: 5,
                                                            fontWeight: "bold"
                                                        }}>
                                                            {item.length}
                                                        </Text>
                                                    </View>
                                                </ImageBackground>
                                            </View>
                                            <View style={{ marginTop: 5, paddingHorizontal: 15, marginBottom: 15, flexDirection: "column" }}>
                                                <Text style={{ fontSize: 15, color: "black" }}>{item.title}</Text>
                                                <Text style={{ fontSize: 12 }}>Viewed  {item.views}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                        />
                    </View>
                </View>
                {/* Message Modal */}
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
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffedd5',
        width: width,
        height: height,
    },
    topbar: {
        paddingTop:  Platform.OS == "ios" ? 20 : 0,
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
    listItemContainer: {
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        width: width,
    },
    listItem: {
        flexDirection: "column",
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

export default VideoDetail;
