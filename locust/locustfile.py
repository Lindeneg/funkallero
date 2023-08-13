import math, random, logging
from locust import HttpUser, task, events
import logging


@events.quitting.add_listener
def _(environment, **kw):
    if environment.stats.total.fail_ratio > 0.01:
        logging.error("Test failed due to failure ratio > 1%")
        environment.process_exit_code = 1
    else:
        environment.process_exit_code = 0


class State:
    jane_token = None
    jane_book_id = None


def random_str_int():
    return str(math.floor(random.random() * 1_000_000))


class GetResources(HttpUser):
    @task
    def get_books(self):
        response = self.client.get("/books")

        if response.ok and State.jane_book_id is None:
            json = response.json()

            for _, v in enumerate(json):
                if v["author"]["name"] == "Jane":
                    State.jane_book_id = v["id"]
                    break


class CreateResources(HttpUser):
    @task
    def login_jane(self):
        set_cookie_header = self.client.post(
            "/login", json={"email": "jane@example.com", "password": "jane-mock"}
        ).headers.get("Set-Cookie")
        if State.jane_token is None:
            token = set_cookie_header.split("funkallero-auth-cookie=")[1:][0]
            State.jane_token = token

    @task
    def create_jane_book(self):
        if State.jane_token is not None:
            self.client.post(
                "/books",
                json={"name": "Some Title", "description": "Some Description"},
                cookies={"funkallero-auth-cookie": State.jane_token},
            )

    @task
    def create_random_user(self):
        self.client.post(
            "/signup",
            json={
                "name": f"{random_str_int()}-{random_str_int()}",
                "email": f"{random_str_int()}@s{random_str_int()}.com",
                "password": "some-password",
            },
        )


class UpdateResources(HttpUser):
    @task
    def update_jane_book(self):
        if State.jane_book_id is not None and State.jane_token is not None:
            self.client.patch(
                "/books/" + State.jane_book_id,
                json={"description": "New Description"},
                cookies={"funkallero-auth-cookie": State.jane_token},
            )
