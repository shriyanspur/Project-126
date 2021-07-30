import * as React from 'react';
import { Text, Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class Camera extends React.Component {
  state = {
    image: null,
  };

  askPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Please allow us to use the camera!');
      }
    }
  };

  choose_img = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.data });
        console.log(result.uri);
        this.uploadImage(result.uri);
      }
    } catch (E) {
      console.log(E);
    }
  };

  upload_img = async (uri) => {
    const data = new FormData();
    let filename = uri.split('/')[uri.split('/').length - 1];
    let type = `image/${uri.split('.')[uri.split('.').length - 1]}`;
    const fileToUpload = { uri: uri, name: filename, type: type };
    data.append('digits', fileToUpload);
    fetch('https://f292a3137990.ngrok.io/predict-digit', {
      method: 'POST',
      body: data,
      headers: { 'content-type': 'multipart/form-data' },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  componentDidMount() {
    this.askPermission();
  }

  render() {
    return (
      <View>
        <Text>Pick an image</Text>

        <Button title="Choose" onPress={this.choose_img} />
      </View>
    );
  }
}
