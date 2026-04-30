# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nginx reverse proxy configuration for production-like setup
- Swagger UI integration with API documentation
- Trust proxy setting in Express for proper header handling behind proxy

### Changed
- Updated Nginx port from 80 to 8080 to avoid conflicts
- Aligned Swagger server URLs with proxy configuration
- Updated README with new access URLs for Swagger docs

### Fixed
- API documentation now correctly reflects proxied endpoints

## [1.0.0] - 2026-04-30

### Added
- Initial release of Movie Watchlist API
- User authentication with JWT tokens
- Movie management endpoints
- Watchlist functionality
- Prisma ORM with PostgreSQL database
- Docker containerization
- API documentation with Swagger/OpenAPI