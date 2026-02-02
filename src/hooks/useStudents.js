import { useQuery } from '@tanstack/react-query';
import { getStudent } from '../api/students';

export const useStudent = (studentId) => {
    return useQuery({
        queryKey: ['student', studentId],
        queryFn: () => getStudent(studentId),
        enabled: !!studentId, // Only runs if studentId exists in URL
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
};
