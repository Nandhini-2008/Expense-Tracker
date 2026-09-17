from django.urls import re_path
from .views import ExpenseListCreateView, ExpenseDetailView

urlpatterns = [
    re_path(r'^expenses/?$', ExpenseListCreateView.as_view(), name='expense-list-create'),
    re_path(r'^expenses/(?P<id>[^/]+)/?$', ExpenseDetailView.as_view(), name='expense-detail'),
]
