# Generated by Django 3.2.17 on 2024-04-06 08:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('puzzles', '0042_auto_20240406_0410'),
    ]

    operations = [
        migrations.AlterField(
            model_name='minorcasevoteevent',
            name='selected_cases',
            field=models.ManyToManyField(blank=True, to='puzzles.Round', verbose_name='Selected minor case(s)'),
        ),
    ]
