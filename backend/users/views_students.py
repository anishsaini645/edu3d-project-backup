from rest_framework import generics, permissions
from .models import User
from .serializers import UserSerializer

class StudentListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(role='student')
