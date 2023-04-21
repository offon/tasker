FROM python:3.9-slim
WORKDIR /app
COPY tasker/ .
RUN chmod +x /app/entrypoint.sh
RUN pip3 install -r /app/requirements.txt --no-cache-dir