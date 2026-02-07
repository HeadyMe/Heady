// Package heady provides a Go client for the Heady API.
package heady

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// Config holds client configuration.
type Config struct {
	APIKey  string
	BaseURL string
	Timeout time.Duration
}

// Client is a Heady API client.
type Client struct {
	config Config
	http   *http.Client
}

// ChatResponse holds a chat response from the API.
type ChatResponse struct {
	Message string `json:"message"`
	Agent   string `json:"agent,omitempty"`
	Model   string `json:"model,omitempty"`
}

// HealthResponse holds a health check response.
type HealthResponse struct {
	OK      bool   `json:"ok"`
	Service string `json:"service"`
	TS      string `json:"ts"`
}

// NewClient creates a new Heady API client.
func NewClient(cfg Config) *Client {
	if cfg.BaseURL == "" {
		cfg.BaseURL = "http://localhost:3300"
	}
	if cfg.Timeout == 0 {
		cfg.Timeout = 30 * time.Second
	}
	return &Client{
		config: cfg,
		http:   &http.Client{Timeout: cfg.Timeout},
	}
}

// Chat sends a message to the Heady assistant and returns the response.
func (c *Client) Chat(message string) (*ChatResponse, error) {
	body := map[string]string{"message": message}
	data, err := json.Marshal(body)
	if err != nil {
		return nil, fmt.Errorf("marshal: %w", err)
	}

	req, err := http.NewRequest("POST", c.config.BaseURL+"/api/chat", bytes.NewReader(data))
	if err != nil {
		return nil, fmt.Errorf("request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	if c.config.APIKey != "" {
		req.Header.Set("Authorization", "Bearer "+c.config.APIKey)
	}

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, fmt.Errorf("do: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("read: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("status %d: %s", resp.StatusCode, string(respBody))
	}

	var chatResp ChatResponse
	if err := json.Unmarshal(respBody, &chatResp); err != nil {
		return nil, fmt.Errorf("unmarshal: %w", err)
	}
	return &chatResp, nil
}

// Health checks the Heady API health endpoint.
func (c *Client) Health() (*HealthResponse, error) {
	resp, err := c.http.Get(c.config.BaseURL + "/api/health")
	if err != nil {
		return nil, fmt.Errorf("health: %w", err)
	}
	defer resp.Body.Close()

	var health HealthResponse
	if err := json.NewDecoder(resp.Body).Decode(&health); err != nil {
		return nil, fmt.Errorf("decode: %w", err)
	}
	return &health, nil
}
