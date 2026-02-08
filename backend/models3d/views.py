from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Model3D
from .serializers import Model3DSerializer


class Model3DListCreateView(generics.ListCreateAPIView):
    queryset = Model3D.objects.all()
    serializer_class = Model3DSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
