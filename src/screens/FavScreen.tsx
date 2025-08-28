import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { coffeeItems } from "../constans";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Coffee {
  id: string;
  name: string;
}

export default function FavScreen() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [query, setQuery] = useState<string>("");

  const suggestions = useMemo(() => {
    if (!query.trim()) return [] as { id: number; name: string }[];
    const q = query.trim().toLowerCase();
    return coffeeItems
      .filter((c) => c.name.toLowerCase().includes(q))
      .map((c) => ({ id: c.id as number, name: c.name as string }));
  }, [query]);

  useEffect(() => {
    loadCoffes();
  }, []);

  const loadCoffes = async () => {
    try {
      const json = await AsyncStorage.getItem("@fav_coffees");
      if (json) {
        const list: Coffee[] = JSON.parse(json);
        setCoffees(list);
      }
    } catch (e) {
      console.error("Kahveler yüklenirken hata:", e);
    }
  };

  const saveCoffes = async (list: Coffee[]) => {
    try {
      await AsyncStorage.setItem("@fav_coffees", JSON.stringify(list));
    } catch (e) {
      console.error("Kahveler yüklenirken hata:", e);
    }
  };

  const addCoffeeDirect = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newCoffee: Coffee = { id: Date.now().toString(), name: trimmed };
    const updated = [...coffees, newCoffee];
    setCoffees(updated);
    saveCoffes(updated);
  };

  const deleteCoffee = (id: string) => {
    Alert.alert("Sil", "Bu Kahveyi Silmek istediğine eminmisin", [
      { text: "iptal", style: "cancel" },
      {
        text: "sil",
        style: "destructive",
        onPress: () => {
          const filtred = coffees.filter((c) => c.id !== id);
          setCoffees(filtred);
          saveCoffes(filtred);
        },
      },
    ]);
  };

  return (
    <View className="flex-1 p-4 mb-4 mt-8">
      <Text className="text-2xl font-bold text-center mb-4">
        Favori kahveler
      </Text>

      <View className="flex-row items-center mb-3 gap-2">
        <TextInput
          placeholder="Kahve ara..."
          value={query}
          onChangeText={setQuery}
          className="flex-1 border px-3 py-3"
          style={{ borderRadius: 6 }}
        />
        <TouchableOpacity
          className="bg-primary py-3 px-4"
          style={{ borderRadius: 8 }}
          onPress={() => {
            if (query.trim()) {
              addCoffeeDirect(query);
              setQuery("");
            }
          }}
        >
          <Text>Ekle</Text>
        </TouchableOpacity>
      </View>
        {query.length > 0 && (
          <View className="mt-2">
            <FlatList
              data={suggestions}
              keyExtractor={(i) => i.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row justify-between items-center py-3 px-2 border-b border-gray-200"
                  onPress={() => {
                    addCoffeeDirect(item.name);
                    setQuery("");
                  }}
                >
                  <Text>{item.name}</Text>
                  <Text className="text-gray-500">Ekle</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text className="text-gray-500 px-2 py-3">Sonuç yok</Text>}
            />
          </View>
        )}

      <FlatList
        data={coffees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className="flex-row justify-between items-center py-3 px-2 border-b
           border-gray-200"
          >
            <Text>{item.name}</Text>
            <TouchableOpacity
              className="bg-red-500 px-3 py-1 rounded"
              onPress={() => deleteCoffee(item.id)}
            >
              <Text className="text-white">Sil</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-8">Liste boş</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({});
