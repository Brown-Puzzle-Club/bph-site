# Generated by Django 3.2.17 on 2024-04-13 12:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('puzzles', '0053_auto_20240412_0337'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='requires_answer',
            field=models.BooleanField(default=False, verbose_name='Requires answer'),
        ),
    ]
