# HEADY_BRAND:BEGIN
# HEADY SYSTEMS :: SACRED GEOMETRY
# FILE: backend/python_worker/heady_project/nlp_service.py
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
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM, AutoModelForCausalLM
from .utils import get_logger
from .gpu_optimizer import gpu_optimizer

logger = get_logger(__name__)

class NLPService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(NLPService, cls).__new__(cls)
            cls._instance.initialized = False
        return cls._instance

    def initialize(self):
        if self.initialized:
            return

        logger.info("Initializing NLP models...")
        try:
            # Auto-optimize GPU memory if needed before loading models
            gpu_optimizer.auto_optimize_if_needed(memory_threshold_percent=70.0)
            
            # Check for GPU with detailed metrics
            metrics = gpu_optimizer.get_gpu_metrics()
            device = 0 if torch.cuda.is_available() else -1
            
            if metrics.gpu_available:
                logger.info(f"Using GPU: {metrics.gpu_name}")
                logger.info(f"GPU Memory: {metrics.total_memory_gb:.2f}GB total, {metrics.free_memory_gb:.2f}GB free")
            else:
                logger.info("Using CPU (GPU not available)")

            # Summarization (T5-small is lightweight)
            logger.info("Loading summarization model (t5-small)...")
            self.summarizer = pipeline("summarization", model="t5-small", device=device)

            # Chat/Text Generation (DistilGPT2 is lightweight)
            logger.info("Loading text generation model (distilgpt2)...")
            self.generator = pipeline("text-generation", model="distilgpt2", device=device)

            self.initialized = True
            logger.info("NLP models initialized successfully.")
            
            # Print GPU status after model loading
            gpu_optimizer.print_gpu_status()
            
        except Exception as e:
            logger.error(f"Failed to initialize NLP models: {e}")
            self.initialized = False

    def summarize_text(self, text: str, max_length: int = 150, min_length: int = 30) -> str:
        if not self.initialized:
            self.initialize()

        try:
            # Auto-optimize if GPU memory is getting full
            gpu_optimizer.auto_optimize_if_needed(memory_threshold_percent=85.0)
            
            # T5 handles "summarize: " prefix better for some variants, but raw text often works for the pipeline
            # Truncate if too long to avoid token limit errors (T5 limit is 512)
            input_text = "summarize: " + text[:2000]
            summary = self.summarizer(input_text, max_length=max_length, min_length=min_length, do_sample=False)
            return summary[0]['summary_text']
        except Exception as e:
            logger.error(f"Summarization failed: {e}")
            # Try GPU optimization and retry once
            if torch.cuda.is_available():
                logger.info("Attempting GPU optimization and retry...")
                gpu_optimizer.optimize_gpu_memory(aggressive=True)
                try:
                    summary = self.summarizer(input_text, max_length=max_length, min_length=min_length, do_sample=False)
                    return summary[0]['summary_text']
                except Exception as retry_e:
                    logger.error(f"Retry failed: {retry_e}")
            return "Error generating summary."

    def generate_response(self, prompt: str, max_length: int = 100) -> str:
        if not self.initialized:
            self.initialize()

        try:
            # Auto-optimize if GPU memory is getting full
            gpu_optimizer.auto_optimize_if_needed(memory_threshold_percent=85.0)
            
            # distilgpt2 is a causal LM, so it continues text. We format it slightly.
            response = self.generator(prompt, max_length=max_length, num_return_sequences=1)
            return response[0]['generated_text']
        except Exception as e:
            logger.error(f"Generation failed: {e}")
            # Try GPU optimization and retry once
            if torch.cuda.is_available():
                logger.info("Attempting GPU optimization and retry...")
                gpu_optimizer.optimize_gpu_memory(aggressive=True)
                try:
                    response = self.generator(prompt, max_length=max_length, num_return_sequences=1)
                    return response[0]['generated_text']
                except Exception as retry_e:
                    logger.error(f"Retry failed: {retry_e}")
            return "Error generating response."
    
    def get_gpu_status(self) -> dict:
        """Get current GPU status for monitoring"""
        metrics = gpu_optimizer.get_gpu_metrics()
        efficiency = gpu_optimizer.get_memory_efficiency_score()
        
        return {
            "gpu_available": metrics.gpu_available,
            "gpu_name": metrics.gpu_name,
            "total_memory_gb": metrics.total_memory_gb,
            "allocated_memory_gb": metrics.allocated_memory_gb,
            "free_memory_gb": metrics.free_memory_gb,
            "utilization_percent": metrics.utilization_percent,
            "efficiency_score": efficiency.get("overall_score", 0),
            "suggestions": gpu_optimizer.suggest_optimizations()
        }

nlp_service = NLPService()
