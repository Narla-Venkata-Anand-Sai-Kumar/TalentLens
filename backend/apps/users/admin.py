from django.contrib import admin
from .models import User, TeacherStudentMapping

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'full_name', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']

@admin.register(TeacherStudentMapping)
class TeacherStudentMappingAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'student', 'assigned_date', 'is_active']
    list_filter = ['assigned_date', 'is_active']
    search_fields = ['teacher__username', 'student__username']
