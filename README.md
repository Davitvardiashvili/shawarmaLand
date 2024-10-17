# shawarmaLand

For start

docker-compose up --build

after build run database migrations rudik

docker-compose run web python manage.py migrate

after create superuser and use login endpoint

docker-compose run web python manage.py createsuperuser