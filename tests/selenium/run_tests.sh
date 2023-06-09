#!/bin/bash

for f in $(find . -name "test*.py" | sort -n); do
    echo "Running $f"
    python $f
    
    # Check the exit code of the test
    if [ $? -ne 0 ]; then
        echo "Test failed"
        exit 1
    fi
done

echo "All tests passed"