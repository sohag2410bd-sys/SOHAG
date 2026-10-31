"""
Unit Tests for SOHAG Mobile Number Tracker (Python)
"""

import unittest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.tracker import clean_phone_input, lookup_phone_number
from app.ip_lookup import is_valid_ip
from app.history import save_history_entry, load_history, clear_history

class TestSohagTracker(unittest.TestCase):

    def test_clean_phone_input(self):
        self.assertEqual(clean_phone_input("+880 1712-345678"), "+8801712345678")
        self.assertEqual(clean_phone_input("008801712345678"), "+8801712345678")
        self.assertEqual(clean_phone_input("01712345678"), "+8801712345678")
        self.assertEqual(clean_phone_input("+1 (555) 123-4567"), "+15551234567")

    def test_lookup_phone_number(self):
        res = lookup_phone_number("+8801712345678")
        self.assertTrue(res.get("success"))
        self.assertEqual(res.get("country_code"), "+880")
        self.assertIn("Grameenphone", res.get("carrier"))
        
        # Test US number
        res_us = lookup_phone_number("+15551234567")
        self.assertTrue(res_us.get("success"))
        self.assertEqual(res_us.get("country_code"), "+1")

    def test_is_valid_ip(self):
        self.assertTrue(is_valid_ip("8.8.8.8"))
        self.assertTrue(is_valid_ip("192.168.1.1"))
        self.assertTrue(is_valid_ip("2001:4860:4860::8888"))
        self.assertTrue(is_valid_ip("")) # empty allowed for current IP
        self.assertFalse(is_valid_ip("invalid-ip-string"))

    def test_history(self):
        clear_history()
        entry = save_history_entry("TEST", "12345", {"summary": "Unit test sample"})
        self.assertIsNotNone(entry)
        hist = load_history()
        self.assertGreaterEqual(len(hist), 1)
        self.assertEqual(hist[0]["query"], "12345")
        clear_history()

if __name__ == "__main__":
    unittest.main()
