from django.urls import path
from .views import Model3DListCreateView

urlpatterns = [
    path("", Model3DListCreateView.as_view(), name="model3d-list-create"),
]
