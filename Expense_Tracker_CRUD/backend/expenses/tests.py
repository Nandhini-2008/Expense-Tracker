from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Expense


class ExpenseAPITests(APITestCase):
    def setUp(self):
        """Seed a sample expense for retrieval, update, and delete tests."""
        self.expense = Expense.objects.create(
            title="Lunch with team",
            amount=Decimal("250.50"),
            category="Food",
            date="2026-09-17",
            description="Team lunch at cafeteria"
        )
        self.list_create_url = "/api/expenses/"
        self.detail_url = f"/api/expenses/{self.expense.id}/"

    # Test 1: POST valid expense -> 201 Created
    def test_01_create_valid_expense(self):
        payload = {
            "title": "Monthly Internet Bill",
            "amount": "999.00",
            "category": "Bills",
            "date": "2026-09-15",
            "description": "High-speed broadband"
        }
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], payload["title"])
        self.assertEqual(Decimal(str(response.data["amount"])), Decimal("999.00"))
        self.assertEqual(response.data["category"], "Bills")
        self.assertEqual(response.data["date"], "2026-09-15")
        self.assertEqual(response.data["description"], "High-speed broadband")
        self.assertIn("id", response.data)

    # Test 2: POST empty title -> 400 Bad Request
    def test_02_create_expense_empty_title(self):
        payload = {
            "title": "   ",
            "amount": "150.00",
            "category": "Food",
            "date": "2026-09-17",
            "description": "Lunch"
        }
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    # Test 3: POST missing amount -> 400 Bad Request
    def test_03_create_expense_missing_amount(self):
        payload = {
            "title": "Books",
            "category": "Education",
            "date": "2026-09-17",
            "description": "Textbooks"
        }
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("amount", response.data)

    # Test 4: POST amount = 0 -> 400 Bad Request
    def test_04_create_expense_zero_amount(self):
        payload = {
            "title": "Free item",
            "amount": "0.00",
            "category": "Shopping",
            "date": "2026-09-17",
            "description": "Free sample"
        }
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("amount", response.data)

    # Test 5: POST negative amount -> 400 Bad Request
    def test_05_create_expense_negative_amount(self):
        payload = {
            "title": "Refund item",
            "amount": "-50.00",
            "category": "Shopping",
            "date": "2026-09-17",
            "description": "Negative value"
        }
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("amount", response.data)

    # Test 6: POST invalid category -> 400 Bad Request
    def test_06_create_expense_invalid_category(self):
        payload = {
            "title": "Unknown expense",
            "amount": "120.00",
            "category": "Gambling",
            "date": "2026-09-17",
            "description": "Invalid category test"
        }
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("category", response.data)

    # Test 7: GET all expenses -> 200 OK
    def test_07_get_all_expenses(self):
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertGreaterEqual(len(response.data), 1)

    # Test 8: GET one valid expense -> 200 OK
    def test_08_get_one_valid_expense(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.expense.id)
        self.assertEqual(response.data["title"], "Lunch with team")

    # Test 9: GET invalid ID -> 404 Not Found
    def test_09_get_invalid_id(self):
        response = self.client.get("/api/expenses/999999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"detail": "Expense not found."})

    # Test 10: PUT valid expense -> 200 OK
    def test_10_put_valid_expense(self):
        payload = {
            "title": "Team Dinner",
            "amount": "450.00",
            "category": "Food",
            "date": "2026-09-17",
            "description": "Dinner at restaurant"
        }
        response = self.client.put(self.detail_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Team Dinner")
        self.assertEqual(Decimal(str(response.data["amount"])), Decimal("450.00"))

    # Test 11: PUT invalid ID -> 404 Not Found
    def test_11_put_invalid_id(self):
        payload = {
            "title": "Team Dinner",
            "amount": "450.00",
            "category": "Food",
            "date": "2026-09-17",
            "description": "Dinner"
        }
        response = self.client.put("/api/expenses/999999/", payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"detail": "Expense not found."})

    # Test 12: DELETE valid expense -> 204 No Content
    def test_12_delete_valid_expense(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Expense.objects.filter(id=self.expense.id).exists())

    # Test 13: DELETE invalid ID -> 404 Not Found
    def test_13_delete_invalid_id(self):
        response = self.client.delete("/api/expenses/999999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"detail": "Expense not found."})
