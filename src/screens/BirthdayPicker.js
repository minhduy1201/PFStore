import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// Hàm chuyển đổi định dạng
const formatDateToDisplay = (isoDate) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`;
};
const formatDateToISO = (displayDate) => {
  if (!displayDate) return "";
  const [day, month, year] = displayDate.split("-");
  return `${year}-${month}-${day}`;
};

const defaultBirthday = "01-01-2000";

const BirthdayPicker = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [displayValue, setDisplayValue] = useState(defaultBirthday);

  useEffect(() => {
    setDisplayValue(value ? formatDateToDisplay(value) : defaultBirthday);
  }, [value]);

  const handleConfirm = (date) => {
    setShowPicker(false);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const displayDate = `${day}-${month}-${year}`;
    setDisplayValue(displayDate);
    onChange(displayDate);
  };
const getPickerDate = () => {
  try {
    const iso = formatDateToISO(displayValue);
    const date = new Date(iso);
    return isNaN(date.getTime()) ? new Date() : date;
  } catch {
    return new Date();
  }
};

  return (
    <View>

      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#e0e0e0",
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 15,
            backgroundColor: "#fafbfc",
          }}
          value={displayValue}
          placeholder="Ngày sinh (DD-MM-YYYY)"
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={showPicker}
        mode="date"
        date={getPickerDate()}
        maximumDate={new Date()}
        onConfirm={handleConfirm}
        onCancel={() => setShowPicker(false)}
        locale="vi"
        headerTextIOS="Chọn ngày sinh"
        confirmTextIOS="Xác nhận"
        cancelTextIOS="Hủy"
        styleIOS={{
          backgroundColor: "#fff",
          borderRadius: 10,
          padding: 15,
          alignItems: "center",
          justifyContent: "center",
        }}
        textColor="#333"
        customStyles={{
          dateInput: {
            borderWidth: 0,
            alignItems: "flex-start",
          },
          dateText: {
            fontSize: 16,
            color: "#333",
          },
          placeholderText: {
            color: "#999",
          },
        }}
        
      />
    </View>
  );
};

export default BirthdayPicker;