## This will remove the existing stack and redeploy the new stack
docker stack rm airflow
echo "Service removed. Waiting for 10 seconds for all services to shutdown and remove"
sleep 10s # Waits 10 seconds.

docker stack deploy -c airflow-stack.yaml airflow
echo "Deployed!!"
