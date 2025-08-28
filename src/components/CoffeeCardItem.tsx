import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { themeColors } from '../theme/index';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


interface CoffeeItem {
  id: number;
  name: string;
  price: string;
  volume: string;
  stars: string;
  image: any;
  desc: string;
}

export default function CoffeeCardItem({ item }: { item: CoffeeItem }) {

    const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');

    const CARD_WIDTH = SCREEN_W * 0.7;
    const CARD_HEIGHT = SCREEN_H * 0.5;

type RootStackParamList = {
  detail: CoffeeItem;
};

const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


    return (
        <TouchableOpacity
            style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT
            }}
            className='relative items-center overflow-visible'
            onPress={() => navigation.navigate('detail', { ...item })}
        >
            <LinearGradient
                colors={[themeColors.bgPrimary, themeColors.bgSecondary]}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT - (CARD_WIDTH * 0.5) / 2,
                    borderRadius: 40
                }}

            />

            <Image
                source={item.image}
                className='absolute shadow-2xl'
                resizeMode='cover'
                style={{
                    width: CARD_WIDTH * 0.8,
                    height: CARD_HEIGHT * 0.5,
                    top: CARD_HEIGHT * 0.02

                }}
            />

            <View className='absolute bottom-2 w-full p-4 space-y-2'>
                <Text className='text-3xl text-white font-semibold z-10'>
                    {item.name}
                </Text>

                <View className="bg-white/20 rounded-full mt-4 px-2 py-1 w-14 items-center">
                    <Text className="text-sm font-semibold text-white">
                        {item.stars}
                    </Text>
                </View>

                <Text className="text-base mt-2 text-white opacity-70">
                    Volume {item.volume}
                </Text>

                <View className='flex-row justify-between items-center mt-2'>
                    <Text className='text-white text-lg font-semibold'>
                       ${item.price}
                    </Text>

                    <TouchableOpacity
                        className='w-14 h-14  rounded-full items-center justify-center'
                        onPress={()=>navigation.navigate('detail',{...item})}
                    >
                        <AntDesign name="pluscircle" size={47} color="white" />
                    </TouchableOpacity>

                </View>


            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})