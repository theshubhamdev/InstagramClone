import {View, Image, FlatList, useWindowDimensions, ViewabilityConfig, ViewToken} from 'react-native';
import React, {useRef, useState} from 'react';
import colors from '../../theme/colors';
import DoublePressable from '../DoublePressable/DoublePressable';

interface ICarousel {
  images: string[];
  onDoublePress?: () => void;
}

const Carousel = ({images, onDoublePress = () => {}}: ICarousel) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
    const { width } = useWindowDimensions();
    
    const viewabilityConfig: ViewabilityConfig = {
        itemVisiblePercentThreshold:51
    }
    const onViewableItemsChanged = useRef(( {viewableItems}: { viewableItems: Array<ViewToken> }) => {
        if (viewableItems.length > 0) {
            setActiveImageIndex(viewableItems[0].index || 0)
        }
    })
  return (
    <View>
      <FlatList
        data={images}
        renderItem={({item}) => (
          <DoublePressable onDoublePress={onDoublePress}>
            <Image source={{uri: item}} style={{width, aspectRatio: 1}} />
          </DoublePressable>
        )}
        horizontal
              pagingEnabled
              viewabilityConfig={viewabilityConfig}
              onViewableItemsChanged={onViewableItemsChanged.current}
      />
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          bottom: 0,
          justifyContent: 'center',
          width: '100%',
        }}>
        {images.map((_, index) => (
          <View
            style={{
              width: 10,
              borderRadius: 5,
              backgroundColor:
                activeImageIndex === index ? colors.primary : colors.white,
              aspectRatio: 1,
              margin: 10,
              marginHorizontal: 5,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default Carousel;
