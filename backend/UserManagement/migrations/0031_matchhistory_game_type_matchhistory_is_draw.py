# Generated by Django 5.1 on 2025-01-12 12:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserManagement', '0030_remove_friendsprofile_friends_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='matchhistory',
            name='game_type',
            field=models.CharField(max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='matchhistory',
            name='is_draw',
            field=models.BooleanField(default=0),
        ),
    ]
