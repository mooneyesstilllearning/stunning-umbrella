// src/services/studentService.ts
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const COLLECTION_NAME = 'students';

export interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
  createdAt?: FirebaseFirestoreTypes.Timestamp;
  updatedAt?: FirebaseFirestoreTypes.Timestamp;
}

interface StudentListResult {
  success: boolean;
  data?: Student[];
  error?: string;
}

interface SingleStudentResult {
  success: boolean;
  data?: Student;
  error?: string;
}

interface MutationResult {
    success: boolean;
    id?: string;
    error?: string;
}

export const StudentService = {
  // Get all students
  getAllStudents: async (): Promise<StudentListResult> => {
    try {
      const snapshot = await firestore()
        .collection(COLLECTION_NAME)
        .orderBy('name', 'asc')
        .get();

      const students = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Student[];

      return {
        success: true,
        data: students,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get single student by ID
  getStudentById: async (studentId: string): Promise<SingleStudentResult> => {
    try {
      const doc = await firestore()
        .collection(COLLECTION_NAME)
        .doc(studentId)
        .get();

      if (doc.exists()) {
        return {
          success: true,
          data: { id: doc.id, ...doc.data() } as Student,
        };
      } else {
        return {
          success: false,
          error: 'Student not found',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Add new student
  addStudent: async (studentData: Omit<Student, 'id'>): Promise<MutationResult> => {
    try {
      const docRef = await firestore()
        .collection(COLLECTION_NAME)
        .add({
          ...studentData,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      return {
        success: true,
        id: docRef.id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Update student
  updateStudent: async (studentId: string, studentData: Partial<Omit<Student, 'id'>>): Promise<MutationResult> => {
    try {
      await firestore()
        .collection(COLLECTION_NAME)
        .doc(studentId)
        .update({
          ...studentData,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Delete student
  deleteStudent: async (studentId: string): Promise<MutationResult> => {
    try {
      await firestore()
        .collection(COLLECTION_NAME)
        .doc(studentId)
        .delete();

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Real-time listener for students
  listenToStudents: (callback: (result: StudentListResult) => void) => {
    return firestore()
      .collection(COLLECTION_NAME)
      .orderBy('name', 'asc')
      .onSnapshot(
        snapshot => {
          const students = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Student[];
          callback({ success: true, data: students });
        },
        (error: Error) => {
          callback({ success: false, error: error.message });
        }
      );
  },
};
