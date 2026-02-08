import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Patch ALLOWED_HOSTS for test client
from django.conf import settings
if 'testserver' not in settings.ALLOWED_HOSTS:
    settings.ALLOWED_HOSTS = list(settings.ALLOWED_HOSTS) + ['testserver']

from django.contrib.auth import get_user_model
from assignments.models import Assignment
from models3d.models import Model3D
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
import datetime

User = get_user_model()

def run_test():
    print("Setting up test data...")
    # 1. Create Teacher and Student
    teacher_username = 'test_teacher_repro_3'
    student_username = 'test_student_repro_3'
    
    # Clean up
    User.objects.filter(username=teacher_username).delete()
    User.objects.filter(username=student_username).delete()
    
    teacher = User.objects.create_user(username=teacher_username, password='password123', email='teacher@example.com', role='teacher')
    student = User.objects.create_user(username=student_username, password='password123', email='student@example.com', role='student')
    
    # 2. Create Model3D
    model = Model3D.objects.first()
    if not model:
        model = Model3D.objects.create(
            title="Test Model",
            file="test.glb",
            uploaded_by=teacher
        )
    
    # 3. Create Assignment assigned to Student
    assignment = Assignment.objects.create(
        title="Student Assignment Repro",
        description="For student only",
        teacher=teacher,
        model=model,
        due_date=django.utils.timezone.now() + datetime.timedelta(days=1),
        tasks={"task": "do checks"}
    )
    assignment.assigned_students.add(student)
    
    # 4. Create Public Assignment (Unassigned)
    assignment_public = Assignment.objects.create(
        title="Public Assignment Repro",
        description="For everyone",
        teacher=teacher,
        model=model,
        due_date=django.utils.timezone.now() + datetime.timedelta(days=1),
        tasks={"task": "do checks"}
    )
    
    # Test Access
    client = APIClient()
    
    # Generate Token for Student
    refresh = RefreshToken.for_user(student)
    access_token = str(refresh.access_token)
    
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
    
    print("\n--- Requesting /api/assignments/ as Student ---")
    try:
        response = client.get('/api/assignments/')
        
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} assignments:")
            titles = []
            for item in data:
                print(f"- {item.get('title', 'No Title')} (ID: {item.get('id')})")
                titles.append(item.get('title'))
            
            # Verify correctness
            has_student = "Student Assignment Repro" in titles
            has_public = "Public Assignment Repro" in titles
            
            if has_student:
                print("\nSUCCESS: Found explicitly assigned assignment.")
            else:
                print("\nFAILURE: Did NOT find explicitly assigned assignment.")
                
            if has_public:
                print("Found public assignment (unassigned).")
            else:
                print("Did not find public assignment.")
                
        else:
            print(f"Error: Status {response.status_code}")
            print(response.content.decode('utf-8')[:500])

    except Exception as e:
        print(f"Exception during request: {e}")

if __name__ == "__main__":
    try:
        run_test()
    except Exception as e:
        print(f"An error occurred: {e}")
