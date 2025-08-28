
import "./global.css";
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider } from 'react-redux';
import { store } from './src/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppNavigator/>
      </SafeAreaProvider>
    </Provider>
  );
}
