from .clean import TextCleaner
from backend.app.core.logging import get_logger

logger = get_logger(__name__, system_type='ml')


class FeatureExtractor:
    TECH_KEYWORDS = frozenset(
        [
            # Programming Languages & Runtimes
            'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'rust',
            'golang', 'ruby', 'kotlin', 'swift', 'dart', 'php', 'scala',
            'elixir', 'haskell', 'lua', 'clojure', 'f#', 'fortran', 'assembly',
            'solidity', 'zig', 'carbon', 'mojo', 'node.js', 'bun', 'deno',

            # Frameworks & Libraries
            'react', 'angular', 'vue.js', 'svelte', 'next.js', 'nuxt.js',
            'express.js', 'nestjs', 'fastapi', 'django', 'flask', 'laravel',
            'spring boot', 'asp.net', 'ruby on rails', 'tailwindcss', 'keras',
            'bootstrap', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas',
            'numpy', 'matplotlib', 'opencv', 'langchain', 'llama-index',
            'flutter', 'react native', 'ionic',

            # AI, ML & Data Science (2026 Trends)
            'artificial intelligence', 'machine learning', 'deep learning',
            'generative ai', 'genai', 'large language models', 'llm', 'nlp',
            'natural language processing', 'computer vision', 'transformers',
            'neural networks', 'reinforcement learning',  'bert', 'gpt-4',
            'gpt-5', 'prompt engineering', 'retrieval-augmented generation',
            'rag', 'ai agents', 'vector embeddings', 'data mining', 'big data',
            'data engineering', 'analytics', 'statistics', 'mlops',

            # Backend, APIs & Architecture
            'backend', 'microservices', 'serverless', 'rest api', 'graphql',
            'grpc', 'trpc', 'websockets', 'soap', 'api gateway', 'kafka',
            'message queue', 'rabbitmq', 'redis', 'system design', 'monolith',
            'software architecture', 'design patterns', 'event-driven', 'mvc',
            'soa',

            # Infrastructure, Cloud & DevOps
            'devops', 'cloud computing', 'aws', 'amazon web services', 'azure',
            'google cloud', 'gcp', 'docker', 'kubernetes', 'k8s', 'terraform',
            'ansible', 'jenkins', 'ci/cd', 'github actions', 'linux', 'unix',
            'ubuntu', 'bash', 'powershell', 'nginx', 'apache', 'prometheus',
            'grafana', 'terraform', 'infrastructure as code', 'iac', 'sre',
            'site reliability',

            # Databases & Storage
            'database', 'sql', 'nosql', 'postgresql', 'mysql', 'mongodb',
            'cassandra', 'elasticsearch', 'dynamodb', 'redis', 'neo4j',
            'pinecone', 'milvus', 'weaviate', 'supabase', 'prisma', 'drizzle',
            'sharding', 'replication', 'acid', 'data warehouse', 'data lake',

            # Software Engineering & Methodology
            'coding', 'programming', 'software engineering', 'clean code',
            'solid principles', 'agile', 'scrum', 'kanban', 'tdd',
            'test driven development', 'unit testing', 'integration testing',
            'debugging', 'version control', 'git', 'github', 'gitlab',
            'bitbucket', 'object-oriented', 'oop', 'functional programming',
            'refactoring',

            # Cybersecurity & Web Security
            'cybersecurity', 'information security', 'ethical hacking', 'jwt',
            'penetration testing', 'encryption', 'cryptography', 'oauth',
            'auth0', 'firewall', 'zero trust', 'ssl', 'tls', 'vulnerability',

            # Emerging Tech & Others
            'blockchain', 'web3', 'smart contracts', 'ethereum', 'iot',
            'internet of things', 'quantum computing', 'augmented reality',
            'virtual reality', 'xr', 'game development', 'unreal engine',
            'embedded systems', 'rtos', 'webassembly', 'wasm', 'unity',
        ]
    )

    @staticmethod
    def feature_extractor(text: str) -> dict:
        if not text:
            logger.warning('Received empty text for feature extraction')
            return {'tech_score': 0}

        try:
            text = TextCleaner.text_cleaner(text)
            tech_score = sum(1 for kw in FeatureExtractor.TECH_KEYWORDS if kw in text.lower())

            features = {
                'name_cleaned': text,
                'tech_score': tech_score,
            }

            logger.info(f'Features extracted: {features}')

        except Exception as e:
            logger.error(f'Error extracting features: {e}')
            return {
                'tech_score': 0,
                'error': str(e)
            }

        return features
