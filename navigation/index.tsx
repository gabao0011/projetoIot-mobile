import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Sensor } from '../types/sensor';
import { SensorListScreen } from '../screens/SensorListScreen';
import { SensorDetailsScreen } from '../screens/SensorDetailsScreen';
import { colors } from '../theme/colors';

export type RootStackParamList = {
  SensorList: undefined;
  SensorDetails: { codigo?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type ListProps = NativeStackScreenProps<RootStackParamList, 'SensorList'>;

function SensorListRoute({ navigation }: ListProps) {
  const handleOpenDetails = (sensor: Sensor) => {
    navigation.navigate('SensorDetails', { codigo: sensor.codigo });
  };

  return <SensorListScreen onOpenDetails={handleOpenDetails} />;
}

type DetailsProps = NativeStackScreenProps<RootStackParamList, 'SensorDetails'>;

function SensorDetailsRoute({ route }: DetailsProps) {
  const codigo = route.params?.codigo;
  return <SensorDetailsScreen initialCode={codigo} />;
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="SensorList"
          component={SensorListRoute}
          options={{ title: 'Sensores' }}
        />
        <Stack.Screen
          name="SensorDetails"
          component={SensorDetailsRoute}
          options={{ title: 'Detalhes do sensor' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}