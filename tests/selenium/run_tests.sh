#!/bin/bash

for f in tests/*.py; do
    echo "Running $f"
    python $f
    
    # Check the exit code of the test
    if [ $? -ne 0 ]; then
        echo "Test failed"
        exit 1
    fi
done

echo "All tests passed"