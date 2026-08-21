export interface Course {
  title: string;
  semester: string;
  grade: number;
  credits: number;
}

export interface Candidate {
  id: string;
  name: string;
  status: 'Verified' | 'Pending' | 'Failed';
  program?: string;
  average?: number;
  courses?: Course[];
}