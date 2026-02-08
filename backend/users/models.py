from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth import get_user_model
class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    
    # Teacher Profile Fields
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    subject_expertise = models.CharField(max_length=200, blank=True, null=True)
    institution = models.CharField(max_length=200, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)



User = get_user_model()

class Model3D(models.Model):
    title = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    file = models.FileField(upload_to="models/")
    uploaded_by = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name="user_uploaded_models"
)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
