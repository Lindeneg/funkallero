import math, random, logging
from locust import HttpUser, task, events


@events.quitting.add_listener
def _(environment, **kw):
    if environment.stats.total.fail_ratio > 0.01:
        logging.error("Test failed due to failure ratio > 1%")
        environment.process_exit_code = 1
    elif environment.stats.total.avg_response_time > 250:
        logging.error("Test failed due to average response time ratio > 250 ms")
        environment.process_exit_code = 1
    elif environment.stats.total.get_response_time_percentile(0.95) > 800:
        logging.error("Test failed due to 95th percentile response time > 800 ms")
        environment.process_exit_code = 1
    else:
        environment.process_exit_code = 0


class State:
    jane_token = None
    jane_book_id = None


def process_jane_book_id_response(json):
    if State.jane_book_id is None:
        State.jane_book_id = json["data"]["id"]


def random_str_int():
    return str(math.floor(random.random() * 1_000_000))


class GetResources(HttpUser):
    @task
    def get_books(self):
        self.client.get("/books")


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
            response = self.client.post(
                "/books",
                json={"name": "Some Title", "description": "Some Description"},
                cookies={"funkallero-auth-cookie": State.jane_token},
            )
            process_jane_book_id_response(response.json())

    @task
    def create_random_user(self):
        self.client.post(
            "/signup",
            json={
                "name": f"{random_str_int()}-Name",
                "email": f"{random_str_int()}@mock.com",
                "password": "some-password",
            },
        )


class UpdateResources(HttpUser):
    @task
    def update_jane_book(self):
        if State.jane_book_id is not None and State.jane_token is not None:
            self.client.patch(
                "/books/" + State.jane_book_id,
                json={"description": "New Description " + random_str_int()},
                cookies={"funkallero-auth-cookie": State.jane_token},
            )
