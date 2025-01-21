import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width });
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
};

