from abc import ABC, abstractmethod
import asyncio
import collections
import json
import logging
import requests
import datetime
import traceback

from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import (
    WebsocketConsumer,
    AsyncJsonWebsocketConsumer,
    JsonWebsocketConsumer,
)
from channels_presence.models import Room
from channels_presence.decorators import touch_presence
from channels_presence.signals import presence_changed
from channels.layers import get_channel_layer
import discord

from django.conf import settings
from django.contrib import messages
from django.core.mail.message import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import gettext as _
from django.apps import apps

from puzzles.context import Context
from puzzles.hunt_config import (
    HUNT_TITLE,
    HUNT_ORGANIZERS,
    CONTACT_EMAIL,
    MESSAGING_SENDER_EMAIL,
)
from puzzles.signals import create_minor_case_incoming_event, send_notification

logger = logging.getLogger("puzzles.messaging")


# Usernames that the bot will send messages to Discord with when various things
# happen. It's really not important that these are different. It's just for
# flavor.
ALERT_DISCORD_USERNAME = "FIXME PH AlertBot"
CORRECT_SUBMISSION_DISCORD_USERNAME = "FIXME PH WinBot"
INCORRECT_SUBMISSION_DISCORD_USERNAME = "FIXME PH FailBot"
FREE_ANSWER_DISCORD_USERNAME = "FIXME PH HelpBot"
VICTORY_DISCORD_USERNAME = "FIXME PH CongratBot"

# Should be Discord webhook URLs that look like
# https://discordapp.com/api/webhooks/(numbers)/(letters)
# From a channel you can create them under Integrations > Webhooks.
# They can be the same webhook if you don't care about keeping them in separate
# channels.
ALERT_WEBHOOK_URL = "FIXME"
SUBMISSION_WEBHOOK_URL = "FIXME"
FREE_ANSWER_WEBHOOK_URL = "FIXME"
VICTORY_WEBHOOK_URL = "FIXME"

DISCORD_TOGGLE = False  # Set to True to enable Discord integration


# Assuming you want messages on a messaging platform that's not Discord but
# supports at least a vaguely similar API, change the following code
# accordingly:
def dispatch_discord_alert(webhook, content, username):
    content = "[{}] {}".format(timezone.localtime().strftime("%H:%M:%S"), content)
    if len(content) >= 2000:
        content = content[:1996] + "..."
    if settings.IS_TEST or not DISCORD_TOGGLE:
        logger.info(_("(Test) Discord alert:\n") + content)
        return
    logger.info(_("(Real) Discord alert:\n") + content)
    requests.post(webhook, data={"username": username, "content": content})


def dispatch_general_alert(content):
    dispatch_discord_alert(ALERT_WEBHOOK_URL, content, ALERT_DISCORD_USERNAME)


def dispatch_submission_alert(content, correct):
    username = (
        CORRECT_SUBMISSION_DISCORD_USERNAME
        if correct
        else INCORRECT_SUBMISSION_DISCORD_USERNAME
    )
    dispatch_discord_alert(SUBMISSION_WEBHOOK_URL, content, username)


def dispatch_free_answer_alert(content):
    dispatch_discord_alert(
        FREE_ANSWER_WEBHOOK_URL, content, FREE_ANSWER_DISCORD_USERNAME
    )


def dispatch_victory_alert(content):
    dispatch_discord_alert(VICTORY_WEBHOOK_URL, content, VICTORY_DISCORD_USERNAME)


puzzle_logger = logging.getLogger("puzzles.puzzle")


def log_puzzle_info(puzzle, team, content):
    puzzle_logger.info("{}\t{}\t{}".format(puzzle, team, content))


request_logger = logging.getLogger("puzzles.request")


def log_request_middleware(get_response):
    def middleware(request):
        request_logger.info("{} {}".format(request.get_full_path(), request.user))
        return get_response(request)

    return middleware


# NOTE: we don't have a request available, so this doesn't render with a
# RequestContext, so the magic from our context processor is not available! (We
# maybe could sometimes provide a request, but I don't want to add that
# coupling right now.)
def send_mail_wrapper(subject, template, context, recipients):
    if not recipients:
        return
    # Manually plug in some template variables we know we want
    context["hunt_title"] = HUNT_TITLE
    context["hunt_organizers"] = HUNT_ORGANIZERS
    subject = settings.EMAIL_SUBJECT_PREFIX + subject
    body = render_to_string(template + ".txt", context)
    if settings.IS_TEST:
        logger.info(
            _("Sending mail <{}> to <{}>:\n{}").format(
                subject, ", ".join(recipients), body
            )
        )
        return
    mail = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=MESSAGING_SENDER_EMAIL,
        to=recipients,
        alternatives=[(render_to_string(template + ".html", context), "text/html")],
        reply_to=[CONTACT_EMAIL],
    )
    try:
        if mail.send() != 1:
            raise RuntimeError(_("Unknown failure???"))
    except Exception:
        dispatch_general_alert(
            _("Could not send mail <{}> to <{}>:\n{}").format(
                subject, ", ".join(recipients), traceback.format_exc()
            )
        )


class DiscordInterface:
    TOKEN = None  # FIXME a long token from Discord

    # the next two should be big decimal numbers; in Discord, you can right
    # click and Copy ID to get them
    GUILD = "FIXME"
    HINT_CHANNEL = "FIXME"

    # You also need to enable the "puzzles Members Intent" under the "Privileged
    # Gateway Intents" section of the "Bot" page of your application from the
    # Discord Developer Portal. Or you can comment out the code that
    # initializes `self.avatars` below.

    def __init__(self):
        self.client = None
        self.avatars = None
        if self.TOKEN and not settings.IS_TEST:
            self.client = discord.Client()
            self.client.loop = asyncio.new_event_loop()
            self.client.loop.run_until_complete(self.client.login(self.TOKEN))
            # Look man, I dunno. I have no clue how Python async works and this
            # is all a house of cards that probably works totally differently
            # depending on your environment. If you can find a way to reliably
            # call these async things from here, please send us a PR.

    def get_avatar(self, claimer):
        if self.avatars is None:
            self.avatars = {}
            if self.client is not None:
                members = [
                    discord.Member(data=data, guild=None, state=self.client._connection)  # type: ignore
                    for data in self.client.loop.run_until_complete(
                        self.client.http.get_members(self.GUILD, limit=1000, after=None)
                    )
                ]
                for member in members:
                    self.avatars[member.name] = member.display_avatar.url
                for member in members:
                    self.avatars[member.display_name] = member.display_avatar.url
        return self.avatars.get(claimer)

    # If you get an error code 50001 when trying to create a message, even
    # though you're sure your bot has all the permissions, it might be because
    # you need to "connect to and identify with a gateway at least once"??
    # https://discord.com/developers/docs/resources/channel#create-message

    # I spent like four hours trying to find weird asynchronous ways to do this
    # right before each time I send a message, but it seems maybe you actually
    # just need to do this once and your bot can create messages forever?
    # pycord's Client does this. So I believe you can fix this by running a
    # script like the following *once* on your local machine (it will, as
    # advertised, run forever; just kill it after a few seconds)?

    # import discord
    # discord.Client().run(TOKEN)

    def update_hint(self, hint):
        HintsConsumer.send_to_all(
            json.dumps(
                {
                    "id": hint.id,
                    "content": render_to_string(
                        "hint_list_entry.html",
                        {"hint": hint, "now": timezone.localtime()},
                    ),
                }
            )
        )
        embed = collections.defaultdict(lambda: collections.defaultdict(dict))
        embed["author"]["url"] = hint.full_url()
        if hint.claimed_datetime:
            embed["color"] = 0xDDDDDD  # type: ignore
            embed["timestamp"] = hint.claimed_datetime.isoformat()
            embed["author"]["name"] = _("Claimed by {}").format(hint.claimer)  # type: ignore
            avatar = self.get_avatar(hint.claimer)
            if avatar:
                embed["author"]["icon_url"] = avatar
            debug = _("claimed by {}").format(hint.claimer)
        else:
            embed["color"] = 0xFF00FF  # type: ignore
            embed["author"]["name"] = _("U N C L A I M E D")  # type: ignore
            claim_url = hint.full_url(claim=True)
            embed["title"] = _("Claim: ") + claim_url
            embed["url"] = claim_url
            debug = "unclaimed"

        if self.client is None:
            message = hint.long_discord_message()
            logger.info(_("Hint, {}: {}\n{}").format(debug, hint, message))
            logger.info(_("Embed: {}").format(embed))
        elif hint.discord_id:
            try:
                self.client.loop.run_until_complete(
                    self.client.http.edit_message(
                        self.HINT_CHANNEL, hint.discord_id, embeds=[embed]
                    )
                )
            except Exception:
                dispatch_general_alert(
                    _("Discord API failure: modify\n{}").format(traceback.format_exc())
                )
        else:
            message = hint.long_discord_message()
            try:
                discord_id = self.client.loop.run_until_complete(
                    self.client.http.send_message(
                        self.HINT_CHANNEL, message, embeds=[embed]  # type: ignore
                    )
                )["id"]
            except Exception:
                dispatch_general_alert(
                    _("Discord API failure: create\n{}").format(traceback.format_exc())
                )
                return
            hint.discord_id = discord_id
            hint.save(update_fields=("discord_id",))

    def clear_hint(self, hint):
        HintsConsumer.send_to_all(json.dumps({"id": hint.id}))
        if self.client is None:
            logger.info(_("Hint done: {}").format(hint))
        elif hint.discord_id:
            # what DPPH did instead of deleting messages:
            # (nb. I tried to make these colors color-blind friendly)

            embed = collections.defaultdict(lambda: collections.defaultdict(dict))
            if hint.status == hint.ANSWERED:
                embed["color"] = 0xAAFFAA  # type: ignore
            elif hint.status == hint.REFUNDED:
                embed["color"] = 0xCC6600  # type: ignore
            # nothing for obsolete

            embed["author"]["name"] = _("{} by {}").format(hint.get_status_display(), hint.claimer)  # type: ignore
            embed["author"]["url"] = hint.full_url()
            embed["description"] = hint.response[:250]
            avatar = self.get_avatar(hint.claimer)
            if avatar:
                embed["author"]["icon_url"] = avatar
            debug = _("claimed by {}").format(hint.claimer)
            try:
                self.client.loop.run_until_complete(
                    self.client.http.edit_message(
                        self.HINT_CHANNEL,
                        hint.discord_id,
                        content=hint.short_discord_message(),
                        embeds=[embed],
                    )
                )
            except Exception:
                dispatch_general_alert(
                    _("Discord API failure: modify\n{}").format(traceback.format_exc())
                )


discord_interface = DiscordInterface()


@receiver(send_notification)
def broadcast_notification(sender, notification_type, title, desc, team, **kwargs):
    print(f"broadcasting notification to {team}")
    room = Room.objects.get(channel_name=f"notifications-{team}")

    channel = get_channel_layer()
    if channel is not None:
        message = {
            "type": notification_type,
            "title": title,
            "desc": desc,
        }
        channel_layer_message = {"type": "forward.message", "data": json.dumps(message)}

        async_to_sync(channel.group_send)(room.channel_name, channel_layer_message)

class TeamNotificationsConsumer(WebsocketConsumer):
    def get_room(self):
        return f"notifications-{self.scope['user'].team}"

    def connect(self):
        print(f"connected a new user: {self.scope['user']} {self.channel_name=}")
        self.accept()
        Room.objects.add(self.get_room(), self.channel_name)  # type: ignore

    def disconnect(self, close_code):
        Room.objects.remove(self.get_room(), self.channel_name)  # type: ignore

    def receive(self, text_data):
        client_room = Room.objects.get(channel_name=self.get_room())
        content = json.loads(text_data)

        print(content)
        if content == "heartbeat":
            return

    def forward_message(self, event):
        self.send(text_data=event["data"])

@receiver(create_minor_case_incoming_event)
def broadcast_minor_case_incoming_event(sender, cases, team, **kwargs):
    print(f"broadcasting minor case incoming event to {team}")
    room = Room.objects.get(
                channel_name=f"puzzles-{team}"
            )

    channel = get_channel_layer()
    if channel is not None:
        message = {
            "type": "vote",
            "data": {"cases": cases, "expiration_time": None},
        }
        channel_layer_message = {"type": "forward.message", "data": json.dumps(message)}

        async_to_sync(channel.group_send)(room.channel_name, channel_layer_message)

class VotingConsumer(WebsocketConsumer):
    def get_room(self):
        return f"{self.scope['path'].split('/')[-1]}-{self.scope['user'].team}"

    def connect(self):
        print(f"connected a new user: {self.scope['user']} {self.channel_name=}")
        self.accept()
        Room.objects.add(self.get_room(), self.channel_name)  # type: ignore

    def disconnect(self, close_code):
        Room.objects.remove(self.get_room(), self.channel_name)  # type: ignore

    def send_to_all(self, client_room, response):
        channel = get_channel_layer()
        if channel is not None:
            response = {"type": "forward.message", "data": json.dumps(response)}
            async_to_sync(channel.group_send)(client_room.channel_name, response)

    def receive(self, text_data):
        client_room = Room.objects.get(channel_name=self.get_room())
        content = json.loads(text_data)

        print(content)
        if content == "heartbeat":
            return

        if content["type"] == "vote":
            data = content["data"]
            MinorCaseIncomingEvent = apps.get_model("puzzles", "MinorCaseIncomingEvent")
            incoming_event = MinorCaseIncomingEvent.get_current_incoming_event(self.scope.get("user")) # type: ignore
            if not incoming_event:
                return

            incoming_event.vote(data["oldVote"], data["newVote"])
            response = {
                "type": "vote",
                "data": {
                    "cases": incoming_event.get_votes(),
                    "expiration_time": (
                        incoming_event.get_expiration_time().isoformat()
                        if incoming_event.get_expiration_time()
                        else None
                    ),
                    "max_choices": incoming_event.get_num_votes_allowed()
                },
            }
            self.send_to_all(client_room, response)

        elif content["type"] == "finalizeVote":
            MinorCaseIncomingEvent = apps.get_model("puzzles", "MinorCaseIncomingEvent")
            incoming_event = MinorCaseIncomingEvent.get_current_incoming_event(self.scope.get("user"))  # type: ignore
            if incoming_event:
                response = {
                    "type": "finalizeVote",
                    "data": {"chosenCase": incoming_event.finalize_vote()},
                }
                self.send_to_all(client_room, response)

    def forward_message(self, event):
        self.send(text_data=event["data"])