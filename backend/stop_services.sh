#!/bin/bash

# Read PIDs from the file and kill the processes
while read pid; do
  kill $pid
done < service_pids.txt

# Remove the PIDs file after stopping all services
rm service_pids.txt

echo "All services have been stopped."
