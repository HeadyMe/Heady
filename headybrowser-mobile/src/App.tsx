/**
 * HeadyBrowser Mobile — Sacred Geometry AI Browser
 * Main application entry point
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import BrowserScreen from './screens/BrowserScreen';
import TabsScreen from './screens/TabsScreen';
import BookmarksScreen from './screens/BookmarksScreen';
import SettingsScreen from './screens/SettingsScreen';
import { useTabStore } from './stores/tabStore';
import { COLORS } from './theme';

const Tab = createBottomTabNavigator();

export default function App(): React.JSX.Element {
  const isDark = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.bg}
      />
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: COLORS.cyan,
            background: COLORS.bg,
            card: COLORS.surface,
            text: COLORS.text,
            border: COLORS.border,
            notification: COLORS.amber,
          },
        }}
      >
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: COLORS.surface,
              borderTopColor: COLORS.border,
              height: 56,
              paddingBottom: 6,
            },
            tabBarActiveTintColor: COLORS.cyan,
            tabBarInactiveTintColor: COLORS.muted,
          }}
        >
          <Tab.Screen
            name="Browser"
            component={BrowserScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="web" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Tabs"
            component={TabsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="tab" color={color} size={size} />
              ),
              tabBarBadge: undefined, // will show tab count
            }}
          />
          <Tab.Screen
            name="Bookmarks"
            component={BookmarksScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="bookmark-outline" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="cog-outline" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
