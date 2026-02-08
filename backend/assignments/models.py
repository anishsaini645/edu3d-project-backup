from django.db import models
from django.contrib.auth import get_user_model
from models3d.models import Model3D

User = get_user_model()

class Assignment(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_assignments')
    model = models.ForeignKey(Model3D, on_delete=models.CASCADE, related_name='assignments')
    assigned_students = models.ManyToManyField(User, related_name='assigned_tasks', blank=True)
    due_date = models.DateTimeField()
    tasks = models.JSONField(help_text="List of tasks/questions for the student")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Submission(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
    )
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    content = models.JSONField(help_text="Student answers", blank=True, null=True) # Allow blank for initial draft
    screenshot = models.ImageField(upload_to='submissions/screenshots/', blank=True, null=True)
    grade = models.CharField(max_length=10, blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    submitted_at = models.DateTimeField(auto_now=True) # Update on every save (draft or submit)

    class Meta:
        unique_together = ('assignment', 'student')

    def __str__(self):
        return f"{self.student.username} - {self.assignment.title}"
