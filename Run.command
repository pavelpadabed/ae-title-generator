#!/bin/bash

echo "=== Title Generator ==="
echo ""

cd "$(dirname "$0")" || exit 1

python3 main.py

echo ""
echo "Press Enter to close..."
read
