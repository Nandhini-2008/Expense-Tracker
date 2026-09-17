from decimal import Decimal, InvalidOperation
from rest_framework import serializers
from .models import Expense, ALLOWED_CATEGORIES


class ExpenseSerializer(serializers.ModelSerializer):
    title = serializers.CharField(
        max_length=100,
        required=True,
        error_messages={
            'required': 'Title is required.',
            'blank': 'Title cannot be blank.',
        }
    )
    amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=True,
        error_messages={
            'required': 'Amount is required.',
            'invalid': 'Amount must be a valid number.',
        }
    )
    category = serializers.CharField(
        max_length=50,
        required=True,
        error_messages={
            'required': 'Category is required.',
            'blank': 'Please select a category.',
        }
    )
    date = serializers.DateField(
        required=True,
        error_messages={
            'required': 'Date is required.',
            'invalid': 'Date must be a valid date in YYYY-MM-DD format.',
        }
    )
    description = serializers.CharField(
        required=False,
        allow_blank=True,
        default=""
    )

    class Meta:
        model = Expense
        fields = ['id', 'title', 'amount', 'category', 'date', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_title(self, value):
        if value is None or not str(value).strip():
            raise serializers.ValidationError("Title cannot be blank.")
        return str(value).strip()

    def validate_amount(self, value):
        try:
            val = Decimal(str(value))
        except (InvalidOperation, TypeError, ValueError):
            raise serializers.ValidationError("Amount must be a valid number.")
        if val <= Decimal('0.00'):
            raise serializers.ValidationError("Amount must be greater than 0.")
        return val

    def validate_category(self, value):
        if not value or not str(value).strip():
            raise serializers.ValidationError("Please select a category.")
        cleaned = str(value).strip()
        if cleaned not in ALLOWED_CATEGORIES:
            raise serializers.ValidationError(
                f"Category must be one of: {', '.join(ALLOWED_CATEGORIES)}."
            )
        return cleaned
