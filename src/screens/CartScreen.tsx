import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { themeColors } from "../theme";
import {
  clearCart,
  decreaseQty,
  increaseQty,
  removeItem,
} from "../store/CartSlice";

export default function CartScreen() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const navigation = useNavigation();
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [cardName, setCardName] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvc, setCvc] = React.useState("");
  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    if (!isCheckoutOpen) return;
    (async () => {
      try {
        const json = await (await import("@react-native-async-storage/async-storage")).default.getItem("@profile_info");
        if (json) {
          const data = JSON.parse(json);
          setProfile(data);
          if (!cardName && data.fullName) setCardName(data.fullName);
        } else {
          setProfile(null);
        }
      } catch {
        setProfile(null);
      }
    })();
  }, [isCheckoutOpen]);

  const safePrice = (p: unknown) => {
    const n = Number(p);
    return isNaN(n) ? 0 : n;
  };

  const totalPrice = items.reduce((sum, i) => sum + safePrice(i.price) * (i.qty ?? 1), 0);
  return (
    <SafeAreaView>
      <StatusBar hidden />
      <View className="flex-row mt-5 items-center justify-between px-4 py-3">
        <TouchableOpacity
          className="p-2 rounded-full border border-black"
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-secondary">Sepetim</Text>

        <TouchableOpacity
          className="p-2 rounded-full border border-black"
          onPress={() => dispatch(clearCart())}
        >
          <Entypo name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>

      <View className="px-4 pt-4">
        <FlatList
          data={items}
          keyExtractor={(i) => i.id.toString()}
          ListEmptyComponent={
            <Text className="text-center text-gray-400">Sepet boş</Text>
          }
          renderItem={({ item }) => {
            const price = safePrice(item.price);
            return (
              <View className="flex-row items-center p-4 mb-4 border-b border-b-primary">
                <Image source={item.image} className="w-16 h-16 " />
                <View className="flex-1 ml-4">
                  <Text className="text-base font-medium">{item.name}</Text>

                  <Text className="text-base font-medium">
                    {price.toFixed(2)}$ x {item.qty}
                  </Text>

                  <View className="flex-row items-center mt-3">
                    <TouchableOpacity
                      onPress={() => dispatch(decreaseQty(item.id))}
                      className="p-1"
                    >
                      <AntDesign
                        name="minuscircle"
                        size={24}
                        color={themeColors.bgPrimary}
                      />
                    </TouchableOpacity>

                    <Text
                      className="mx-3 text-base"
                      style={{ color: themeColors.bgSecondary }}
                    >
                      {item.qty ?? 1}
                    </Text>

                    <TouchableOpacity
                      onPress={() => dispatch(increaseQty(item.id))}
                      className="p-1"
                    >
                      <AntDesign
                        name="pluscircle"
                        size={24}
                        color={themeColors.bgPrimary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => dispatch(removeItem(item.id))}
                      className="ml-auto"
                    >
                      <Feather name="delete" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>

      {items.length > 0 && (
        <View className="px-4 pb-8">
          <Text className="text-lg font-semibold mb-3 text-secondary">
            Toplam {totalPrice.toFixed(2)}$
          </Text>
          <TouchableOpacity className="bg-primary py-4 rounded-full px-2" onPress={() => setIsCheckoutOpen(true)}>
            <Text className="text-center text-xl font-semibold text-white">
              Checkout
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Checkout Bottom Sheet */}
      <Modal visible={isCheckoutOpen} animationType="slide" transparent onRequestClose={() => setIsCheckoutOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setIsCheckoutOpen(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}>
              <View style={{ alignItems: 'center', marginBottom: 12 }}>
                <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#e5e7eb' }} />
              </View>
              <Text className="text-lg font-semibold" style={{ color: themeColors.textPrimary }}>Payment Details</Text>
              {profile && (
                <View style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, marginTop: 12 }}>
                  <Text style={{ color: themeColors.textPrimary, fontWeight: '600', marginBottom: 6 }}>Teslimat Bilgileri</Text>
                  {profile.fullName ? (<Text style={{ color: '#374151' }}>{profile.fullName}</Text>) : null}
                  {profile.phone ? (<Text style={{ color: '#374151', marginTop: 2 }}>{profile.phone}</Text>) : null}
                  {(profile.address || profile.city || profile.district) ? (
                    <Text style={{ color: '#374151', marginTop: 2 }}>
                      {profile.address}
                      {(profile.city || profile.district) ? `, ${profile.city || ''}${profile.district ? ' / ' + profile.district : ''}` : ''}
                    </Text>
                  ) : null}
                  
                </View>
              )}
              <View style={{ marginTop: 12, gap: 10 }}>
                <TextInput
                  placeholder="Name on Card"
                  placeholderTextColor="#9ca3af"
                  value={cardName}
                  onChangeText={setCardName}
                  style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12 }}
                />
                <TextInput
                  placeholder="Card Number"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  maxLength={19}
                  style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12 }}
                />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TextInput
                    placeholder="MM/YY"
                    placeholderTextColor="#9ca3af"
                    keyboardType="number-pad"
                    value={expiry}
                    onChangeText={setExpiry}
                    maxLength={5}
                    style={{ flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12 }}
                  />
                  <TextInput
                    placeholder="CVC"
                    placeholderTextColor="#9ca3af"
                    keyboardType="number-pad"
                    value={cvc}
                    onChangeText={setCvc}
                    maxLength={4}
                    style={{ flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12 }}
                  />
                </View>
              </View>
              <View style={{ marginTop: 16, flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity style={{ flex: 1, paddingVertical: 14, borderRadius: 9999, borderWidth: 1, borderColor: '#e5e7eb' }} onPress={() => setIsCheckoutOpen(false)}>
                  <Text className="text-center font-semibold" style={{ color: themeColors.textPrimary }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, paddingVertical: 14, borderRadius: 9999, backgroundColor: themeColors.bgPrimary }} onPress={() => { setIsCheckoutOpen(false); }}>
                  <Text className="text-center font-semibold" style={{ color: '#fff' }}>Pay {totalPrice.toFixed(2)}$</Text>
                </TouchableOpacity>
              </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
