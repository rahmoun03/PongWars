FROM ubuntu:24.10

RUN apt update -y && apt install python3 python3-pip -y

COPY . ./backend

WORKDIR ./backend

RUN pip install --break-system-packages -r requirements.txt


EXPOSE 8000


# CMD ["python3" ,"manage.py", "runserver"]

CMD ["sh", "-c", "python3 manage.py migrate && python3 manage.py runserver 0.0.0.0:8000"]

