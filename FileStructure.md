```
Programming_Books_Recommendation_System/
├── venv/
│
├── system/
│   ├── healthcheck.py
│   └── run_all.sh
│
├── frontend/
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── nginx.conf
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   ├── favicon.png
│   │   └── logo.png
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── MainApp.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── assets/
│       │   └── react.svg
│       ├── components/
│       │   ├── AboutModal.css
│       │   ├── AboutModal.jsx
│       │   ├── Avatar.css
│       │   ├── Avatar.jsx
│       │   ├── BackgroundParticles.css
│       │   ├── BackgroundParticles.jsx
│       │   ├── BookCard.css
│       │   ├── BookCard.jsx
│       │   ├── BookGrid.css
│       │   ├── BookGrid.jsx
│       │   ├── Header.css
│       │   ├── Header.jsx
│       │   ├── InterestsSelector.css
│       │   ├── InterestsSelector.jsx
│       │   ├── KeyboardShortcuts.css
│       │   ├── KeyboardShortcuts.jsx
│       │   ├── LoadingAnimation.css
│       │   ├── LoadingAnimation.jsx
│       │   ├── LogoViewerModal.css
│       │   ├── LogoViewerModal.jsx
│       │   ├── Pagination.css
│       │   ├── Pagination.jsx
│       │   ├── PasswordStrengthMeter.css
│       │   ├── PasswordStrengthMeter.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── SearchBar.css
│       │   ├── SearchBar.jsx
│       │   ├── TagCloud.css
│       │   ├── TagCloud.jsx
│       │   ├── TechTicker.css
│       │   └── TechTicker.jsx
│       ├── constants/
│       │   ├── interests.js
│       │   └── searchSuggestions.js
│       ├── contexts/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── Landing.css
│       │   ├── Landing.jsx
│       │   ├── Login.css
│       │   ├── Login.jsx
│       │   ├── Profile.css
│       │   ├── Profile.jsx
│       │   ├── SignUp.css
│       │   └── SignUp.jsx
│       └── utils/
│           ├── api.js
│           ├── encryption.js
│           ├── storage.js
│           └── validators.js
│
├── backend/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       │
│       ├── core/
│       │   ├── config.py
│       │   ├── hashing.py
│       │   ├── logging.py
│       │   ├── rate_limit.py
│       │   └── security.py
│       │
│       ├── auth/
│       │   ├── routes.py
│       │   ├── schemas.py
│       │   └── service.py
│       │
│       ├── users/
│       │   ├── routes.py
│       │   ├── models.py
│       │   └── service.py
│       │
│       ├── search/
│       │   ├── routes.py
│       │   ├── schemas.py
│       │   ├── cache.py
│       │   └── service.py
│       │
│       ├── enum/
│       │   └── enumerations.py
│       │
│       └── db/
│           ├── postgres.py
│           ├── redis.py
│           ├── pg_vector.py
│           └── migrations/
│               ├── add_interests.sql
│               └── user_sessions.sql
│
├── ml/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── requirements.txt
│   │
│   ├── Enum/
│   │   └── Enumerations.py
│   │
│   ├── pipeline/
│   │   └── v1/
│   │       ├── clean.py
│   │       ├── embed.py
│   │       ├── feature.py
│   │       └── versions.yaml
│   │
│   ├── models/
│   │   └── v1/
│   │       ├── embedder.py
│   │       └── versions.yaml
│   │
│   ├── inference/
│   │   └── search.py
│   │
│   ├── reranking/
│   │   └── reranking.py
│   │
│   ├── services/
│   │   ├── postgres_pool.py
│   │   ├── vector_service.py
│   │   └── metadata_service.py
│   │
│   ├── vector_db/
│   │   └── pgvector/
│   │       └── v1/
│   │           ├── schema.json
│   │           └── version.yaml
│   │
│   ├── data/
│   │   ├── versions.yaml
│   │   ├── merge_books.py
│   │   ├── filter_tech_books.py
│   │   ├── raw/
│   │   │   └── v1/
│   │   │       ├── book1-100k.csv
│   │   │       ├── book100k-200k.csv
│   │   │       └── ...  (19 book CSVs + 7 user_rating CSVs)
│   │   ├── merged/
│   │   │   └── v1/
│   │   │       └── goodreads_merged.csv
│   │   ├── filtered/
│   │   │   └── v1/
│   │   │       └── tech_books_filtered.csv
│   │   ├── featured/
│   │   │   └── v1/
│   │   │       └── books_with_rating_percentages.csv
│   │   ├── processed/
│   │   │   └── v1/
│   │   │       ├── book_backend_full_features.csv
│   │   │       └── books_with_rating_percentages.csv
│   │   └── similarity/
│   │       └── v1/
│   │           └── books_with_similarity.csv
│   │
│   ├── notebooks/
│   │   └── notebooks.md
│   │
│   └── tests/
│       ├── __init__.py
│       ├── conftest.py
│       ├── test.py
│       ├── unit/
│       │   ├── __init__.py
│       │   ├── test_clean.py
│       │   ├── test_embedder_model.py
│       │   ├── test_embed_pipeline.py
│       │   ├── test_feature.py
│       │   ├── test_inference_search.py
│       │   ├── test_metadata_service.py
│       │   ├── test_postgres_pool.py
│       │   ├── test_reranker.py
│       │   └── test_vector_service.py
│       └── integration/
│           ├── __init__.py
│           ├── test_db_services_integration.py
│           └── test_full_inference_pipeline.py
│
├── logs/
│   ├── backend/
│   ├── ml/
│   └── system/
│
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── pytest.ini
├── LICENSE
├── README.md
└── FileStructure.md
```
