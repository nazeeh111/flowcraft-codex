#!/usr/bin/env python3
"""Copy this skill to an unused user-owned destination; never overwrite work."""
import argparse
import os
from pathlib import Path
import shutil


def install(source, destination):
    source, destination = Path(source).resolve(), Path(destination).expanduser().absolute()
    if destination.exists() or destination.is_symlink():
        raise ValueError(f'Destination exists; choose a new destination or back it up first: {destination}')
    # Normalize parent aliases (for example /var versus /private/var on macOS)
    # after refusing a destination symlink, before checking source containment.
    destination = destination.resolve()
    if destination == source or source in destination.parents:
        raise ValueError('Destination cannot be inside the source package')
    if not (source / 'SKILL.md').is_file():
        raise ValueError('Source does not contain SKILL.md')
    if not (source / 'node_modules').is_dir():
        raise ValueError('Renderer dependencies missing; run npm ci in the source folder first')
    # Include dependencies so installed helper resolution is independent of the checkout.
    shutil.copytree(source, destination, ignore=shutil.ignore_patterns('.git', '.github', 'tests', 'examples', '__pycache__', '.DS_Store'))
    return destination


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--dest', type=Path, default=Path(os.environ.get('CODEX_HOME', str(Path.home()/'.codex')))/'skills/flowcraft')
    args=p.parse_args()
    try:
        print(install(Path(__file__).resolve().parent.parent, args.dest))
    except (OSError, ValueError) as e:
        p.exit(1, f'install: {e}\n')
