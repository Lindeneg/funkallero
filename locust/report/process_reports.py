from report import (
    get_reports,
    get_report_comparison_result,
    process_success,
    process_failure,
)

if __name__ == "__main__":
    [current_report, latest_report] = get_reports()
    err, report_str = get_report_comparison_result(current_report, latest_report)

    print(current_report)
    print(latest_report)
    print(report_str)

    if err is None:
        process_success()
    else:
        process_failure(err)
