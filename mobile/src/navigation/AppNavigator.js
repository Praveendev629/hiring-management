import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { COLORS } from '../components/theme';

import HomeScreen               from '../screens/HomeScreen';
import CandidateListScreen      from '../screens/candidates/CandidateListScreen';
import RegisterCandidateScreen  from '../screens/candidates/RegisterCandidateScreen';
import InterviewerListScreen    from '../screens/interviewers/InterviewerListScreen';
import AddInterviewerScreen     from '../screens/interviewers/AddInterviewerScreen';
import RecordAssessmentScreen   from '../screens/assessments/RecordAssessmentScreen';
import InterviewListScreen      from '../screens/interviews/InterviewListScreen';
import AssignInterviewScreen    from '../screens/interviews/AssignInterviewScreen';
import ReportsScreen            from '../screens/reports/ReportsScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = (title) => ({
  headerStyle:      { backgroundColor: COLORS.primary },
  headerTintColor:  '#fff',
  headerTitleStyle: { fontWeight: '800' },
  title,
});

// ─── Stacks ───────────────────────────────────────────────────────────────────
function CandidatesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CandidateList"     component={CandidateListScreen}     options={screenOptions('Candidates')} />
      <Stack.Screen name="RegisterCandidate" component={RegisterCandidateScreen} options={screenOptions('Register Candidate')} />
    </Stack.Navigator>
  );
}

function InterviewersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="InterviewerList" component={InterviewerListScreen}  options={screenOptions('Interviewers')} />
      <Stack.Screen name="AddInterviewer"  component={AddInterviewerScreen}   options={screenOptions('Add Interviewer')} />
    </Stack.Navigator>
  );
}

function InterviewsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="InterviewList"   component={InterviewListScreen}   options={screenOptions('Interviews')} />
      <Stack.Screen name="AssignInterview" component={AssignInterviewScreen} options={screenOptions('Assign Interview')} />
    </Stack.Navigator>
  );
}

// ─── Tab Icon Helper ─────────────────────────────────────────────────────────
const TabIcon = ({ emoji, focused }) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.55 }}>{emoji}</Text>
  </View>
);

// ─── Root Navigator ───────────────────────────────────────────────────────────
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor:   COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            backgroundColor: COLORS.card,
            paddingBottom: 6,
            height: 60,
          },
          tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: -2 },
        }}
      >
        <Tab.Screen name="Home"         component={HomeScreen}          options={{ tabBarLabel: 'Home',         tabBarIcon: ({focused}) => <TabIcon emoji="🏠" focused={focused}/> }} />
        <Tab.Screen name="Candidates"   component={CandidatesStack}     options={{ tabBarLabel: 'Candidates',   tabBarIcon: ({focused}) => <TabIcon emoji="👤" focused={focused}/> }} />
        <Tab.Screen name="Interviewers" component={InterviewersStack}   options={{ tabBarLabel: 'Interviewers', tabBarIcon: ({focused}) => <TabIcon emoji="🧑‍💼" focused={focused}/> }} />
        <Tab.Screen name="Assessments"  component={RecordAssessmentScreen} options={{ tabBarLabel: 'Assessments', tabBarIcon: ({focused}) => <TabIcon emoji="📝" focused={focused}/>,
          headerShown: true, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '800' }, title: 'Record Assessment' }} />
        <Tab.Screen name="Interviews"   component={InterviewsStack}     options={{ tabBarLabel: 'Interviews',   tabBarIcon: ({focused}) => <TabIcon emoji="📅" focused={focused}/> }} />
        <Tab.Screen name="Reports"      component={ReportsScreen}       options={{ tabBarLabel: 'Reports',      tabBarIcon: ({focused}) => <TabIcon emoji="📊" focused={focused}/>,
          headerShown: true, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '800' }, title: 'Reports' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
