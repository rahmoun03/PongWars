FROM ubuntu:24.10

RUN apt update -y && apt install python3 python3-pip -y

COPY . /app

WORKDIR /app

RUN pip install --break-system-packages -r requirements.txt

CMD ["daphne", "-b", "0.0.0.0", "-p", "4040", "TicTacToe.asgi:application"]
