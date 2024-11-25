import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from '../style/Global';

const Sobre = () => {

    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Este é um aplicativo que ajuda você a visualizar como um produto novo irá impactar o seu estoque.
        </Text>
        <Text style={styles.text}>
        </Text>
      </View>
    );
  };
export default Sobre;