# Easy Learn

GED self-study learning website prototype organized for parallel frontend, Spring Boot MVC backend, and PostgreSQL work.

```text
EasyLearn/
├── frontend/
│   ├── index.html, about.html, services.html, contact.html
│   ├── subjects.html             # GED Math, RLA, Science, Social Studies
│   ├── typing.html               # progressive timed typing levels
│   ├── assets/                   # logo
│   ├── css/                      # shared design and readability styles
│   └── js/app.js                 # frontend interactions
├── backend/
│   └── src/
│       ├── main/java/com/easylearn/
│       │   ├── controller/ service/ repository/ entity/
│       │   ├── dto/request/ dto/response/ config/ exception/
│       │   └── resources/
│       └── test/java/com/easylearn/
└── database/
    ├── migrations/               # ordered PostgreSQL changes
    └── seed-data/                # development examples
```

Start at `frontend/index.html`. Backend package directories are scaffolding; the Spring Boot Maven setup and API implementation are the next teammate tasks. PostgreSQL connection examples are in `backend/src/main/resources/application.properties.example`.
