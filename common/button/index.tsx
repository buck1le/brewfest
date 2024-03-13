
import { Pressable, Text } from 'react-native';

const Button = (props) => {
  const { children, ...rest } = props;
  return <Pressable {...rest}>{children}</Pressable>;
}
