# Generated by Django 5.1.1 on 2024-10-10 14:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wiwaka', '0010_alter_order_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('preparing', 'Preparing'), ('ready', 'Ready'), ('done', 'Done')], default='Preparing', max_length=20),
        ),
    ]