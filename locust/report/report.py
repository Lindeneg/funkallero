import json, os, math
from typing import Union

RawReport = list[dict[str, Union[int, float]]]
ReportTestError = Union[str, None]
ReportComparisonResult = tuple[ReportTestError, str]

base_path = os.sep.join(__file__.split(os.sep)[:-1])

min_accumulated_request_percent = 50
average_percent_max_increase = 5
max_percent_max_increase = 10
min_percent_max_increase = 10

current_report_path = os.path.join(base_path, "current.json")
latest_report_path = os.path.join(base_path, "latest.json")

green_check_mark = "\U00002705"
red_cross_mark = "\U0000274C"


class Report:
    def __init__(self, raw_report: RawReport, name: str) -> None:
        self.name = name
        self.accumulated_requests = 0
        self.accumulated_response_time = 0
        self.max_response_time = 0
        self.average_response_time = 0
        self.min_response_time = math.inf

        self.process_report(raw_report)

    def __repr__(self) -> str:
        return f"""{self.name} report: 
Average response time: {self.average_response_time}ms
Max response time    : {self.max_response_time}ms
Min response time    : {self.min_response_time}ms
Requests:            : {self.accumulated_requests}
"""

    def process_report(self, raw_report: RawReport) -> None:
        for _, row in enumerate(raw_report):
            self.accumulated_response_time += row["total_response_time"]
            self.accumulated_requests += row["num_requests"]

            if row["max_response_time"] > self.max_response_time:
                self.max_response_time = row["max_response_time"]

            if row["min_response_time"] < self.min_response_time:
                self.min_response_time = row["min_response_time"]

        self.accumulated_response_time = round(self.accumulated_response_time, 2)
        self.max_response_time = round(self.max_response_time, 2)
        self.min_response_time = round(self.min_response_time, 2)
        self.average_response_time = round(
            self.accumulated_response_time / self.accumulated_requests, 2
        )


def open_report(path: str) -> RawReport:
    data = None

    with open(path) as json_file:
        data = json.load(json_file)

    json_file.close()

    return data


def get_reports() -> tuple[Report, Report]:
    current_raw_report = open_report(current_report_path)
    latest_raw_report = open_report(latest_report_path)

    return Report(current_raw_report, "Current"), Report(latest_raw_report, "Latest")


def get_percent_diff(old: float, new: float) -> tuple[float, str]:
    result = math.ceil(((new - old) / old) * 100)
    direction = "DECREASED" if result < 0 else "INCREASED"
    return abs(result), direction


def get_column_result(
    target: tuple[float, str], boundary: int, name: str, errors: list[str]
) -> dict[str, str]:
    result = {
        "mark": "",
        "msg": "",
    }

    did_increase = target[1] == "INCREASED"
    if did_increase and target[0] > boundary:
        errors.append(f"{name} increased by over {boundary}%")
        result["mark"] = red_cross_mark
    else:
        result["mark"] = green_check_mark
        result["msg"] = "within acceptable range" if did_increase else ""

    return result


def process_comparison_result(
    avg: tuple[float, str], max: tuple[float, str], min: tuple[float, str]
) -> tuple[ReportTestError, str, str, str]:
    errors: list[str] = []

    avg_result = get_column_result(
        avg, average_percent_max_increase, "Average response time", errors
    )
    max_result = get_column_result(
        max, max_percent_max_increase, "Max response time", errors
    )
    min_result = get_column_result(
        min, min_percent_max_increase, "Min response time", errors
    )

    return [
        errors if len(errors) > 0 else None,
        avg_result,
        max_result,
        min_result,
    ]


def assert_accumulated_requests_count(current: Report, latest: Report) -> None:
    min = current.accumulated_requests * (min_accumulated_request_percent / 100)
    msg = f"latest must have at least {min_accumulated_request_percent}% of the requests of current request count (current: {current.accumulated_requests}, latest: {latest.accumulated_requests}))"

    assert latest.accumulated_requests >= min, msg


def get_report_comparison_result(
    current: Report, latest: Report
) -> ReportComparisonResult:
    assert_accumulated_requests_count(current, latest)

    avg_percent, avg_direction = get_percent_diff(
        current.average_response_time, latest.average_response_time
    )
    max_percent, max_direction = get_percent_diff(
        current.max_response_time, latest.max_response_time
    )
    min_percent, min_direction = get_percent_diff(
        current.min_response_time, latest.min_response_time
    )

    [err, avg_result, max_result, min_result] = process_comparison_result(
        [avg_percent, avg_direction],
        [max_percent, max_direction],
        [min_percent, min_direction],
    )

    return [
        err,
        f"""Comparison report: 
Average response time: {avg_result["mark"]} {avg_direction} by {avg_percent}% {avg_result["msg"]}
Max response time    : {max_result["mark"]} {max_direction} by {max_percent}% {max_result["msg"]}
Min response time    : {min_result["mark"]} {min_direction} by {min_percent}% {min_result["msg"]}
""",
    ]


def process_success() -> None:
    print(f"Tests successfully passed {green_check_mark}")
    os.remove(current_report_path)
    os.rename(latest_report_path, current_report_path)
    exit(0)


def process_failure(err: list[str]) -> None:
    print(f"Tests successfully failed {red_cross_mark}")
    print("\n".join(err))
    os.remove(latest_report_path)
    exit(1)
