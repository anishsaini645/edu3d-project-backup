from rest_framework import serializers
from .models import Assignment, Submission
from users.serializers import UserSerializer
from models3d.serializers import Model3DSerializer

class AssignmentSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    model_obj = Model3DSerializer(source='model', read_only=True)
    my_submission = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = '__all__'
        read_only_fields = ('teacher', 'created_at')

    def get_my_submission(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            submission = Submission.objects.filter(assignment=obj, student=request.user).first()
            if submission:
                return SubmissionSerializer(submission).data
        return None

class SubmissionSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    assignment_obj = AssignmentSerializer(source='assignment', read_only=True)

    class Meta:
        model = Submission
        fields = '__all__'
        read_only_fields = ('student', 'submitted_at')
