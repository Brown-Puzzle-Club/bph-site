This is a Django app for running puzzlehunts, a modified branch of Galactic Trendsetter's [bph-site](https://github.com/galacticpuzzlehunt/bph-site), to run [Brown Puzzlehunt](https://www.brownpuzzlehunt.com/)

On top of the core features of bph-site (teams, puzzle unlocks, interactive puzzles, hints, email + discord hooks, admin panel), we have also implemented:

- PostgreSQL compatibility as an alternative to sqlite.
- React integration with Django state visibility.
- Team site events with websockets (puzzle choice voting)

Past these major features, we have tailored the site to work best for our event, including restructuring the solve structure to fit our BPH2024 major-minor case structre.

# Quick Start

- Set up your environment.

> **NOTE**: If these steps do not work / if you are more comfortable, you can setup a similar environment by creating a new **Python 3.10** conda environment

- Make sure you have Python 3 and the corresponding `pip`. (This may be named `pip3` depending on your environment.)
- We recommend that you install virtualenv: `pip install virtualenv`. This allows you to install this project's dependencies into a "virtual environment" contained in this directory.

  - You can also proceed without virtualenv (skip these steps), which will install the dependencies globally. This is not recommended if you develop in other Python projects on the same machine.

- Create a virtualenv: `virtualenv venv`
  - If you have both Python 2 and Python 3 on your system, use the `-p` argument to `virtualenv` to point to the correct Python runtime, for example: `virtualenv venv -p python3`
  - If this doesn't work, you may have to add to your path; try `python -m virtualenv venv` instead if you don't want to do that.
- Activate the virtualenv with `source venv/bin/activate`
  - Alternatively use `venv/bin/activate.csh` or `venv/bin/activate.fish` if you're using csh or fish.
  - Use `venv\Scripts\activate` on Windows.
  - You should run this command each time before you start working on this app.
- Later, when you're done working on the project and want to leave the virtualenv, run `deactivate`.
- Install the required packages: `pip install -r requirements.txt`
- Install postgres
  - **Mac:** With homebrew installed, `brew install libpq && brew install postgresql@14`, then start a new terminal instance.
  - **Windows/other:** [Install PostgreSQL 14](https://www.postgresql.org/download/) from here and add the correct path env variables such that `pg_config` is found from the terminal (`which pg_config` in unix terminal)
- Start the development server with `./manage.py runserver`
  - If you get a warning (red text) about making migrations, stop the server, run `./manage.py migrate`, then start it again.
  - If all went well, the dev server should start, printing its local URL to stdout.
- Build and serve React
  - Requirements: [Node LTS](https://nodejs.org/en/download)
  - `cd` into the `client/` directory and run `npm istall`
  - _React-only development_
    - `npm run dev` and type the route you are developing into your browser url.
  - _Django-integrated development_
    - Build the react project to Django static files by running `npm run build`. Alternatively, you can run `npm run build-watch` to have rebuilds occur on new file edits.
    - View the react page served on the Django route you made by following the `./manage.py runserver` steps above.

# Style Guide

(all code styling is easiest to set up using the Prettier vscode extension)

- **Frontend:**
  - our code is formatted using standard ESLint.
  - our code is styled using tailwind classNames whenever possible. If you are unfamiliar, please read the [documentation](https://tailwindcss.com/)
  - for larger boilerplate components (*buttons, menus, interactive widgets, etc.*) we are using the shadcn component library whenever possible. Look at the `ui/` folder for examples imported and their usage across the site. To import new components, please read the [documentation](https://ui.shadcn.com/docs)
- **Backend:**
  - our code is formatted using Python Black formatter, without type-checking

# Developer How Do I...?

- ...make a new page?

  - Add a route to `client/src/main.tsx` with the `<PageWrapper/>` object wrapped around for Navbar and Footer.

- ...make a new backend-protected page?

  - Add the route to `client/src/main.tsx` like above, but also add a path to `bph/urls.py` that leads to a more protected React view (prerelease_locked, team_locked, or a new one you can make in `puzzles/views.py`)

- ...access backend state in the frontend?

  - User login data is fetched on every page, and can be found in `client/src/hooks/useAuth`. See how `useAuth()` is used in a file for how to access this data.
  - For all other Django data models, see `.../hooks/useDjangoContext`.
  - For all other data, you can find or make a query for it in `puzzles/api`.
    - _Puzzle specific_: see `puzzles/api/puzzlehandlers`

- ...add an API endpoint to the backend? (`puzzles/api`)

  - _data model based:_ make a new `Serializer` in `serializers.py` for the model in `puzzles/models.py`, exposing the fields you need. Then, make a new `ViewSet` in `api_views.py`. Finally, add the `ViewSet` to the router in `api/urls.py`.
    - _The API for this data model is too complex for this ViewSet thing --_ in this case, just add a new path in `urlpatterns` leading to a custom view in `api_views.py`.
  - _action based (making an event happen on the server):_ add a new path in `urlpatterns` leading to a custom view in `api_actions.py`.

- ...create a new model?

  - Add a class to `models.py` on the pattern of the ones already there. To make it show up in `/admin`, add it to `admin.py` as well. Finally, if you add or change any database model or field, you'll need to run `./manage.py makemigrations` to create a migration file, then check that in.
  - If you want to expose the new model to the frontend, you will have to make a new route for it in `api` and a new Zod schema on the frontend side at `client/src/utils/django_types.ts`

- ...use a model?

  - The code should have plenty of examples for creating and reading database objects, and Django's online documentation is quite comprehensive. As a general tip, Django's unobtrusive syntax for database objects means it's very easy to trigger a lookup and not notice. It's mostly important to avoid doing `O(n)` (or worse) separate database lookups for one query; otherwise, don't worry about it too much. However, if you'd like to find opportunities for optimization, you can set up Django to print database queries to the console by changing the `django.db.backends` log setting.

- ...use context?

  - For every single page request, django fills the `.context` field on the original request body. These can be used natively in any backend function dealing with a request, or on the frontend by calling `FetchContext()` from the `useDjangoContext` hook.
  - Context variables are functions that are automatically evaluated in `puzzles/context.py`, which hold hunt-wide stateful info (has the hunt started, when does it close, etc.) as well as team-based info (current unlock progress, admin status, etc.)

- ...add to context?
  - If you make a new function in `puzzles/context.py`, it will automatically be evaluated every backend request / page load. Be careful that this addition does not lag the server on each load.
    - If you wish for the frontend to see this new context variable, you will need to add its type schema to `api/serializers` and then an identical Zod schema to `client/src/utils/django_types.ts`.

# HQ/General Site How Do I...?

- ...even?

  - The site is built on Django, which has a lot of features and is pretty self-contained. Usually, you will start a local server with `./manage.py runserver` and make changes within the `puzzles/` subdirectory. `runserver` will watch for code changes and automatically restart if needed.

- ...set up the database?

  - Local hosting the site should directly hook to our neon test database (email <orion@brown.edu> if you need access). A successful localhost should have this data connected already, and then all you need to do is go into `/admin` with the admin account given to you to make DB changes.

- ...be a superuser?

  - Superusers are a Django concept that allows users access to the `/admin` control panel on the server. We have additionally set it to control access to certain site pages/actions, such as replying to hint requests from teams, or viewing solutions before the deadline. `./manage.py createsuperuser` will make a new superuser from the command line, but this user won't be associated with any team on the site (so it won't be able to e.g. solve puzzles). To fix this, you can head to `/admin` to create a new Team and attach the user.

- ...edit the database?

  - The `/admin` control panel lets you query and modify all of the objects in the database. It should be pretty straightforward to use. It does use the same login as the main site, so you won't be able to log in as a superuser for `/admin` and a non-superuser for the main site in the same browser window.

- ...be a testsolver?

  - We have a notion of prerelease testsolver that is separate from that of superuser. Prerelease testsolvers can see all the puzzles even before the hunt starts. To make a prerelease testsolver, you can find a team in `/admin` and set the relevant checkbox there. Or, to make yourself a prerelease testsolver as a superuser, use the `Toggle testsolver` button in the top bar.

- ...add a "keep going" message? give a team more guesses? delete a team? Issue errata? etc.

  - All these things should be done through `/admin`.

# Hunt Administration

Your main tool will be the Django admin panel, at `/admin` on either a local or production server. Logging in with an admin account will let you edit any database object. Convenience commands are available in the shortcuts menu on the main site.

`manage.py` is a command-line management tool. We've added some custom commands in `puzzles/management/`. If you're running the site in a production environment, you'll need SSH access to the relevant server.

# Digitalocean admin guide

TODO
