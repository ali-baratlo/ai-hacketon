FROM python:3.10-slim

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# نصب PyTorch CPU
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

ENV HF_HOME=/app/.cache/huggingface

CMD ["python", "main.py"]
