from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count, Q
from .models import Assignment, Submission
from users.models import User


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics based on user role"""
    user = request.user
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    
    if user.role == 'teacher':
        # Teacher stats
        # Today's tasks
        today_tasks = Assignment.objects.filter(
            teacher=user,
            created_at__date=today
        ).count()
        
        # Pending and submitted counts across all teacher's assignments
        teacher_assignments = Assignment.objects.filter(teacher=user)
        all_submissions = Submission.objects.filter(assignment__in=teacher_assignments)
        
        pending_count = all_submissions.filter(status='pending').count()
        submitted_count = all_submissions.filter(status='submitted').count()
        
        # Weekly task creation (last 7 days)
        weekly_data = []
        for i in range(7):
            day = today - timedelta(days=6-i)
            count = Assignment.objects.filter(
                teacher=user,
                created_at__date=day
            ).count()
            weekly_data.append({
                'date': day.strftime('%Y-%m-%d'),
                'day': day.strftime('%a'),
                'count': count
            })
        
        # Top 3 students by submission count
        top_students = Submission.objects.filter(
            assignment__teacher=user,
            status='submitted'
        ).values(
            'student__id',
            'student__username'
        ).annotate(
            submitted=Count('id', filter=Q(status='submitted')),
            pending=Count('id', filter=Q(status='pending'))
        ).order_by('-submitted')[:3]
        
        top_students_data = []
        for student in top_students:
            # Get actual pending count for this student
            pending = Submission.objects.filter(
                assignment__teacher=user,
                student__id=student['student__id'],
                status='pending'
            ).count()
            
            top_students_data.append({
                'student': student['student__username'],
                'submitted': student['submitted'],
                'pending': pending
            })
        
        # Recent 5 assignments
        recent_assignments = Assignment.objects.filter(
            teacher=user
        ).order_by('-created_at')[:5].values(
            'id', 'title', 'description', 'due_date', 'created_at'
        )
        
        return Response({
            'role': 'teacher',
            'today_tasks': today_tasks,
            'pending_count': pending_count,
            'submitted_count': submitted_count,
            'weekly_data': weekly_data,
            'top_students': top_students_data,
            'recent_assignments': list(recent_assignments)
        })
    
    else:  # student
        # Student stats
        # Today's tasks received
        today_tasks = Assignment.objects.filter(
            Q(assigned_students=user) | Q(assigned_students__isnull=True),
            created_at__date=today
        ).count()
        
        # Student's submissions
        student_submissions = Submission.objects.filter(student=user)
        pending_count = student_submissions.filter(status='pending').count()
        submitted_count = student_submissions.filter(status='submitted').count()
        
        # Weekly assignments received (last 7 days)
        weekly_data = []
        for i in range(7):
            day = today - timedelta(days=6-i)
            count = Assignment.objects.filter(
                Q(assigned_students=user) | Q(assigned_students__isnull=True),
                created_at__date=day
            ).count()
            weekly_data.append({
                'date': day.strftime('%Y-%m-%d'),
                'day': day.strftime('%a'),
                'count': count
            })
        
        # Recent 5 assignments for this student
        recent_assignments = Assignment.objects.filter(
            Q(assigned_students=user) | Q(assigned_students__isnull=True)
        ).order_by('-created_at')[:5].values(
            'id', 'title', 'description', 'due_date', 'created_at'
        )
        
        return Response({
            'role': 'student',
            'today_tasks': today_tasks,
            'pending_count': pending_count,
            'submitted_count': submitted_count,
            'weekly_data': weekly_data,
            'recent_assignments': list(recent_assignments)
        })
