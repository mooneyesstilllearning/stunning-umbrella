// src/screens/StudentListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ListRenderItem,
} from 'react-native';
import { StudentService, Student } from '../services/studentService';
import { AuthService } from '../services/authService';
import { StorageService } from '../utils/storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define your stack param list
type RootStackParamList = {
  Login: undefined;
  StudentList: undefined;
};

type StudentListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'StudentList'
>;

const StudentListScreen: React.FC<StudentListScreenProps> = ({ navigation }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const userInfo = StorageService.getUserInfo();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const result = await StudentService.getAllStudents();
    setLoading(false);

    if (result.success && result.data) {
      setStudents(result.data);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AuthService.logout();
            // Navigation is handled by the auth state listener in App.tsx
          },
        },
      ]
    );
  };

  const renderStudentCard: ListRenderItem<Student> = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.studentName}>{item.name}</Text>
      </View>
      
      <View style={styles.cardBody}>
        <Text style={styles.label}>Major</Text>
        <Text style={styles.value}>{item.major}</Text>
        
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{item.email}</Text>
      </View>
    </View>
  );

  if (loading && students.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading students...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Students</Text>
          <Text style={styles.headerSubtitle}>
            Logged in as: {userInfo.email}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Student List */}
      <FlatList
        data={students}
        keyExtractor={item => item.id}
        renderItem={renderStudentCard}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No students found</Text>
            <Text style={styles.emptySubtext}>
              Add students in Firebase Console
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
      },
      centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      },
      loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
      },
      header: {
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
      },
      headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
      },
      logoutButton: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 6,
      },
      logoutText: {
        color: '#fff',
        fontWeight: '600',
      },
      listContent: {
        padding: 15,
      },
      card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      },
      studentName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
      },
      gpaBadge: {
        backgroundColor: '#34C759',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
      },
      gpaText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
      },
      cardBody: {
        gap: 8,
      },
      label: {
        fontSize: 12,
        color: '#999',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginTop: 4,
      },
      value: {
        fontSize: 15,
        color: '#333',
      },
      emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
      },
      emptyText: {
        fontSize: 18,
        color: '#666',
        fontWeight: '600',
      },
      emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
      },
});

export default StudentListScreen;
