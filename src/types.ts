export interface Course {
  id: string;
  name: string;
  monthlyFee: number;
  durationMonths: number;
}

export type StudentStatus = 'active' | 'completed' | 'dropped_out';

export interface Student {
  id: string;
  name: string;
  courseId: string;
  monthsPaid: number;
  status: StudentStatus;
}
