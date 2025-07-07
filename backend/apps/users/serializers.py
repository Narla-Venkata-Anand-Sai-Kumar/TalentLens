from rest_framework import serializers
from .models import User, TeacherStudentMapping

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    password = serializers.CharField(write_only=True)
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'full_name', 'role', 'phone_number', 'profile_picture',
            'date_of_birth', 'address', 'is_active', 'date_joined',
            'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'date_joined': {'read_only': True},
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

class TeacherStudentMappingSerializer(serializers.ModelSerializer):
    """Serializer for TeacherStudentMapping model"""
    
    teacher_name = serializers.CharField(source='teacher.full_name', read_only=True)
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    teacher_email = serializers.CharField(source='teacher.email', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    
    class Meta:
        model = TeacherStudentMapping
        fields = [
            'id', 'teacher', 'student', 'teacher_name', 'student_name',
            'teacher_email', 'student_email', 'assigned_date', 'is_active'
        ]

class StudentListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing students"""
    
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'is_active']
