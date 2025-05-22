import React, { useRef, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '0',
        image: require('../img/burger1.jpg'),
        title: 'Chúng tôi phục vụ những món ăn tuyệt vời',
        subtitle: 'Tất cả nhà hàng tốt nhất với thực đơn hấp dẫn đang chờ bạn, họ không thể chờ đơn đặt hàng của bạn!!',
    },
    {
        id: '1',
        image: require('../img/burger2.jpg'),
        title: 'Khám phá đầu bếp & món ăn hàng đầu',
        subtitle: 'Những món ngon từ các đầu bếp xuất sắc nhất ngay trong tầm tay bạn.',
    },
    {
        id: '2',
        image: require('../img/burger1.jpg'),
        title: 'Giao hàng nhanh chóng, đảm bảo',
        subtitle: 'Đồ ăn của bạn sẽ luôn tươi ngon và đến đúng giờ, mọi lúc.',
    },
];

const Onboarding = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef();

    const handleScrollEnd = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const renderItem = ({ item }) => (
        <ImageBackground source={item.image} style={styles.image}>
            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>

                <View style={styles.dots}>
                    {slides.map((_, i) => (
                        <View key={i} style={[styles.dot, i === currentIndex && styles.activeDot]} />
                    ))}
                </View>

                <View style={styles.bottomRow}>
                    <TouchableOpacity onPress={handleSkip}>
                        <Text style={styles.skip}>Bỏ qua</Text>
                    </TouchableOpacity>

                    {currentIndex < slides.length - 1 ? (
                        <TouchableOpacity onPress={handleNext}>
                            <Text style={styles.next}>Tiếp tục →</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.arrowBtn} onPress={() => navigation.replace('Login')}>
                            <Text style={styles.arrow}>→</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ImageBackground>
    );

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
        }
    };

    const handleSkip = () => {
        flatListRef.current.scrollToIndex({ index: slides.length - 1 });
    };

    return (
        <FlatList
            data={slides}
            ref={flatListRef}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            onMomentumScrollEnd={handleScrollEnd}
        />
    );
};

const styles = StyleSheet.create({
    image: {
        width: width,
        height: height,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    content: {
        width: '80%',
        height: '45%',
        backgroundColor: '#FF7F00',
        borderRadius: 40,
        paddingVertical: 30,
        paddingHorizontal: 20,
        marginBottom: 50,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    dots: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff5',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#fff',
    },
    bottomRow: {
        height: 48,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    skip: {
        color: 'white',
        fontSize: 16,
    },
    next: {
        color: 'white',
        fontSize: 16,
    },
    arrowBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrow: {
        fontSize: 20,
        color: 'white',
    },
});

export default Onboarding;
