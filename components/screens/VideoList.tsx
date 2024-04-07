import * as React from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Text,
    SafeAreaView,
    TextInput,
    Modal,
    Image,
    ImageBackground,
    ActivityIndicator,
    Platform
} from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import { SearchBar, Overlay } from "react-native-elements";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { set } from "react-hook-form";
import axios from 'axios';
import LoaderKit from 'react-native-loader-kit'


const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
    topbar: {
        paddingTop: Platform.OS == "ios" ? 20 : 0,
        flexDirection: "row",
        alignItems: "center",
        width: width,
        backgroundColor: "#ffedd5",
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffedd5",
        height: Platform.OS == "ios" ? height * 0.87 : height * 0.9,
        width: width
    },
    searchBar: {
        padding: 20,
        paddingRight: 10,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: width * 0.8,
        backgroundColor: "#ffedd5",
        borderBottomWidth: 0,
        borderTopWidth: 0
    },
    backButton: {
        marginLeft: 10,
        fontSize: 24,
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

const VideoList = () => {
    const flatListRef = React.useRef<any>(null);

    const [SearchKeyword, setSearchKeyword] = React.useState("");
    const [isSearchLoading, setIsSearchLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [videos, setVideos] = React.useState([]);

    // use for display message with modal
    const [message, setMessage] = React.useState("");
    const [isMessageModalVisible, setIsMessageModalVisible] = React.useState(false);

    const navigation = useNavigation();

    const goToBack = () => {
        navigation.goBack();
    };

    const goToVideoDetail = (selectedVideo: any) => {
        const shuffled = videos.sort(() => 0.5 - Math.random());
        navigation.navigate('VideoDetail', { videoDetail: selectedVideo, videos: shuffled.slice(0, 7) });
    };

    const toTop = () => {

    }

    const searchWithKeyword = async (currentPage: number) => {
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            var response = await fetch(`http://3.26.57.153:8000/yt/search?query=${SearchKeyword}&page=${currentPage}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });

            // Handle response
            if (response.ok) {
                const datas = await response.json();
                console.log(datas)
                for (var data of datas.video_list) {
                    data.views = (parseInt(data.views, 10) / 1000).toFixed(1) + "k";
                    data.length = data.length / 60 >= 60 ? `${Math.floor(data.length / 60 / 60)}:${Math.floor((data.length / 60) % 60)}:${data.length % 60}` : `${Math.floor(data.length / 60)}:${data.length % 60}`;
                    const timeDifference = new Date().getTime() - new Date(data.publish_date).getTime();

                    if (timeDifference < 30 * 24 * 60 * 60 * 1000) {
                        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                        data.publish_date = `${days} day${days > 1 ? 's' : ''} ago`;
                    } else if (timeDifference < 24 * 60 * 60 * 1000 * 365) {
                        const months = Math.floor(timeDifference / (24 * 60 * 60 * 1000 * 30));
                        data.publish_date = `${months} month${months > 1 ? 's' : ''} ago`;
                    } else {
                        const years = Math.floor(timeDifference / (24 * 60 * 60 * 1000 * 365));
                        data.publish_date = `${years} year${years > 1 ? 's' : ''} ago`;
                    }
                }
                return datas.video_list;
            }
        } catch (error) {
            console.log("Fetch Video Info:" + error);
        } finally {
            setIsSearchLoading(false)
        }
    }

    const handleOnEndReached = async () => {
        setIsSearchLoading(true)
        const result = await searchWithKeyword(page + 1);
        setVideos([...videos, ...result])
        setPage(page + 1)
    }

    const handleSearch = async () => {
        setIsSearchLoading(true)
        flatListRef.current?.scrollToOffset({ animated: false, offset: 0 })
        setVideos([])
        setPage(1)
        const result = await searchWithKeyword(1);
        setVideos(result)
    }


    return (
        <View>
            <View style={styles.topbar}>
                <IoniconsIcon onPress={() => goToBack()} name="arrow-back" style={styles.backButton} />
                <SearchBar
                    containerStyle={styles.searchBar}
                    placeholder="Search Here..."
                    onChangeText={setSearchKeyword}
                    disabled={isSearchLoading}
                    value={SearchKeyword}
                    lightTheme={true}
                    round={true}
                />
                {isSearchLoading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <IoniconsIcon onPress={() => { handleSearch() }} name="search" style={{
                        marginLeft: 10,
                        fontSize: 24,
                        color: "black",
                    }} />
                )
                }
            </View>
            <View style={styles.container}>
                {
                    videos.length != 0 ? (
                        <FlatList
                            ref={flatListRef}
                            data={videos}
                            numColumns={1}
                            keyExtractor={(item, index) => index + ""}
                            showsVerticalScrollIndicator={false}
                            onEndReached={handleOnEndReached}
                            renderItem={({ item, index }) => {
                                return (
                                    < View key={index} style={styles.listItemContainer} >
                                        <TouchableOpacity onPress={() => { goToVideoDetail(item) }} style={styles.listItem} >
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
                                                <Text style={{ fontSize: 12 }}>{item.author} • Views：{item.views} • {item.publish_date}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                        />) : (
                        isSearchLoading ? (
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <LoaderKit
                                    style={{ width: 50, height: 50 }}
                                    name={'BallZigZag'}
                                    color={'red'}
                                />
                            </View>
                        ) : (
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontWeight: "bold", fontSize: 25, color: "gray" }}>Start Assessment By Searching</Text>
                            </View>
                        )
                    )



                }

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
            </View >
        </View >
    );
};

export default VideoList;
