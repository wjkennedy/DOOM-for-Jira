#!/usr/bin/env python3
"""
Package DOSBox filesystem into Emscripten data file
"""

import os
import sys
import subprocess
import shutil

def find_file_packager():
    """Find the file_packager tool in Emscripten SDK"""
    
    try:
        result = subprocess.run(['which', 'file_packager'], capture_output=True, text=True)
        if result.returncode == 0 and result.stdout.strip():
            path = result.stdout.strip()
            if os.path.exists(path):
                return path
    except:
        pass
    
    emcc_bin = shutil.which('emcc')
    if emcc_bin:
        # Resolve symlinks to get real path
        emcc_real = os.path.realpath(emcc_bin)
        emscripten_dir = os.path.dirname(emcc_real)
        
        # Check for file_packager.py in tools directory
        packager_path = os.path.join(emscripten_dir, 'tools', 'file_packager.py')
        if os.path.exists(packager_path):
            return packager_path
        
        # Check parent directory (for Homebrew installations)
        parent_dir = os.path.dirname(emscripten_dir)
        packager_path = os.path.join(parent_dir, 'libexec', 'tools', 'file_packager.py')
        if os.path.exists(packager_path):
            return packager_path
    
    # Try EMSDK environment variable
    emsdk_path = os.environ.get('EMSDK')
    if emsdk_path:
        locations = [
            os.path.join(emsdk_path, 'upstream', 'emscripten', 'tools', 'file_packager.py'),
            os.path.join(emsdk_path, 'emscripten', 'incoming', 'tools', 'file_packager.py'),
        ]
        for loc in locations:
            if os.path.exists(loc):
                return loc
    
    return None

def package_filesystem(source_dir, output_file):
    """Package a directory into Emscripten filesystem format"""
    
    if not os.path.exists(source_dir):
        print(f"Error: Source directory '{source_dir}' does not exist")
        sys.exit(1)
    
    # Find file_packager
    packager = find_file_packager()
    if not packager:
        print("Error: file_packager not found. Make sure Emscripten is installed and in PATH")
        print("")
        print("You can find it at:")
        print("  $EMSDK/upstream/emscripten/tools/file_packager.py")
        print("")
        print("Make sure to activate Emscripten SDK:")
        print("  source $EMSDK/emsdk_env.sh")
        print("")
        print("Or if installed via Homebrew:")
        print("  brew install emscripten")
        sys.exit(1)
    
    print(f"Using file_packager: {packager}")
    print(f"Packaging {source_dir} into {output_file}...")
    
    env = os.environ.copy()
    
    emcc_bin = shutil.which('emcc')
    if emcc_bin:
        emcc_real = os.path.realpath(emcc_bin)
        emscripten_dir = os.path.dirname(emcc_real)
        
        config_locations = [
            os.path.join(emscripten_dir, '.emscripten'),
            os.path.join(os.path.dirname(emscripten_dir), 'libexec', '.emscripten'),
            os.path.expanduser('~/.emscripten'),
        ]
        
        # Also check EMSDK
        emsdk_root = env.get('EMSDK')
        if emsdk_root:
            config_locations.extend([
                os.path.join(emsdk_root, '.emscripten'),
                os.path.join(emsdk_root, 'upstream', 'emscripten', '.emscripten'),
            ])
        
        # Find first existing config
        for config_path in config_locations:
            if os.path.exists(config_path):
                env['EM_CONFIG'] = config_path
                print(f"Using Emscripten config: {config_path}")
                break
    
    cmd = [
        'python3',
        packager,
        output_file,
        '--preload',
        f'{source_dir}@/',
        '--js-output=' + output_file.replace('.data', '.js')
    ]
    
    print(f"Running: {' '.join(cmd)}")
    
    try:
        subprocess.run(cmd, check=True, env=env)
        print(f"✓ Successfully packaged filesystem")
    except subprocess.CalledProcessError as e:
        print(f"Error: Failed to package filesystem: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"Error: Python 3 not found or file_packager missing")
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: package_dosbox_fs.py <source_dir> <output_file>")
        sys.exit(1)
    
    package_filesystem(sys.argv[1], sys.argv[2])
