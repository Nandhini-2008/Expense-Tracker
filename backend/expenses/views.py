import logging
from decimal import Decimal
from django.http import Http404
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import exception_handler
from rest_framework.exceptions import NotFound, ValidationError
from .models import Expense
from .serializers import ExpenseSerializer

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler to ensure standard, user-friendly JSON error responses.
    """
    if isinstance(exc, (Http404, NotFound)):
        return Response({"detail": "Expense not found."}, status=status.HTTP_404_NOT_FOUND)

    # Call REST framework's default exception handler first to get standard error response.
    response = exception_handler(exc, context)

    if response is None:
        # Unhandled 500 server error
        logger.error(f"Unhandled exception during request processing: {exc}", exc_info=True)
        return Response(
            {"detail": "An unexpected server error occurred. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response


class ExpenseListCreateView(generics.ListCreateAPIView):
    """
    GET /api/expenses/ - Retrieve all expenses
    POST /api/expenses/ - Create a new expense
    """
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/expenses/<id>/ - Retrieve an expense by ID
    PUT /api/expenses/<id>/ - Update an expense
    PATCH /api/expenses/<id>/ - Partially update an expense
    DELETE /api/expenses/<id>/ - Delete an expense
    """
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    lookup_field = 'id'

    def get_object(self):
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_val = self.kwargs.get(lookup_url_kwarg)

        # Ensure ID is a valid integer
        try:
            int_id = int(lookup_val)
        except (ValueError, TypeError):
            raise NotFound(detail="Expense not found.")

        try:
            return Expense.objects.get(id=int_id)
        except Expense.DoesNotExist:
            raise NotFound(detail="Expense not found.")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
