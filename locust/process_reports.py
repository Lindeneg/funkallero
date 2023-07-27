from report import (
    get_report_str,
    process_success,
    process_failure,
)

if __name__ == "__main__":
    report_str, err = get_report_str()

    print(report_str)

    if err is None:
        process_success()
    else:
        process_failure(err)
