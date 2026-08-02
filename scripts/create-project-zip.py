import os
import sys
import zipfile
import subprocess

def prepare_and_zip():
    # 1. Build Vite web assets first so dist/ is up-to-date
    print("Building web assets with vite...")
    try:
        subprocess.run(["npx", "vite", "build"], check=True)
    except Exception as e:
        print(f"Warning/Error during vite build: {e}")

    # 2. Copy dist/ assets into android/app/src/main/assets/public and android/app/src/main/assets/www
    dist_dir = os.path.join(os.getcwd(), 'dist')
    assets_dir = os.path.join(os.getcwd(), 'android', 'app', 'src', 'main', 'assets', 'public')
    assets_www_dir = os.path.join(os.getcwd(), 'android', 'app', 'src', 'main', 'assets', 'www')
    
    os.makedirs(assets_dir, exist_ok=True)
    os.makedirs(assets_www_dir, exist_ok=True)

    if os.path.exists(dist_dir):
        for root, _, files in os.walk(dist_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, dist_dir)
                
                dest_path = os.path.join(assets_dir, rel_path)
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                with open(full_path, 'rb') as f_in, open(dest_path, 'wb') as f_out:
                    f_out.write(f_in.read())

                dest_www_path = os.path.join(assets_www_dir, rel_path)
                os.makedirs(os.path.dirname(dest_www_path), exist_ok=True)
                with open(full_path, 'rb') as f_in, open(dest_www_path, 'wb') as f_out:
                    f_out.write(f_in.read())

    # 3. Define output zip paths
    zip_filename = "Teacher-AI-Android-Project.zip"
    output_paths = [
        os.path.join(os.getcwd(), "public", zip_filename),
        os.path.join(os.getcwd(), "build-outputs", zip_filename),
        os.path.join(os.getcwd(), zip_filename)
    ]

    for p in output_paths:
        os.makedirs(os.path.dirname(p), exist_ok=True)

    primary_zip_path = output_paths[0]

    # Ignore patterns
    ignored_dirs = {'node_modules', '.git', '.cache', 'build-outputs'}
    ignored_files = {zip_filename, 'app-debug.apk'}

    print(f"Creating source ZIP at: {primary_zip_path}")
    with zipfile.ZipFile(primary_zip_path, 'w', compression=zipfile.ZIP_DEFLATED) as zip_file:
        for root, dirs, files in os.walk(os.getcwd()):
            # Exclude ignored directories
            dirs[:] = [d for d in dirs if d not in ignored_dirs and not d.startswith('.')]
            
            for file in files:
                if file in ignored_files or file.endswith('.zip') or file.endswith('.apk'):
                    continue
                
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, os.getcwd())
                
                zip_file.write(full_path, rel_path)

    # Copy to all target output paths
    for p in output_paths[1:]:
        with open(primary_zip_path, 'rb') as f_in, open(p, 'wb') as f_out:
            f_out.write(f_in.read())

    print(f"Successfully generated source project ZIP at all target locations!")

if __name__ == '__main__':
    prepare_and_zip()
