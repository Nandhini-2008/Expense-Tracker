from django.contrib import admin
from .models import Expense


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'amount', 'category', 'date', 'created_at')
    list_filter = ('category', 'date')
    search_fields = ('title', 'category', 'description')
    ordering = ('-date', '-id')
    date_hierarchy = 'date'
