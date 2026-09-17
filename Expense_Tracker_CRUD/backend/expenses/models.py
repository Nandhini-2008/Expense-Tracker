from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError


CATEGORY_CHOICES = [
    ('Food', 'Food'),
    ('Travel', 'Travel'),
    ('Shopping', 'Shopping'),
    ('Education', 'Education'),
    ('Bills', 'Bills'),
    ('Health', 'Health'),
    ('Entertainment', 'Entertainment'),
    ('Other', 'Other'),
]

ALLOWED_CATEGORIES = [choice[0] for choice in CATEGORY_CHOICES]


class Expense(models.Model):
    """
    Expense model representing a single financial expense record.
    """
    title = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        help_text="Title or brief description of the expense"
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(Decimal('0.01'), message="Amount must be greater than 0.")
        ],
        help_text="Expense amount in currency (must be > 0)"
    )
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        blank=False,
        null=False,
        help_text="Category of the expense"
    )
    date = models.DateField(
        blank=False,
        null=False,
        help_text="Date when the expense was incurred"
    )
    description = models.TextField(
        blank=True,
        default="",
        help_text="Optional additional notes or details"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-id']
        verbose_name = 'Expense'
        verbose_name_plural = 'Expenses'

    def clean(self):
        super().clean()
        if self.title is not None and not self.title.strip():
            raise ValidationError({'title': "Title cannot be blank."})
        if self.category not in ALLOWED_CATEGORIES:
            raise ValidationError({'category': f"Category must be one of: {', '.join(ALLOWED_CATEGORIES)}."})
        if self.amount is not None and self.amount <= 0:
            raise ValidationError({'amount': "Amount must be greater than 0."})

    def __str__(self):
        return f"{self.title} - {self.amount} ({self.category}) on {self.date}"
