
from .views import RegisterView, TeacherProfileView, TeacherProfileUpdateView
from django.urls import path
from .views import Model3DListCreateView, StudentListView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path("models/", Model3DListCreateView.as_view()),
    path("students/", StudentListView.as_view()),
    path('profile/', TeacherProfileView.as_view(), name='teacher-profile'),
    path('profile/update/', TeacherProfileUpdateView.as_view(), name='teacher-profile-update'),
]
