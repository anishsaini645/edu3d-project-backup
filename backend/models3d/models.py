from django.db import models

# Create your models here.
from django.db import models
from users.models import User

class Model3D(models.Model):
    title = models.CharField(max_length=200)
    subject = models.CharField(max_length=100)
    file = models.FileField(upload_to='3d_models/')
    uploaded_by = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name="teacher_uploaded_models"
)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
