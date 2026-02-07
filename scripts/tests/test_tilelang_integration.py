# HEADY_BRAND:BEGIN
# HEADY SYSTEMS :: SACRED GEOMETRY
# FILE: scripts/tests/test_tilelang_integration.py
# LAYER: dev
# HEADY_BRAND:END

import sys
import time
import os
from pathlib import Path

# Add project roots to path
project_root = Path(__file__).parent.parent.parent
sys.path.append(str(project_root))
sys.path.append(str(project_root / "HeadyAcademy"))
sys.path.append(str(project_root / "backend" / "python_worker"))

try:
    import numpy as np
    from process_data import _mean_pool_2d, _tilelang_mean_pool_2d, TILELANG_AVAILABLE
except ImportError as e:
    print(f"Error importing modules: {e}")
    sys.exit(1)

def benchmark_pooling():
    print(f"∞ TileLang Integration Benchmark ∞")
    print(f"TileLang Available: {TILELANG_AVAILABLE}")
    
    # Create mock embedding matrix (e.g., 512 tokens, 768 dimensions)
    matrix = np.random.rand(512, 768).tolist()
    
    # Benchmark Standard
    start = time.perf_counter()
    standard_result = _mean_pool_2d(matrix)
    standard_time = time.perf_counter() - start
    print(f"Standard Pooling: {standard_time:.6f}s")
    
    # Benchmark TileLang (Prototype fallback/hook)
    start = time.perf_counter()
    tl_result = _tilelang_mean_pool_2d(matrix)
    tl_time = time.perf_counter() - start
    print(f"TileLang-Hook Pooling: {tl_time:.6f}s")
    
    if TILELANG_AVAILABLE:
        print("✅ TileLang detected and hooked.")
    else:
        print("ℹ️ TileLang not installed. Running in architectural fallback mode.")

if __name__ == "__main__":
    benchmark_pooling()
