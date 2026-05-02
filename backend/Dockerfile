# Usa uma imagem oficial e leve do Python
FROM python:3.11-slim

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia os requisitos e instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o código do backend
COPY . .

# Expõe a porta 5000
EXPOSE 5000

# Comando para rodar a API
CMD ["python", "app.py"]