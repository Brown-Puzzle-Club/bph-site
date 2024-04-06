from django import dispatch

create_minor_case_incoming_event = dispatch.Signal(["cases", "team"])
send_notification = dispatch.Signal(["message", "team"])