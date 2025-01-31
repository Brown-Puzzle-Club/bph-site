# Generated by Django 3.2.16 on 2023-03-07 11:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("puzzles", "0007_auto_20230305_2019"),
    ]

    operations = [
        migrations.AddField(
            model_name="team",
            name="brown_affiliation_desc",
            field=models.CharField(
                default="",
                max_length=200,
                verbose_name="For each member, please describe their affiliation to Brown/RISD (if applicable)",
            ),
        ),
        migrations.AddField(
            model_name="team",
            name="classroom_need",
            field=models.BooleanField(
                default=False,
                help_text="Our availability will be limited, so please do not request one if you can make alternate plans.",
                verbose_name="Do you want to request a classroom to hunt in?",
            ),
        ),
        migrations.AlterField(
            model_name="team",
            name="in_person_sat",
            field=models.IntegerField(
                default=0, verbose_name="number person on Saturday, April 15th"
            ),
        ),
        migrations.AlterField(
            model_name="team",
            name="in_person_sun",
            field=models.IntegerField(
                default=0, verbose_name="number person on Sunday, April 16th?"
            ),
        ),
    ]
