# Generated by Django 5.1.1 on 2024-10-10 13:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wiwaka', '0009_order_updated_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('preparing', 'Preparing'), ('ready', 'Ready'), ('done', 'Done')], default='preparing', max_length=20),
        ),
    ]