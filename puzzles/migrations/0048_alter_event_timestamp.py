# Generated by Django 3.2.17 on 2024-04-11 00:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('puzzles', '0047_event_is_final_runaround'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='timestamp',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Timestamp'),
        ),
    ]
