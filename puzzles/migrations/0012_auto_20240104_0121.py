# Generated by Django 3.2.17 on 2024-01-04 06:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("puzzles", "0011_majorcase"),
    ]

    operations = [
        migrations.AddField(
            model_name="round",
            name="description",
            field=models.TextField(blank=True, default="", verbose_name="Description"),
        ),
        migrations.AddField(
            model_name="round",
            name="major_case",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="puzzles.majorcase",
                verbose_name="major case",
            ),
        ),
        migrations.AddField(
            model_name="round",
            name="unlock_global_minor",
            field=models.IntegerField(
                default=-1,
                help_text="If nonnegative, round unlocks after N solves in any major case.",
                verbose_name="Unlock global minor",
            ),
        ),
        migrations.AddField(
            model_name="round",
            name="unlock_local_major",
            field=models.IntegerField(
                default=-1,
                help_text="If nonnegative, round unlocks after N solves in this major case.",
                verbose_name="Unlock local minor",
            ),
        ),
        migrations.CreateModel(
            name="MinorCaseIncoming",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "incoming_datetime",
                    models.DateTimeField(verbose_name="Incoming datetime"),
                ),
                (
                    "minor_case_round",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="puzzles.round",
                        verbose_name="minor case round",
                    ),
                ),
                (
                    "team",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="puzzles.team",
                        verbose_name="team",
                    ),
                ),
            ],
            options={
                "verbose_name": "minor case unlock",
                "verbose_name_plural": "minor case unlocks",
                "unique_together": {("team", "minor_case_round")},
            },
        ),
        migrations.CreateModel(
            name="MinorCaseActive",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "active_datetime",
                    models.DateTimeField(verbose_name="Active datetime"),
                ),
                (
                    "minor_case_round",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="puzzles.round",
                        verbose_name="minor case round",
                    ),
                ),
                (
                    "team",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="puzzles.team",
                        verbose_name="team",
                    ),
                ),
            ],
            options={
                "verbose_name": "minor case unlock",
                "verbose_name_plural": "minor case unlocks",
                "unique_together": {("team", "minor_case_round")},
            },
        ),
    ]
