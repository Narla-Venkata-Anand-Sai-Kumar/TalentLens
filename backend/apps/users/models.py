from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Custom User model with role-based access"""
    
    ROLE_CHOICES = [
        ('administrator', 'Administrator'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=15, blank=True)
    profile_picture = models.TextField(blank=True)  # Base64 encoded
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        ordering = ['first_name', 'last_name', 'username']  # Alphabetical ordering
    
    def __str__(self):
        return f"{self.username} ({self.role})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

class TeacherStudentMapping(models.Model):
    """Mapping between teachers and students"""
    
    teacher = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='assigned_students',
        limit_choices_to={'role': 'teacher'}
    )
    student = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='assigned_teachers',
        limit_choices_to={'role': 'student'}
    )
    assigned_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('teacher', 'student')
        db_table = 'teacher_students'
        ordering = ['-assigned_date']  # Most recently assigned first
    
    def __str__(self):
        return f"{self.teacher.username} -> {self.student.username}"
