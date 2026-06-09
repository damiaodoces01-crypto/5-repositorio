import { Course, Student } from './types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    name: 'Inglês Prático',
    monthlyFee: 150,
    durationMonths: 12,
  },
  {
    id: 'course-2',
    name: 'Desenvolvimento Web',
    monthlyFee: 300,
    durationMonths: 6,
  },
  {
    id: 'course-3',
    name: 'Marketing Digital',
    monthlyFee: 200,
    durationMonths: 4,
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'student-1',
    name: 'Carlos Bento Souza',
    courseId: 'course-1',
    monthsPaid: 5,
    status: 'active',
  },
  {
    id: 'student-2',
    name: 'Fernanda Silva Ribeiro',
    courseId: 'course-1',
    monthsPaid: 12,
    status: 'completed',
  },
  {
    id: 'student-3',
    name: 'Juliana Costa Lima',
    courseId: 'course-1',
    monthsPaid: 3,
    status: 'dropped_out',
  },
  {
    id: 'student-4',
    name: 'Felipe Ramos Delgado',
    courseId: 'course-2',
    monthsPaid: 2,
    status: 'active',
  },
  {
    id: 'student-5',
    name: 'Marcos Oliveira Castro',
    courseId: 'course-2',
    monthsPaid: 1,
    status: 'dropped_out',
  },
  {
    id: 'student-6',
    name: 'Patrícia Santos Neves',
    courseId: 'course-3',
    monthsPaid: 4,
    status: 'completed',
  },
];
