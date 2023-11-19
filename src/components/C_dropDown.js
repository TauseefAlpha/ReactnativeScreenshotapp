import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const C_Dropdown = props => {
  const pickerRef = useRef();
  const [selectBusiness,setselectedBusiness]=useState()

  return (
    <View style={styles.DropDownContainer}>
      <Picker
        ref={pickerRef}
        selectedValue={selectBusiness}
        onValueChange={(itemValue, itemIndex) => {
          setselectedBusiness(itemValue);
          props.onValueChange(itemValue);
        }}
        enabled={true}
        mode={'dialog'}
        dropdownIconColor={'black'}
        prompt={props.titleText}
        selectionColor={'black'}
        itemStyle={styles.itemsStyle}>
        {props.options?.map((option, index) => (
          <Picker.Item
            key={index}
            label={option.select_bussiness}
            value={option.select_bussiness}
            color={"black"}
          />
        ))}
      </Picker>
    </View>
  );
};

export default C_Dropdown;

const styles = StyleSheet.create({
  DropDownContainer: {
    paddingHorizontal: 5,
    width: '68%',
    borderRadius: 6,
    marginTop: 6,
    height: 53,
    backgroundColor: 'white',
  },
  itemsStyle: {
    color: "black",
    fontWeight: '400',
  },
  containerStyle: {
    zIndex: 100,
  },
});
