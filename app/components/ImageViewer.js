import React from 'react';
import { TouchableOpacity, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { Feather } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';

const ImageEnlargeViewer = ({
  images,
  index,
  isImgModalOpen,
  setIsImgModalOpen,
}) => (
  <Modal visible={isImgModalOpen} transparent>
    <ImageViewer imageUrls={images} index={index} />
    <TouchableOpacity
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
      }}
      onPress={() => setIsImgModalOpen(false)}
    >
      <Feather name="x" size={26} color="red" />
    </TouchableOpacity>
  </Modal>
);

ImageEnlargeViewer.propTypes = {
  images: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  isImgModalOpen: PropTypes.bool.isRequired,
  setIsImgModalOpen: PropTypes.func.isRequired,
};

export default ImageEnlargeViewer;
