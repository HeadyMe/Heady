# HEADY_BRAND:BEGIN
# HEADY SYSTEMS :: SACRED GEOMETRY
# FILE: backend/python_worker/heady_project/gpu_optimizer.py
# LAYER: backend
# 
#         _   _  _____    _    ____   __   __
#        | | | || ____|  / \  |  _ \ \ \ / /
#        | |_| ||  _|   / _ \ | | | | \ V / 
#        |  _  || |___ / ___ \| |_| |  | |  
#        |_| |_||_____/_/   \_\____/   |_|  
# 
#    Sacred Geometry :: Organic Systems :: Breathing Interfaces
# HEADY_BRAND:END

import logging
import torch
import gc
import psutil
import time
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from .utils import get_logger

logger = get_logger(__name__)

@dataclass
class GPUMetrics:
    """GPU utilization and memory metrics"""
    gpu_available: bool
    gpu_name: str = ""
    total_memory_gb: float = 0.0
    allocated_memory_gb: float = 0.0
    cached_memory_gb: float = 0.0
    free_memory_gb: float = 0.0
    utilization_percent: float = 0.0
    temperature_celsius: float = 0.0
    power_usage_watts: float = 0.0

@dataclass
class OptimizationResult:
    """Result of GPU optimization operation"""
    success: bool
    memory_freed_gb: float = 0.0
    optimization_time_seconds: float = 0.0
    message: str = ""

class GPUOptimizer:
    """Comprehensive GPU monitoring and optimization for Colab"""
    
    def __init__(self):
        self.is_colab = self._detect_colab()
        self.optimization_history: List[OptimizationResult] = []
        
    def _detect_colab(self) -> bool:
        """Detect if running in Google Colab"""
        try:
            import google.colab
            return True
        except ImportError:
            return False
    
    def get_gpu_metrics(self) -> GPUMetrics:
        """Get comprehensive GPU metrics"""
        if not torch.cuda.is_available():
            return GPUMetrics(gpu_available=False)
        
        try:
            device = torch.cuda.current_device()
            gpu_name = torch.cuda.get_device_name(device)
            
            # Memory information
            total_memory = torch.cuda.get_device_properties(device).total_memory
            allocated_memory = torch.cuda.memory_allocated(device)
            cached_memory = torch.cuda.memory_reserved(device)
            free_memory = total_memory - allocated_memory
            
            # Convert to GB
            total_memory_gb = total_memory / (1024**3)
            allocated_memory_gb = allocated_memory / (1024**3)
            cached_memory_gb = cached_memory / (1024**3)
            free_memory_gb = free_memory / (1024**3)
            
            # Try to get utilization and other metrics (nvidia-ml-py if available)
            utilization_percent = 0.0
            temperature_celsius = 0.0
            power_usage_watts = 0.0
            
            try:
                import pynvml
                pynvml.nvmlInit()
                handle = pynvml.nvmlDeviceGetHandleByIndex(device)
                utilization = pynvml.nvmlDeviceGetUtilizationRates(handle)
                utilization_percent = utilization.gpu
                
                try:
                    temperature_celsius = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
                except:
                    pass
                    
                try:
                    power_usage_watts = pynvml.nvmlDeviceGetPowerUsage(handle) / 1000.0
                except:
                    pass
                    
            except ImportError:
                logger.info("pynvml not available - limited GPU metrics")
            except Exception as e:
                logger.debug(f"Could not get detailed GPU metrics: {e}")
            
            return GPUMetrics(
                gpu_available=True,
                gpu_name=gpu_name,
                total_memory_gb=total_memory_gb,
                allocated_memory_gb=allocated_memory_gb,
                cached_memory_gb=cached_memory_gb,
                free_memory_gb=free_memory_gb,
                utilization_percent=utilization_percent,
                temperature_celsius=temperature_celsius,
                power_usage_watts=power_usage_watts
            )
            
        except Exception as e:
            logger.error(f"Error getting GPU metrics: {e}")
            return GPUMetrics(gpu_available=False)
    
    def optimize_gpu_memory(self, aggressive: bool = False) -> OptimizationResult:
        """Optimize GPU memory usage"""
        start_time = time.time()
        initial_memory = 0.0
        
        if torch.cuda.is_available():
            device = torch.cuda.current_device()
            initial_memory = torch.cuda.memory_allocated(device) / (1024**3)
            
            try:
                # Clear cache
                torch.cuda.empty_cache()
                
                # Force garbage collection
                gc.collect()
                
                if aggressive:
                    # More aggressive cleanup
                    for _ in range(3):
                        gc.collect()
                        torch.cuda.empty_cache()
                    
                    # Reset peak memory stats
                    torch.cuda.reset_peak_memory_stats(device)
                
                final_memory = torch.cuda.memory_allocated(device) / (1024**3)
                memory_freed = initial_memory - final_memory
                optimization_time = time.time() - start_time
                
                result = OptimizationResult(
                    success=True,
                    memory_freed_gb=memory_freed,
                    optimization_time_seconds=optimization_time,
                    message=f"Freed {memory_freed:.2f}GB GPU memory in {optimization_time:.2f}s"
                )
                
                self.optimization_history.append(result)
                logger.info(f"GPU optimization: {result.message}")
                return result
                
            except Exception as e:
                optimization_time = time.time() - start_time
                result = OptimizationResult(
                    success=False,
                    optimization_time_seconds=optimization_time,
                    message=f"GPU optimization failed: {e}"
                )
                logger.error(f"GPU optimization failed: {e}")
                return result
        else:
            return OptimizationResult(
                success=False,
                message="GPU not available"
            )
    
    def get_memory_efficiency_score(self) -> Dict[str, float]:
        """Calculate memory efficiency score"""
        metrics = self.get_gpu_metrics()
        
        if not metrics.gpu_available:
            return {"overall_score": 0.0, "gpu_available": False}
        
        # Memory efficiency (lower usage is better until you need it)
        memory_usage_ratio = metrics.allocated_memory_gb / metrics.total_memory_gb
        memory_efficiency = max(0, 100 - (memory_usage_ratio * 100))
        
        # Cache efficiency (cached vs allocated)
        if metrics.allocated_memory_gb > 0:
            cache_ratio = metrics.cached_memory_gb / metrics.allocated_memory_gb
            cache_efficiency = max(0, 100 - (cache_ratio * 50))  # Some cache is good
        else:
            cache_efficiency = 100.0
        
        # Overall efficiency score
        overall_score = (memory_efficiency + cache_efficiency) / 2
        
        return {
            "overall_score": overall_score,
            "memory_efficiency": memory_efficiency,
            "cache_efficiency": cache_efficiency,
            "memory_usage_ratio": memory_usage_ratio,
            "gpu_available": True
        }
    
    def suggest_optimizations(self) -> List[str]:
        """Suggest GPU optimizations based on current state"""
        suggestions = []
        metrics = self.get_gpu_metrics()
        
        if not metrics.gpu_available:
            return ["GPU not available - consider enabling GPU in Colab runtime"]
        
        # Memory usage suggestions
        if metrics.allocated_memory_gb > metrics.total_memory_gb * 0.9:
            suggestions.append("CRITICAL: GPU memory nearly full - run aggressive optimization")
            suggestions.append("Consider reducing model size or batch size")
        elif metrics.allocated_memory_gb > metrics.total_memory_gb * 0.7:
            suggestions.append("High GPU memory usage - consider optimization")
        
        # Cache suggestions
        if metrics.cached_memory_gb > metrics.allocated_memory_gb * 2:
            suggestions.append("Large GPU cache - consider clearing cache")
        
        # Temperature suggestions
        if metrics.temperature_celsius > 80:
            suggestions.append("High GPU temperature - consider reducing workload")
        
        # Utilization suggestions
        if metrics.utilization_percent < 50 and metrics.allocated_memory_gb > 0:
            suggestions.append("Low GPU utilization with memory allocated - check for inefficient code")
        
        # Colab-specific suggestions
        if self.is_colab:
            if metrics.total_memory_gb < 16:
                suggestions.append("Consider upgrading to Colab Pro for more GPU memory")
            suggestions.append("Use torch.cuda.empty_cache() frequently in Colab")
        
        return suggestions
    
    def monitor_gpu_usage(self, duration_seconds: int = 60, interval_seconds: int = 5) -> List[Dict]:
        """Monitor GPU usage over time"""
        if not torch.cuda.is_available():
            return []
        
        monitoring_data = []
        start_time = time.time()
        
        while time.time() - start_time < duration_seconds:
            metrics = self.get_gpu_metrics()
            system_memory = psutil.virtual_memory()
            
            data_point = {
                "timestamp": time.time(),
                "gpu_memory_allocated_gb": metrics.allocated_memory_gb,
                "gpu_memory_cached_gb": metrics.cached_memory_gb,
                "gpu_memory_free_gb": metrics.free_memory_gb,
                "gpu_utilization_percent": metrics.utilization_percent,
                "gpu_temperature_celsius": metrics.temperature_celsius,
                "system_memory_percent": system_memory.percent,
                "system_memory_available_gb": system_memory.available / (1024**3)
            }
            
            monitoring_data.append(data_point)
            time.sleep(interval_seconds)
        
        return monitoring_data
    
    def print_gpu_status(self):
        """Print comprehensive GPU status"""
        metrics = self.get_gpu_metrics()
        efficiency = self.get_memory_efficiency_score()
        
        print("\n" + "="*60)
        print("🔥 GPU STATUS REPORT")
        print("="*60)
        
        if not metrics.gpu_available:
            print("❌ GPU not available")
            print("💡 Enable GPU in Colab: Runtime > Change runtime type > GPU")
            return
        
        print(f"🎯 GPU: {metrics.gpu_name}")
        print(f"💾 Total Memory: {metrics.total_memory_gb:.2f} GB")
        print(f"📊 Allocated: {metrics.allocated_memory_gb:.2f} GB ({(metrics.allocated_memory_gb/metrics.total_memory_gb*100):.1f}%)")
        print(f"🗂️  Cached: {metrics.cached_memory_gb:.2f} GB")
        print(f"✨ Free: {metrics.free_memory_gb:.2f} GB")
        
        if metrics.utilization_percent > 0:
            print(f"⚡ Utilization: {metrics.utilization_percent:.1f}%")
        if metrics.temperature_celsius > 0:
            print(f"🌡️  Temperature: {metrics.temperature_celsius:.1f}°C")
        if metrics.power_usage_watts > 0:
            print(f"⚡ Power: {metrics.power_usage_watts:.1f}W")
        
        print(f"\n📈 Efficiency Score: {efficiency['overall_score']:.1f}/100")
        print(f"   Memory Efficiency: {efficiency['memory_efficiency']:.1f}/100")
        print(f"   Cache Efficiency: {efficiency['cache_efficiency']:.1f}/100")
        
        # Suggestions
        suggestions = self.suggest_optimizations()
        if suggestions:
            print(f"\n💡 Suggestions ({len(suggestions)}):")
            for i, suggestion in enumerate(suggestions, 1):
                print(f"   {i}. {suggestion}")
        
        print("="*60)
    
    def auto_optimize_if_needed(self, memory_threshold_percent: float = 80.0) -> Optional[OptimizationResult]:
        """Automatically optimize if memory usage exceeds threshold"""
        metrics = self.get_gpu_metrics()
        
        if not metrics.gpu_available:
            return None
        
        memory_usage_percent = (metrics.allocated_memory_gb / metrics.total_memory_gb) * 100
        
        if memory_usage_percent > memory_threshold_percent:
            logger.info(f"Auto-optimizing GPU memory (usage: {memory_usage_percent:.1f}% > {memory_threshold_percent}%)")
            aggressive = memory_usage_percent > 90.0
            return self.optimize_gpu_memory(aggressive=aggressive)
        
        return None

# Global instance
gpu_optimizer = GPUOptimizer()
