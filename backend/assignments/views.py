from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Assignment, Submission
from .serializers import AssignmentSerializer, SubmissionSerializer
from rest_framework.decorators import action

class IsTeacherOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'teacher'

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all().order_by('-created_at')
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != 'teacher':
            raise permissions.PermissionDenied("Only teachers can create assignments.")
        serializer.save(teacher=self.request.user)

    def get_queryset(self):
        user = self.request.user
        print(f"DEBUG: Fetching assignments for user: {user.username} (ID: {user.id}, Role: {user.role})")
        
        if user.role == 'teacher':
             qs = Assignment.objects.filter(teacher=user).order_by('-created_at')
             print(f"DEBUG: Teacher QuerySet Count: {qs.count()}")
             return qs
        
        # Student
        qs = (Assignment.objects.filter(assigned_students=user) | Assignment.objects.filter(assigned_students__isnull=True)).distinct().order_by('-created_at')
        print(f"DEBUG: Student QuerySet Count: {qs.count()}")
        print(f"DEBUG: Student Query SQL: {qs.query}")
        return qs

    @action(detail=True, methods=['get'])
    def submissions_status(self, request, pk=None):
        """Get submission status for all students for this assignment"""
        assignment = self.get_object()
        
        # Get students assigned to this assignment
        # If no students are explicitly assigned, show all students
        from users.models import User
        if assignment.assigned_students.exists():
            all_students = assignment.assigned_students.all()
        else:
            # If assigned_students is empty, assignment is for all students
            all_students = User.objects.filter(role='student')
        
        # Get all submissions for this assignment
        submissions = Submission.objects.filter(assignment=assignment).select_related('student')
        submission_map = {sub.student.id: sub for sub in submissions}
        
        # Build response
        students_status = []
        for student in all_students:
            submission = submission_map.get(student.id)
            if submission:
                status = submission.status
                submitted_at = submission.submitted_at
                submission_id = submission.id
            else:
                status = 'pending'
                submitted_at = None
                submission_id = None
            
            students_status.append({
                'student': {
                    'id': student.id,
                    'username': student.username,
                    'email': student.email,
                },
                'status': status,
                'submitted_at': submitted_at,
                'submission_id': submission_id,
            })
        
        return Response(students_status)


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Check if already submitted or draft exists
        assignment_id = self.request.data.get('assignment')
        existing_submission = Submission.objects.filter(assignment_id=assignment_id, student=self.request.user).first()
        
        if existing_submission:
            # If it exists, we should probably be using update, but for simplicity let's handle re-creation attempts
            # If previously submitted, maybe block?
            # if existing_submission.status == 'submitted':
            #    raise permissions.PermissionDenied("Already submitted.")
            # For now, let's just update the existing one if the user hit create again? 
            # Better practice: Frontend calls PUT for updates. 
            # But if they call POST, let's error or handle gracefully.
            raise serializers.ValidationError("Submission already exists. Please update it.")

        serializer.save(student=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
             # Teachers see submissions for their assignments
             return Submission.objects.filter(assignment__teacher=user)
        return Submission.objects.filter(student=user)
