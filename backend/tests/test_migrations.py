import importlib.util
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REVISION_PATH = (
    ROOT / "alembic-conf" / "versions" / "af653f1c9c59_create_initial_tables.py"
)


def load_revision_module():
    spec = importlib.util.spec_from_file_location("initial_migration", REVISION_PATH)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def test_db_base_registers_all_models_for_alembic():
    result = subprocess.run(
        [
            sys.executable,
            "-c",
            (
                "from db.base import Base; "
                "print(sorted(Base.metadata.tables.keys()))"
            ),
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    )

    assert result.stdout.strip() == "['categories', 'expenses', 'goals', 'users']"


def test_initial_migration_creates_application_tables(monkeypatch):
    module = load_revision_module()
    created_tables: list[str] = []

    def fake_create_table(name, *args, **kwargs):
        created_tables.append(name)

    monkeypatch.setattr(module.op, "f", lambda name: name)
    monkeypatch.setattr(module.op, "create_table", fake_create_table)
    monkeypatch.setattr(module.op, "create_index", lambda *args, **kwargs: None)
    module.upgrade()

    assert created_tables == ["users", "categories", "goals", "expenses"]
