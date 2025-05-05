# Use official PHP image with necessary extensions
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    zip \
    unzip \
    git \
    libpq-dev \
    libonig-dev \
    libpng-dev \
    libxml2-dev \
    default-mysql-client

# Install PHP extensions for Laravel & MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Install Node.js for React frontend assets
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install Composer manually (avoiding Docker registry issues)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www/html

# Copy Laravel files
COPY . .

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Install React frontend dependencies
RUN npm install && npm run build

# Set correct permissions for Laravel storage & bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache && chown -R www-data:www-data storage bootstrap/cache

# Expose Laravel port for incoming connections
EXPOSE 8000

# Start Laravel application
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
