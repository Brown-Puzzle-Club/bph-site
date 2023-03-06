# Generated by Django 3.0.8 on 2020-08-20 14:01

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import puzzles.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Puzzle',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=500)),
                ('slug', models.SlugField(help_text='Slug used in URLs to identify this puzzle (must be unique)', max_length=500, unique=True)),
                ('body_template', models.CharField(help_text='File name of a Django template (including .html) under\n        puzzle_bodies and solution_bodies containing the puzzle and\n        solution content, respectively', max_length=500)),
                ('answer', models.CharField(help_text='Answer (fine if unnormalized)', max_length=500)),
                ('deep', models.IntegerField(help_text='DEEP/Progress threshold teams must meet to unlock this puzzle', verbose_name='DEEP threshold')),
                ('is_meta', models.BooleanField(default=False)),
                ('emoji', models.CharField(default=':question:', help_text='Emoji to use in Discord integrations involving this puzzle', max_length=500)),
                ('metas', models.ManyToManyField(blank=True, help_text='All metas that this puzzle is part of', limit_choices_to={'is_meta': True}, to='puzzles.Puzzle')),
            ],
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('team_name', models.CharField(help_text='Public team name for scoreboards and communications', max_length=100, unique=True)),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('start_offset', models.DurationField(default=datetime.timedelta, help_text='How much earlier this team should start, for early-testing\n        teams; be careful with this!')),
                ('total_hints_awarded', models.IntegerField(default=0, help_text='Number of additional hints to award the team (on top of\n        the default amount per day)')),
                ('total_free_answers_awarded', models.IntegerField(default=0, help_text='Number of additional free answers to award the team (on\n        top of the default amount per day)')),
                ('last_solve_time', models.DateTimeField(blank=True, null=True)),
                ('is_prerelease_testsolver', models.BooleanField(default=False, help_text='Whether this team is a prerelease testsolver. If true, the\n        team will have access to puzzles before the hunt starts')),
                ('is_hidden', models.BooleanField(default=False, help_text='If a team is hidden, it will not be visible to the\n        public')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TeamMember',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='Email (optional)')),
                ('team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='puzzles.Team')),
            ],
        ),
        migrations.CreateModel(
            name='PuzzleMessage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('guess', models.CharField(max_length=500)),
                ('response', models.TextField()),
                ('puzzle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='puzzles.Puzzle')),
            ],
        ),
        migrations.CreateModel(
            name='Hint',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('submitted_datetime', models.DateTimeField(auto_now_add=True)),
                ('hint_question', models.TextField()),
                ('notify_emails', models.CharField(default='none', max_length=255)),
                ('claimed_datetime', models.DateTimeField(null=True)),
                ('claimer', models.CharField(max_length=255, null=True)),
                ('discord_id', models.CharField(max_length=255, null=True)),
                ('answered_datetime', models.DateTimeField(null=True)),
                ('status', models.CharField(choices=[('NR', 'No response'), ('ANS', 'Answered'), ('AMB', 'Ambiguous'), ('OBS', 'Obsolete')], default='NR', max_length=3)),
                ('response', models.TextField(null=True)),
                ('puzzle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='puzzles.Puzzle')),
                ('team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='puzzles.Team')),
            ],
        ),
        migrations.CreateModel(
            name='Survey',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fun', puzzles.models.RatingField(adjective='fun', max_rating=6)),
                ('difficulty', puzzles.models.RatingField(adjective='hard', max_rating=6)),
                ('comments', models.TextField(blank=True, verbose_name='Anything else:')),
                ('puzzle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='puzzles.Puzzle')),
                ('team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='puzzles.Team')),
            ],
            options={
                'unique_together': {('team', 'puzzle')},
            },
        ),
        migrations.CreateModel(
            name='PuzzleUnlock',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('unlock_datetime', models.DateTimeField(auto_now_add=True)),
                ('puzzle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='puzzles.Puzzle')),
                ('team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='puzzles.Team')),
            ],
            options={
                'unique_together': {('team', 'puzzle')},
            },
        ),
        migrations.CreateModel(
            name='ExtraGuessGrant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('extra_guesses', models.IntegerField()),
                ('puzzle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='puzzles.Puzzle')),
                ('team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='puzzles.Team')),
            ],
            options={
                'unique_together': {('team', 'puzzle')},
            },
        ),
        migrations.CreateModel(
            name='AnswerSubmission',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('submitted_answer', models.CharField(max_length=500)),
                ('is_correct', models.BooleanField()),
                ('submitted_datetime', models.DateTimeField(auto_now_add=True)),
                ('used_free_answer', models.BooleanField()),
                ('puzzle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='puzzles.Puzzle')),
                ('team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='puzzles.Team')),
            ],
            options={
                'unique_together': {('team', 'puzzle', 'submitted_answer')},
            },
        ),
    ]
